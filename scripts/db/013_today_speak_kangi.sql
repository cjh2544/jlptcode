-- Local MariaDB: today_speak / today_kangi
-- Safe to re-run. Does not touch MongoDB or production.

CREATE TABLE IF NOT EXISTS `today_speak` (
  `id` VARCHAR(24) NOT NULL,
  `sortNo` INT NOT NULL,
  `sentence` TEXT NULL,
  `sentence_read` TEXT NULL,
  `sentence_translate` TEXT NULL,
  `sentence_locale_en` TEXT NULL,
  `sentence_locale_cn` TEXT NULL,
  `sentence_locale_my` TEXT NULL,
  `keyword` TEXT NULL,
  `speaker` TEXT NULL,
  `image` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `today_speak_sortNo_idx` (`sortNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `today_speak_word` (
  `id` VARCHAR(24) NOT NULL,
  `parent_id` VARCHAR(24) NOT NULL,
  `ko` TEXT NULL,
  `en` TEXT NULL,
  `cn` TEXT NULL,
  `my` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `today_speak_word_parent_id_key` (`parent_id`),
  CONSTRAINT `today_speak_word_parent_fkey`
    FOREIGN KEY (`parent_id`) REFERENCES `today_speak`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `today_kangi` (
  `id` VARCHAR(24) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `sortNo` INT NOT NULL,
  `word` VARCHAR(191) NOT NULL,
  `image` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `today_kangi_level_sortNo_idx` (`level`, `sortNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
