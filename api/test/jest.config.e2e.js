module.exports = {
  preset: '@shelf/jest-mongodb',
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  watchPathIgnorePatterns: ["globalConfig"],
}
