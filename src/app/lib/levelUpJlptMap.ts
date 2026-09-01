export function jlptTestNumber(test: string) {
  const match = String(test).match(/\d+/);
  const parsed = match ? Number.parseInt(match[0], 10) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function jlptTestTypeOrder(test: string) {
  return String(test).startsWith("test") ? 0 : 1;
}

export function sortJlptTests(tests: string[]) {
  return [...tests].sort((a, b) => {
    const typeDiff = jlptTestTypeOrder(a) - jlptTestTypeOrder(b);
    if (typeDiff) return typeDiff;
    return jlptTestNumber(a) - jlptTestNumber(b) || a.localeCompare(b);
  });
}

export function sortLevelUpExamYears(years: string[]) {
  return [...years].filter((year) => year.includes("(")).sort((a, b) => a.localeCompare(b));
}

export type LevelUpJlptMap = {
  pairs: Array<{ test: string; year: string }>;
  yearToTest: Record<string, string>;
  testToYear: Record<string, string>;
};

export function buildLevelUpJlptMap(tests: string[], years: string[]): LevelUpJlptMap {
  const sortedTests = sortJlptTests(tests);
  const sortedYears = sortLevelUpExamYears(years);
  const pairs: LevelUpJlptMap["pairs"] = [];
  const yearToTest: Record<string, string> = {};
  const testToYear: Record<string, string> = {};

  const len = Math.min(sortedTests.length, sortedYears.length);
  for (let i = 0; i < len; i++) {
    const test = sortedTests[i];
    const year = sortedYears[i];
    pairs.push({ test, year });
    yearToTest[year] = test;
    testToYear[test] = year;
  }

  return { pairs, yearToTest, testToYear };
}
