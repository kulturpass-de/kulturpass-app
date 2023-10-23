module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  endOfLine: "lf",
  printWidth: 120,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      "files": "*.js",
      "options": {
        "semi": true
      }
    },
  ],
  importOrder: ["<THIRD_PARTY_MODULES>", "^[./]"]
};
