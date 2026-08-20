-- Split JSON columns into scalars + child tables.
-- Keeps original JSON columns until migrate-split-json.ts runs, then 004_drop_json.sql.

-- grammar_today
ALTER TABLE `grammar_today`
  ADD COLUMN IF NOT EXISTS `sentence_locale_en` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_cn` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_my` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_text` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_answer` INT NULL;

-- word_today
ALTER TABLE `word_today`
  ADD COLUMN IF NOT EXISTS `word_locale_en` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `word_locale_cn` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `word_locale_my` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_en` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_cn` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_my` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_text` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_answer` INT NULL;

-- jlpt
ALTER TABLE `jlpt`
  ADD COLUMN IF NOT EXISTS `question_content` LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_translation` TEXT NULL;

-- jlpt_test
ALTER TABLE `jlpt_test`
  ADD COLUMN IF NOT EXISTS `question_content` LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_translation` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_reading` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_en` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_cn` TEXT NULL;

-- jpt
ALTER TABLE `jpt`
  ADD COLUMN IF NOT EXISTS `question_content` LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_translation` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_reading` TEXT NULL;

-- level_up
ALTER TABLE `level_up`
  ADD COLUMN IF NOT EXISTS `question_content` LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_content_org` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_audio_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_link` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `question_image_name` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_translation` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_reading` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_en` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_cn` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `sentence_locale_my` TEXT NULL;

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
