type AnyRecord = Record<string, any>;

const IMG_TOKEN = /(<img\b[^>]*>)/gi;
const SKIP = /^(?:\s|&nbsp;|<br\s*\/?>)*$/i;

export function splitLeadingImages(html: string) {
  const raw = html || "";
  const tokens = raw.split(IMG_TOKEN);
  const images: string[] = [];
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index] || "";
    if (!token) {
      index += 1;
      continue;
    }
    if (/^<img\b/i.test(token)) {
      images.push(token);
      index += 1;
      continue;
    }
    if (SKIP.test(token)) {
      index += 1;
      continue;
    }
    break;
  }

  return {
    imagesHtml: images.join(""),
    restHtml: tokens.slice(index).join(""),
    imageCount: images.length,
  };
}

export function questionImageLink(question: AnyRecord | undefined) {
  const link = question?.image?.link;
  return typeof link === "string" ? link.trim() : "";
}

export function questionHasImage(item: AnyRecord | undefined) {
  const question = item?.question || {};
  const html = String(question.content || "");
  const htmlImgs = html.match(/<img\b/gi)?.length || 0;
  return Boolean(questionImageLink(question)) || htmlImgs > 0;
}

function isReadingImageItem(item: AnyRecord | undefined) {
  return item?.classification === "reading" && questionHasImage(item);
}

export function formatQuestionHtml(html: string, nbspText = true) {
  const withBreaks = String(html)
    .replaceAll("\\r\\n", "<br>")
    .replaceAll("\\n", "<br>");
  if (!nbspText) return withBreaks;
  return withBreaks.replace(/(<[^>]+>)|([^<]+)/g, (_full, tag: string, text: string) => {
    if (tag) return tag;
    return text.replace(/\s/g, "&nbsp;");
  });
}

export function withGroupedImageTools(list: AnyRecord[] = []) {
  const result: Array<{ item: AnyRecord; hideTools: boolean; index: number }> = [];
  let index = 0;

  while (index < list.length) {
    if (isReadingImageItem(list[index])) {
      let end = index;
      while (end < list.length && isReadingImageItem(list[end])) end += 1;
      const hideInnerTools = end - index >= 2;
      let lastPassage = -1;
      for (let i = index; i < end; i++) {
        const type = list[i]?.questionType;
        if (type === "content" || type === "group") lastPassage = i;
      }
      const toolsIndex = lastPassage >= 0 ? lastPassage : end - 1;
      while (index < end) {
        result.push({
          item: list[index],
          hideTools: hideInnerTools && index !== toolsIndex,
          index,
        });
        index += 1;
      }
      continue;
    }

    result.push({ item: list[index], hideTools: false, index });
    index += 1;
  }

  return result;
}
