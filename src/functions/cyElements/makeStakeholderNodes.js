export function makeStakeholerNodes(stData) {
  //   const stEngArray = stLinks.slice(1, stLinks.length - 1); // remove activity IDs
  //   // returns object of engrankings {S_ID: eng rank, ...}
  //   const engRank = stEngArray.reduce(
  //     (a, b) => ({
  //       ...a,
  //       //sArr[0] == S_ID, rest of array == eng level values
  //       [b[0]]: b.slice(1).reduce((a, b) => Number(a) + Number(b)),
  //     }),
  //     {}
  //   );

  const stNodes = stData.map((s) => {
    const stNumber = s.id.slice(2, s.id.length - 1);
    const stName = s.name ? s.name : `Stakeholder ${s.id}`;
    const stDisplayName = s.name ? `${s.id}. ${s.name}` : `Stakeholder ${stNumber}`;
    return {
      group: "nodes",
      data: {
        id: s.id,
        label: s.id,
        name: stName,
        displayName: stDisplayName,
        colorRef: "stakeholder",
        type: "stakeholderNode",
        size: 1,

        meta: s.meta_fields,

        engRank: s.engRank,
        weight: s.engRank,
      },
    };
  });

  return stNodes;
}

export default makeStakeholerNodes;
