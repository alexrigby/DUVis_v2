import Ajv from "ajv";
import addFormats from "ajv-formats";

import schema from "./schema.json";

const ajv = new Ajv();
addFormats(ajv, ["date"]); // allows checking of date format

export function validateConfig(config) {
  const _schema = schema;
  const _config = config;

  const validate = ajv.compile(schema);
  const valid = validate(_config, _schema); //validate config vis schema

  if (!valid) {
    validate.errors.forEach((err) => {
      const errorMessage = `ERROR! ${err.instancePath} ${err.message}`;
      console.log(errorMessage);
    });
  }

  return { valid, errors: validate.errors };
}

export default validateConfig;
