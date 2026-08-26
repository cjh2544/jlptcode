-- Multilingual labels for code_detail (ko stays in `value`).

ALTER TABLE `code_detail`
  ADD COLUMN IF NOT EXISTS `value_locale_ja` TEXT NULL AFTER `value`,
  ADD COLUMN IF NOT EXISTS `value_locale_en` TEXT NULL AFTER `value_locale_ja`,
  ADD COLUMN IF NOT EXISTS `value_locale_cn` TEXT NULL AFTER `value_locale_en`,
  ADD COLUMN IF NOT EXISTS `value_locale_my` TEXT NULL AFTER `value_locale_cn`;
