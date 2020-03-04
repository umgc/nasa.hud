const yaml = require('yaml-validator')

// Default options
const options = {
  log: false,
  structure: false,
  onWarning: null,
  writeJson: false
};
 
const files = [
  './procedures/procedures_EVA1.yml'
];
 
const validator = new yaml(options);
validator.validate(files);
validator.report();