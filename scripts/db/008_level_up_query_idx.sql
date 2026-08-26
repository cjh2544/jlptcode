ALTER TABLE `level_up`
  ADD KEY `level_up_level_classification_qtype_idx` (`level`, `classification`, `questionType`, `questionGroupType`);
