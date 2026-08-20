-- Drop original JSON columns after migrate-split-json.ts.

ALTER TABLE `grammar_today`
  DROP COLUMN IF EXISTS `sentence_locale`,
  DROP COLUMN IF EXISTS `question`;

ALTER TABLE `word_today`
  DROP COLUMN IF EXISTS `word_locale`,
  DROP COLUMN IF EXISTS `sentence_locale`,
  DROP COLUMN IF EXISTS `question`;

ALTER TABLE `jlpt`
  DROP COLUMN IF EXISTS `question`,
  DROP COLUMN IF EXISTS `sentence`,
  DROP COLUMN IF EXISTS `choices`;

ALTER TABLE `jlpt_test`
  DROP COLUMN IF EXISTS `question`,
  DROP COLUMN IF EXISTS `sentence`,
  DROP COLUMN IF EXISTS `choices`;

ALTER TABLE `jpt`
  DROP COLUMN IF EXISTS `question`,
  DROP COLUMN IF EXISTS `sentence`,
  DROP COLUMN IF EXISTS `choices`;

ALTER TABLE `level_up`
  DROP COLUMN IF EXISTS `question`,
  DROP COLUMN IF EXISTS `sentence`,
  DROP COLUMN IF EXISTS `choices`,
  DROP COLUMN IF EXISTS `sentence_locale`;

ALTER TABLE `word`
  DROP COLUMN IF EXISTS `means`,
  DROP COLUMN IF EXISTS `parts`;

ALTER TABLE `jpt_word`
  DROP COLUMN IF EXISTS `means`,
  DROP COLUMN IF EXISTS `parts`;

ALTER TABLE `user`
  DROP COLUMN IF EXISTS `role`;

ALTER TABLE `code_detail`
  DROP COLUMN IF EXISTS `levels`;
