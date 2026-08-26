-- /levelUp 과목 조회: (level, classification, questionType, questionGroupType)
CREATE INDEX IF NOT EXISTS `level_up_level_classification_qtype_idx`
  ON `level_up` (`level`, `classification`, `questionType`, `questionGroupType`);

-- /jlptTest 레벨·과목·회차 조회: (level, classification, test)
CREATE INDEX IF NOT EXISTS `jlpt_test_level_classification_test_idx`
  ON `jlpt_test` (`level`, `classification`, `test`);
