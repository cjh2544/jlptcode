-- Mypage: saved words/questions and quiz progress
-- Safe to re-run: creates tables only if they do not exist.

CREATE TABLE IF NOT EXISTS `user_saved_word` (
  `id` VARCHAR(24) NOT NULL,
  `user_id` VARCHAR(24) NOT NULL,
  `source` VARCHAR(50) NOT NULL,
  `source_id` VARCHAR(24) NOT NULL,
  `word` VARCHAR(191) NULL,
  `read` VARCHAR(191) NULL,
  `means` TEXT NULL,
  `level` VARCHAR(20) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_saved_word_user_id_source_source_id_key` (`user_id`, `source`, `source_id`),
  KEY `user_saved_word_user_created_idx` (`user_id`, `created_at`),
  CONSTRAINT `user_saved_word_user_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_saved_question` (
  `id` VARCHAR(24) NOT NULL,
  `user_id` VARCHAR(24) NOT NULL,
  `source` VARCHAR(50) NOT NULL,
  `source_id` VARCHAR(24) NOT NULL,
  `subject` VARCHAR(50) NOT NULL,
  `content` TEXT NULL,
  `level` VARCHAR(20) NULL,
  `classification` VARCHAR(50) NULL,
  `year` VARCHAR(20) NULL,
  `study` VARCHAR(50) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_saved_question_user_id_source_source_id_key` (`user_id`, `source`, `source_id`),
  KEY `user_saved_question_user_created_idx` (`user_id`, `created_at`),
  CONSTRAINT `user_saved_question_user_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_quiz_attempt` (
  `id` VARCHAR(24) NOT NULL,
  `user_id` VARCHAR(24) NOT NULL,
  `subject` VARCHAR(50) NOT NULL,
  `level` VARCHAR(20) NULL,
  `total` INT NOT NULL,
  `correct` INT NOT NULL,
  `wrong` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `user_quiz_attempt_user_subject_created_idx` (`user_id`, `subject`, `created_at`),
  CONSTRAINT `user_quiz_attempt_user_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_question_result` (
  `id` VARCHAR(24) NOT NULL,
  `user_id` VARCHAR(24) NOT NULL,
  `source` VARCHAR(50) NOT NULL,
  `source_id` VARCHAR(24) NOT NULL,
  `subject` VARCHAR(50) NOT NULL,
  `is_correct` TINYINT(1) NOT NULL,
  `attempt_id` VARCHAR(24) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_question_result_user_id_source_source_id_key` (`user_id`, `source`, `source_id`),
  KEY `user_question_result_user_subject_idx` (`user_id`, `subject`),
  CONSTRAINT `user_question_result_user_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `user_question_result_attempt_fkey`
    FOREIGN KEY (`attempt_id`) REFERENCES `user_quiz_attempt`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
