export function getEngLevels(pr, cyState) {
  var individualEngLev = [];
  var engLevel = [];
  const stakeholders = cyState.cy.nodes("[type = 'stakeholderNode']");
  for (let k = 0; k < stakeholders.length; k++) {
    var engPrPeriod = [];
    //4 for 4 engagement levels
    for (let j = 0; j < 4; j++) {
      var multiplyFactor = j + 1; // + 1 so not multiplied by
      //number of each eng level multiplied
      engPrPeriod.push(
        stakeholders[k].outgoers(`[engagement = "${j + 1}"]`).targets(`[meta.startPrPeriod <= ${pr}]`).length *
          multiplyFactor
      );
    }
    const engScore = engPrPeriod.reduce((a, b) => a + b);
    // stakeholders[k].data("weight", engScore);
    individualEngLev.push({ id: stakeholders[k].id(), engRank: engScore }); //push sum of each stakeholder engagemnt
    engLevel.push(engScore);
  }
  const maxEngScore = Math.max(...engLevel);
  const individualEngScores = individualEngLev;
  return { maxEngScore, individualEngScores };
}

export default getEngLevels;
