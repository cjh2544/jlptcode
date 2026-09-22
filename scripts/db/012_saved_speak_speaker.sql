-- Add speaker URL to saved speak items.
-- Safe to re-run.

SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'user_saved_speak'
    AND COLUMN_NAME = 'speaker'
);

SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE `user_saved_speak` ADD COLUMN `speaker` TEXT NULL AFTER `sentence_translate`',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
