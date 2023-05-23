export function getMissingFields(dataset, config) {
  const datasetHeaders = Object.keys(dataset[0]);
  const { META_FIELDS, CATEGORYS_PROVIDED, ...rest } = config;
  const configHeaders = [...Object.values(rest), ...META_FIELDS.map((f) => f.name)];

  // if the field is not specified as null then return litst of missing header fields
  const missingFields = configHeaders.filter((h) => h && !datasetHeaders.includes(h));
  return missingFields;
}

export default getMissingFields;
