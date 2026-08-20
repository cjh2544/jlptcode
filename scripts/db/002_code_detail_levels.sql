ALTER TABLE `code_detail`
  ADD COLUMN IF NOT EXISTS `levels` JSON NULL AFTER `sort`,
  ADD COLUMN IF NOT EXISTS `classification` VARCHAR(50) NULL AFTER `levels`;
