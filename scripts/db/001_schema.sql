-- Local MariaDB schema for jlptcode
-- Safe to re-run: creates tables only if they do not exist.
-- Does not touch MongoDB.

CREATE TABLE IF NOT EXISTS `user` (
  `id` VARCHAR(24) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NULL,
  `image` TEXT NULL,
  `provider` VARCHAR(50) NOT NULL DEFAULT 'credentials',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_role` (
  `id` VARCHAR(24) NOT NULL,
  `user_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `value` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_role_user_idx` (`user_id`, `sort`),
  KEY `user_role_value_idx` (`value`),
  CONSTRAINT `user_role_user_fkey`
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_payment` (
  `id` VARCHAR(24) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_payment_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_payment_item` (
  `id` VARCHAR(24) NOT NULL,
  `user_payment_id` VARCHAR(24) NOT NULL,
  `paymentType` VARCHAR(20) NOT NULL,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `user_payment_item_user_payment_id_idx` (`user_payment_id`),
  CONSTRAINT `user_payment_item_user_payment_id_fkey`
    FOREIGN KEY (`user_payment_id`) REFERENCES `user_payment`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `code` (
  `id` VARCHAR(24) NOT NULL,
  `code` VARCHAR(100) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `sort` INT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_code_key` (`code`),
  KEY `code_name_idx` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `code_detail` (
  `id` VARCHAR(24) NOT NULL,
  `code` VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `value` TEXT NOT NULL,
  `sort` INT NULL,
  `classification` VARCHAR(50) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_detail_code_key_key` (`code`, `key`),
  KEY `code_detail_code_idx` (`code`),
  KEY `code_detail_value_idx` (`value`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `code_detail_level` (
  `id` VARCHAR(24) NOT NULL,
  `code_detail_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `value` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `code_detail_level_idx` (`code_detail_id`, `sort`),
  KEY `code_detail_level_value_idx` (`value`),
  CONSTRAINT `code_detail_level_code_detail_fkey`
    FOREIGN KEY (`code_detail_id`) REFERENCES `code_detail`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `word` (
  `id` VARCHAR(24) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `word` VARCHAR(191) NULL,
  `read` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `word_type_level_idx` (`type`, `level`),
  KEY `word_word_idx` (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `word_mean` (
  `id` VARCHAR(24) NOT NULL,
  `word_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `value` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `word_mean_word_idx` (`word_id`, `sort`),
  CONSTRAINT `word_mean_word_fkey`
    FOREIGN KEY (`word_id`) REFERENCES `word`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `word_part` (
  `id` VARCHAR(24) NOT NULL,
  `word_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `value` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `word_part_word_idx` (`word_id`, `sort`),
  KEY `word_part_value_idx` (`value`),
  CONSTRAINT `word_part_word_fkey`
    FOREIGN KEY (`word_id`) REFERENCES `word`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `word_today` (
  `id` VARCHAR(24) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `study` VARCHAR(50) NOT NULL,
  `day` INT NULL,
  `wordNo` INT NOT NULL,
  `word` VARCHAR(191) NOT NULL,
  `read` VARCHAR(191) NOT NULL,
  `means` TEXT NOT NULL,
  `word_locale_en` TEXT NULL,
  `word_locale_cn` TEXT NULL,
  `word_locale_my` TEXT NULL,
  `sentence` TEXT NULL,
  `sentence_read` TEXT NULL,
  `sentence_translate` TEXT NULL,
  `sentence_locale_en` TEXT NULL,
  `sentence_locale_cn` TEXT NULL,
  `sentence_locale_my` TEXT NULL,
  `keyword` VARCHAR(191) NULL,
  `question_text` TEXT NULL,
  `question_answer` INT NULL,
  `speaker` TEXT NULL,
  `sortNo` INT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `word_today_level_year_study_idx` (`level`, `year`, `study`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `word_today_question_choice` (
  `id` VARCHAR(24) NOT NULL,
  `parent_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `content` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `word_today_question_choice_parent_idx` (`parent_id`, `sort`),
  CONSTRAINT `word_today_question_choice_parent_fkey`
    FOREIGN KEY (`parent_id`) REFERENCES `word_today`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `grammar_today` (
  `id` VARCHAR(24) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `study` VARCHAR(50) NOT NULL,
  `sortNo` INT NOT NULL,
  `sentence` TEXT NULL,
  `sentence_read` TEXT NULL,
  `sentence_translate` TEXT NULL,
  `sentence_locale_en` TEXT NULL,
  `sentence_locale_cn` TEXT NULL,
  `sentence_locale_my` TEXT NULL,
  `question_text` TEXT NULL,
  `question_answer` INT NULL,
  `speaker` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `grammar_today_level_year_study_idx` (`level`, `year`, `study`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `grammar_today_question_choice` (
  `id` VARCHAR(24) NOT NULL,
  `parent_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `content` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `grammar_today_question_choice_parent_idx` (`parent_id`, `sort`),
  CONSTRAINT `grammar_today_question_choice_parent_fkey`
    FOREIGN KEY (`parent_id`) REFERENCES `grammar_today`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reading_today` (
  `id` VARCHAR(24) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `source` VARCHAR(191) NOT NULL,
  `sentence` TEXT NULL,
  `sentence_read` TEXT NULL,
  `sentence_translate` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `reading_today_level_source_idx` (`level`, `source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jlpt` (
  `id` VARCHAR(24) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `sortNo` INT NOT NULL,
  `classification` VARCHAR(50) NOT NULL,
  `questionNo` VARCHAR(20) NULL,
  `question_content` LONGTEXT NULL,
  `question_audio_link` TEXT NULL,
  `question_audio_name` TEXT NULL,
  `question_image_link` TEXT NULL,
  `question_image_name` TEXT NULL,
  `sentence_translation` TEXT NULL,
  `questionType` VARCHAR(20) NOT NULL,
  `answer` INT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `jlpt_classification_year_month_level_sortNo_key` (`classification`, `year`, `month`, `level`, `sortNo`),
  KEY `jlpt_year_month_level_idx` (`year`, `month`, `level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jlpt_choice` (
  `id` VARCHAR(24) NOT NULL,
  `parent_id` VARCHAR(24) NOT NULL,
  `no` INT NOT NULL,
  `content` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `jlpt_choice_parent_idx` (`parent_id`, `no`),
  CONSTRAINT `jlpt_choice_parent_fkey`
    FOREIGN KEY (`parent_id`) REFERENCES `jlpt`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jlpt_test` (
  `id` VARCHAR(24) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `test` VARCHAR(50) NOT NULL,
  `classification` VARCHAR(50) NOT NULL,
  `questionType` VARCHAR(20) NOT NULL,
  `question_content` LONGTEXT NULL,
  `question_audio_link` TEXT NULL,
  `question_audio_name` TEXT NULL,
  `question_image_link` TEXT NULL,
  `question_image_name` TEXT NULL,
  `sortNo` INT NOT NULL,
  `questionNo` INT NULL,
  `questionNoLabel` VARCHAR(50) NULL,
  `sentence_translation` TEXT NULL,
  `sentence_reading` TEXT NULL,
  `sentence_en` TEXT NULL,
  `sentence_cn` TEXT NULL,
  `answer` INT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `jlpt_test_level_test_classification_sortNo_idx` (`level`, `test`, `classification`, `sortNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jlpt_test_choice` (
  `id` VARCHAR(24) NOT NULL,
  `parent_id` VARCHAR(24) NOT NULL,
  `no` INT NOT NULL,
  `content` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `jlpt_test_choice_parent_idx` (`parent_id`, `no`),
  CONSTRAINT `jlpt_test_choice_parent_fkey`
    FOREIGN KEY (`parent_id`) REFERENCES `jlpt_test`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jpt` (
  `id` VARCHAR(24) NOT NULL,
  `level` VARCHAR(50) NULL,
  `part` VARCHAR(20) NOT NULL,
  `year` VARCHAR(20) NULL,
  `classification` VARCHAR(50) NULL,
  `questionGroupType` VARCHAR(50) NULL,
  `question_content` LONGTEXT NULL,
  `question_audio_link` TEXT NULL,
  `question_audio_name` TEXT NULL,
  `question_image_link` TEXT NULL,
  `question_image_name` TEXT NULL,
  `questionType` VARCHAR(20) NOT NULL,
  `questionGroupNo` INT NULL,
  `questionContentNo` INT NULL,
  `sortNo` INT NOT NULL,
  `questionNo` VARCHAR(20) NULL,
  `sentence_translation` TEXT NULL,
  `sentence_reading` TEXT NULL,
  `answer` INT NULL,
  `speaker` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `jpt_level_part_sortNo_idx` (`level`, `part`, `sortNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jpt_choice` (
  `id` VARCHAR(24) NOT NULL,
  `parent_id` VARCHAR(24) NOT NULL,
  `no` INT NOT NULL,
  `content` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `jpt_choice_parent_idx` (`parent_id`, `no`),
  CONSTRAINT `jpt_choice_parent_fkey`
    FOREIGN KEY (`parent_id`) REFERENCES `jpt`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jpt_word` (
  `id` VARCHAR(24) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `word` VARCHAR(191) NULL,
  `read` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `jpt_word_type_level_idx` (`type`, `level`),
  KEY `jpt_word_word_idx` (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jpt_word_mean` (
  `id` VARCHAR(24) NOT NULL,
  `word_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `value` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jpt_word_mean_word_idx` (`word_id`, `sort`),
  CONSTRAINT `jpt_word_mean_word_fkey`
    FOREIGN KEY (`word_id`) REFERENCES `jpt_word`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jpt_word_part` (
  `id` VARCHAR(24) NOT NULL,
  `word_id` VARCHAR(24) NOT NULL,
  `sort` INT NOT NULL,
  `value` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jpt_word_part_word_idx` (`word_id`, `sort`),
  KEY `jpt_word_part_value_idx` (`value`),
  CONSTRAINT `jpt_word_part_word_fkey`
    FOREIGN KEY (`word_id`) REFERENCES `jpt_word`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `level_up` (
  `id` VARCHAR(24) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `level` VARCHAR(20) NOT NULL,
  `sortNo` INT NOT NULL,
  `classification` VARCHAR(50) NOT NULL,
  `questionNo` INT NULL,
  `questionGroupNo` INT NULL,
  `questionContentNo` INT NULL,
  `question_content` LONGTEXT NULL,
  `question_content_org` TEXT NULL,
  `question_audio_link` TEXT NULL,
  `question_audio_name` TEXT NULL,
  `question_image_link` TEXT NULL,
  `question_image_name` TEXT NULL,
  `questionGroupType` VARCHAR(50) NOT NULL,
  `questionType` VARCHAR(20) NULL,
  `answer` INT NULL,
  `sentence_translation` TEXT NULL,
  `sentence_reading` TEXT NULL,
  `speaker` TEXT NULL,
  `sentence_locale_en` TEXT NULL,
  `sentence_locale_cn` TEXT NULL,
  `sentence_locale_my` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `level_up_classification_year_level_sortNo_key` (`classification`, `year`, `level`, `sortNo`),
  KEY `level_up_level_year_classification_idx` (`level`, `year`, `classification`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `level_up_choice` (
  `id` VARCHAR(24) NOT NULL,
  `parent_id` VARCHAR(24) NOT NULL,
  `no` INT NOT NULL,
  `content` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `level_up_choice_parent_idx` (`parent_id`, `no`),
  CONSTRAINT `level_up_choice_parent_fkey`
    FOREIGN KEY (`parent_id`) REFERENCES `level_up`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `board_community` (
  `id` VARCHAR(24) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `contents` LONGTEXT NOT NULL,
  `noticeYn` VARCHAR(1) NOT NULL DEFAULT 'N',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `board_community_noticeYn_created_at_idx` (`noticeYn`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `board_reply` (
  `id` VARCHAR(24) NOT NULL,
  `board_id` VARCHAR(24) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `contents` TEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `board_reply_board_id_idx` (`board_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
