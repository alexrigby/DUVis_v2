import engLevelWording from "../configs/engLevelWording";

export function getEngLevels(pr, cyState) {
  var individualEngLev = [];
  var engLevel = [];
  const stakeholders = cyState.cy.nodes("[type = 'stakeholderNode']");

  for (let i = 0; i < stakeholders.length; i++) {
    var engPrPeriod = [];

    for (let j = 0; j < engLevelWording.length; j++) {
      var multiplyFactor = j + 1; // + 1 so not multiplied by 0
      //number of each eng level multiplied
      engPrPeriod.push(
        stakeholders[i].outgoers(`[engagement = "${j + 1}"]`).targets(`[startPrPeriod <= ${pr}]`).length *
          multiplyFactor
      );
    }

    const engRank = engPrPeriod.reduce((a, b) => a + b);

    individualEngLev.push({ id: stakeholders[i].id(), engRank: engRank });
    engLevel.push(engRank);
  }

  const maxEngScore = Math.max(...engLevel);
  const individualEngScores = individualEngLev;

  return { maxEngScore, individualEngScores };
}

export default getEngLevels;
