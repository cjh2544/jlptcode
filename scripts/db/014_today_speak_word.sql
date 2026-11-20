-- Split today_speak.word into today_speak_word (ko/en/cn/my HTML).
-- Safe to re-run for CREATE. DROP COLUMN may fail if already removed.

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
