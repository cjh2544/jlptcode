"""
Replace local MariaDB today_speak / today_kangi from Excel exports.
Does not touch MongoDB.
"""
from __future__ import annotations

import os
import re
import secrets
from pathlib import Path
from urllib.parse import unquote, urlparse

import pymysql
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[2]
EXCEL_DIR = Path(
    r"C:\Users\xodus\OneDrive\바탕 화면\JLPTCODE\20261120\xodus776@nate.com_39603"
)
SPEAK_XLSX = EXCEL_DIR / "today_speak.xlsx"
KANGI_XLSX = EXCEL_DIR / "today_kangi.xlsx"
CHUNK = 200


def load_env():
    for name in (".env.local", ".env"):
        path = ROOT / name
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env()


def as_str(value, fallback=None):
    if value is None or value == "":
        return fallback
    return str(value).strip()


def as_int(value, fallback=None):
    if value is None or value == "":
        return fallback
    if isinstance(value, str):
        m = re.search(r"\d+", value)
        if m:
            return int(m.group(0))
    try:
        return int(value)
    except (TypeError, ValueError):
        try:
            return int(float(value))
        except (TypeError, ValueError):
            return fallback


def as_text(value):
    if value is None or value == "":
        return None
    return str(value)


def parse_db_url(url: str):
    parsed = urlparse(url)
    return {
        "host": parsed.hostname or "127.0.0.1",
        "port": parsed.port or 3306,
        "user": unquote(parsed.username or ""),
        "password": unquote(parsed.password or ""),
        "database": parsed.path.lstrip("/"),
        "charset": "utf8mb4",
    }


def row_map(headers, values):
    return {headers[i]: values[i] if i < len(values) else None for i in range(len(headers))}


def split_word_html(raw: str | None):
    """
    Split multi-locale word HTML into ko/en/cn/my HTML blocks.
    Input line shape: "頭語: ko / en / cn / my"
    """
    if raw is None or str(raw).strip() == "":
        return None, None, None, None

    text = str(raw)
    open_tag = ""
    close_tag = ""
    body = text
    m = re.match(r"(?is)^(\s*<p[^>]*>)(.*)(</p>\s*)$", text.strip())
    if m:
        open_tag, body, close_tag = m.group(1), m.group(2), m.group(3)

    lines = re.split(r"(?i)<br\s*/?>", body)
    buckets = {"ko": [], "en": [], "cn": [], "my": []}
    for line in lines:
        cleaned = re.sub(r"(?i)&nbsp;", " ", line).strip()
        cleaned = re.sub(r"\s+", " ", cleaned)
        if not cleaned:
            continue
        if ":" in cleaned:
            head, rest = cleaned.split(":", 1)
            head = head.strip()
            parts = [p.strip() for p in rest.split(" / ")]
        else:
            head = cleaned
            parts = []
        while len(parts) < 4:
            parts.append("")
        for key, meaning in zip(("ko", "en", "cn", "my"), parts[:4]):
            if head and meaning:
                buckets[key].append(f"{head}: {meaning}")
            elif head:
                buckets[key].append(head)
            elif meaning:
                buckets[key].append(meaning)

    def wrap(items: list[str]):
        if not items:
            return None
        joined = "<br />".join(items)
        if open_tag or close_tag:
            return f"{open_tag or '<p>'}{joined}{close_tag or '</p>'}"
        return f"<p>{joined}</p>"

    return wrap(buckets["ko"]), wrap(buckets["en"]), wrap(buckets["cn"]), wrap(buckets["my"])


def drop_today_speak_word_column(cur):
    cur.execute(
        """
        SELECT COUNT(*)
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'today_speak'
          AND COLUMN_NAME = 'word'
        """
    )
    if cur.fetchone()[0]:
        cur.execute("ALTER TABLE `today_speak` DROP COLUMN `word`")
        print("dropped today_speak.word")


def import_speak(cur):
    if not SPEAK_XLSX.exists():
        raise SystemExit(f"Excel not found: {SPEAK_XLSX}")

    drop_today_speak_word_column(cur)

    cur.execute("SELECT COUNT(*) FROM `today_speak`")
    before = cur.fetchone()[0]
    cur.execute("DELETE FROM `today_speak`")
    print(f"deleted_today_speak {before}")

    wb = load_workbook(SPEAK_XLSX, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    headers = None
    parents = []
    words = []
    inserted = 0
    skipped = 0
    parent_sql = """
        INSERT INTO `today_speak` (
          `id`, `sortNo`, `sentence`, `sentence_read`, `sentence_translate`,
          `sentence_locale_en`, `sentence_locale_cn`, `sentence_locale_my`,
          `keyword`, `speaker`, `image`, `created_at`, `updated_at`
        ) VALUES (
          %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(3), NOW(3)
        )
    """
    word_sql = """
        INSERT INTO `today_speak_word` (
          `id`, `parent_id`, `ko`, `en`, `cn`, `my`, `created_at`, `updated_at`
        ) VALUES (%s, %s, %s, %s, %s, %s, NOW(3), NOW(3))
    """
    for i, values in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            headers = [str(c) if c is not None else "" for c in values]
            continue
        row = row_map(headers, values)
        sort_no = as_int(row.get("no"), i)
        if sort_no is None:
            skipped += 1
            continue
        record_id = secrets.token_hex(12)
        ko, en, cn, my = split_word_html(as_text(row.get("word")))
        parents.append(
            (
                record_id,
                sort_no,
                as_text(row.get("sentence")),
                as_text(row.get("sentence_read")),
                as_text(row.get("ko_sentence.translation")),
                as_text(row.get("us_sentence.translation")),
                as_text(row.get("cn_sentence.translation")),
                as_text(row.get("mm_sentence.translation")),
                as_text(row.get("keyword")),
                as_text(row.get("audio.link")),
                as_text(row.get("image.link")),
            )
        )
        if ko or en or cn or my:
            words.append((secrets.token_hex(12), record_id, ko, en, cn, my))
        if len(parents) >= CHUNK:
            cur.executemany(parent_sql, parents)
            if words:
                cur.executemany(word_sql, words)
            inserted += len(parents)
            parents = []
            words = []
            print(f"today_speak inserted {inserted}")
    if parents:
        cur.executemany(parent_sql, parents)
        if words:
            cur.executemany(word_sql, words)
        inserted += len(parents)
    wb.close()
    cur.execute("SELECT COUNT(*) FROM `today_speak`")
    after = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM `today_speak_word`")
    word_count = cur.fetchone()[0]
    print(
        f"today_speak done inserted={inserted} skipped={skipped} "
        f"table_count={after} word_count={word_count}"
    )


def import_kangi(cur):
    if not KANGI_XLSX.exists():
        raise SystemExit(f"Excel not found: {KANGI_XLSX}")

    cur.execute("SELECT COUNT(*) FROM `today_kangi`")
    before = cur.fetchone()[0]
    cur.execute("DELETE FROM `today_kangi`")
    print(f"deleted_today_kangi {before}")

    wb = load_workbook(KANGI_XLSX, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    headers = None
    rows = []
    inserted = 0
    skipped = 0
    sql = """
        INSERT INTO `today_kangi` (
          `id`, `level`, `sortNo`, `word`, `image`, `created_at`, `updated_at`
        ) VALUES (%s, %s, %s, %s, %s, NOW(3), NOW(3))
    """
    for i, values in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            headers = [str(c) if c is not None else "" for c in values]
            continue
        row = row_map(headers, values)
        level = as_str(row.get("level"))
        word = as_str(row.get("word"))
        sort_no = as_int(row.get("sortNo"), as_int(row.get("no"), i))
        if not level or not word or sort_no is None:
            skipped += 1
            continue
        rows.append(
            (
                secrets.token_hex(12),
                level,
                sort_no,
                word,
                as_text(row.get("image.link")),
            )
        )
        if len(rows) >= CHUNK:
            cur.executemany(sql, rows)
            inserted += len(rows)
            rows = []
            print(f"today_kangi inserted {inserted}")
    if rows:
        cur.executemany(sql, rows)
        inserted += len(rows)
    wb.close()
    cur.execute("SELECT COUNT(*) FROM `today_kangi`")
    after = cur.fetchone()[0]
    print(f"today_kangi done inserted={inserted} skipped={skipped} table_count={after}")


def main():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise SystemExit("DATABASE_URL is required")

    conn = pymysql.connect(**parse_db_url(db_url), autocommit=False)
    try:
        with conn.cursor() as cur:
            import_speak(cur)
            import_kangi(cur)
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
