export function getWpActivitiesIds(nodeData, wpData) {
  const WP_IDS = [];
  for (var i = 0; i < wpData.length; i++) {
    WP_IDS[wpData[i].id] = wpActivityIdFinder(nodeData, wpData[i].id);
  }
  return WP_IDS;
}

function wpActivityIdFinder(data, wpId) {
  const wpNumber = wpId.slice(2);
  //gets Activities by WP, then gets Ids of those activities
  return data.filter((record) => record.WP === wpNumber).map((activity) => activity.ID);
}

export default getWpActivitiesIds;
