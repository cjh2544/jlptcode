-- Mypage: saved speak (conversation) items
-- Safe to re-run: creates table only if it does not exist.

CREATE TABLE IF NOT EXISTS `user_saved_speak` (
  `id` VARCHAR(24) NOT NULL,
  `user_id` VARCHAR(24) NOT NULL,
  `source` VARCHAR(50) NOT NULL,
  `source_id` VARCHAR(24) NOT NULL,
  `keyword` TEXT NULL,
  `sentence` TEXT NULL,
  `sentence_read` TEXT NULL,
  `sentence_translate` TEXT NULL,
  `speaker` TEXT NULL,
  `level` VARCHAR(20) NULL,
  `study` VARCHAR(50) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_saved_speak_user_id_source_source_id_key` (`user_id`, `source`, `source_id`),
  KEY `user_saved_speak_user_created_idx` (`user_id`, `created_at`),
  CONSTRAINT `user_saved_speak_user_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
