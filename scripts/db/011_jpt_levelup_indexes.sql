-- /jptLevelUp 그룹 헤더: (part, questionType)
CREATE INDEX IF NOT EXISTS `jpt_part_qtype_idx`
  ON `jpt` (`part`, `questionType`);

-- /jptLevelUp 레벨·파트 랜덤 조회: (level, part, questionType)
CREATE INDEX IF NOT EXISTS `jpt_level_part_qtype_idx`
  ON `jpt` (`level`, `part`, `questionType`);
