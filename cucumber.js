module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['step_definitions/**/*.js', 'support/hooks.js'],
    format: ['pretty', 'json:reports/cucumber-report.json'],
    publishQuiet: true
  }
};
