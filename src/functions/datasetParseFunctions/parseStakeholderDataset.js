export function parseStakeholderDataset(
  stLinks,
  stData,
  trimmedActData,
  config,
  noParentNodes
) {
  //----------------CONFIG------
  const actFields = config.actFields;
  const stFields = config.stFields;

  const stDataNewIds = stData.map((s) => ({
    ...s,
    [stFields.ID]: `S_${s[stFields.ID]}`,
  })); // adds S_ to stakeholder IDS

  const stIDs = stLinks
    .slice(1, stLinks.length)
    .flatMap((s) => {
      if (s[0] != "") {
        return `S_${s[0]}`;
      }
    })
    .filter((s) => s); //return array of stakeholder ids and adds S_to ids

  const actIDs = stLinks[0].slice(1); //gets activity ids present in stakeholder matrix (so no stakeholders with no links are included)
  const trimmedActIDs = trimmedActData.map((act) => act[actFields.ID]); // gets ids present in trimmed act data (for when filters are applied)

  const stLinksMatrix = stLinks.map((s) => s.slice(1, stLinks.length)); // array of links (either " " or "eng") [0] == S_ID,

  //check if the act id is present in current filter. if it isnt then return its index to be removed
  const removeIndexArray = actIDs
    .map((actID, i) => (!trimmedActIDs.includes(actID) ? i : null))
    .filter((index) => index !== null);

  // if the index is not included in the remove index array eep the row, else remove it
  const trimmedMatrix = stLinksMatrix.map((row) =>
    row.filter((val, i) => !removeIndexArray.includes(i))
  );

  const newActIds = trimmedMatrix.slice(0, 1).flat();
  const newMatrix = trimmedMatrix.slice(1, stIDs.length);
  const areThereStakeholders = newMatrix.flat().length === 0 ? false : true;

  //if thee are no stakeholders linked to any of the activites in the filter then redurn an empty array
  const stakeholderData = areThereStakeholders
    ? newMatrix
        .map((row, i) => {
          //returns coresponding info from stakeholder file
          const stNodeData = stDataNewIds.filter(
            (record) => record[stFields.ID] === stIDs[i]
          )[0];

          // for each user specified meta field create an object {meta_filed : field value}
          const meta_fields = stFields.META_FIELDS.reduce(
            (a, b) => ({ ...a, [b.name]: stNodeData[b.name] }),
            {}
          );

          return {
            id: stIDs[i],
            name: stNodeData[stFields.NAME],
            engRank: row.map((el) => Number(el)).reduce((a, b) => a + b), //adds eng levels to return eng ranking
            meta_fields: meta_fields,
            act: row
              .map(
                (el, j) =>
                  (el === "1" || el === "2" || el === "3" || el === "4") &&
                  // removes activity nodes that have no parent
                  !noParentNodes.includes(newActIds[j]) && {
                    actID: newActIds[j],
                    engagement: el,
                  }
              )
              .filter((row) => row !== false),
          };
        })
        .filter((s) => s.act.length !== 0)
    : [];

  const maxEngScore = Math.max(...stakeholderData.map((s) => s.engRank));

  return { stakeholderData, maxEngScore };
}
export default parseStakeholderDataset;
