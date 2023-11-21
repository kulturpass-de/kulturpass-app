module.exports = {
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  endOfLine: "auto",
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
