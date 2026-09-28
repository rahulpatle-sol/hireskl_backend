module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "no-undef": "error",
    "eqeqeq": "error",
    "no-duplicate-case": "error",
    "no-empty": "warn",
    "no-unreachable": "error",
  },
};