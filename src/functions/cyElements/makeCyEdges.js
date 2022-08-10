// import stringToArray from "./stringToArray.js";

export function makeCyEdges(links) {
  return links.map((el, i) => {
    let linkedActivities = links[i];
    //maps each link in i links to its array index (i + 1)
    return [
      //map linked activites (n)
      ...linkedActivities
        .map((n) => ({
          // group: "edges",
          // classes: "hide",
          data: {
            id: `g${i + 1}e${n}`,
            source: `${i + 1}`,
            target: `${n}`,
            // type: "activityEdge",
          },
        }))
        // filter out edges with no value (Node has no 'Linked Activities' in dataset)
        .filter((e) => e.data.target !== "NaN")
        //filters out edges whos source and target are the same node
        .filter((el) => el.data.target !== el.data.source),
    ];
  });
}

export default makeCyEdges;

// //if linked to all activites generate list of all activiy ids to use as 'Linked Activities' value
// if (el.LinkedtoAll === "Y" || el.LinkedtoAll === "y") {
//   //gets list of activities + 1(to account for index 0)
//   var linkedKeys = Array.from(Array(arr.length + 1).keys());
//   // removes index from array 0
//   linkedKeys.shift();
//   linkedActivities = linkedKeys;
//   //if Linked Activites are numbers in a string, split the string up and parse as array of integers.
// } else {
//   linkedActivities = stringToArray(el.LinkedActivities);
// }
