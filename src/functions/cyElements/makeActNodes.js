//creats a Node object for each activity

import { actFields } from "../../data";

export function makeActNodes(data) {
  const cyNodes = data.map((act) => {
    // if user does not specify names then generate them
    const actName = act[actFields.NAME] ? act[actFields.NAME] : `Activity ${act[actFields.ID]}`; // name with no id infront
    const displayName = act[actFields.NAME]
      ? `${act[actFields.ID]}. ${act[actFields.NAME]}`
      : `Activity ${act[actFields.ID]}`; // name with id in front

    // if user specifies additional meta fields (only give name not type)
    const meta_fields = actFields.META_FIELDS.reduce((a, b) => ({ ...a, [b.name]: act[b.name] }), {});

    // console.log(actFields.META_FIELDS_f.reduce((a, b) => ({ ...a, [b]: act[b] }), {}));
    return {
      group: "nodes",
      data: {
        type: "activityNode",
        size: 1,
        parent: `WP_${act[actFields.WP]}`,
        colorRef: `WP_${act[actFields.WP]}`,
        bgColor: act.bgColor,
        borderColor: act.borderColor,
        id: act[actFields.ID],
        label: act[actFields.ID],
        name: actName,
        displayName: displayName,

        dates: {
          endPrPeriod: act.endPrPeriod,
          startPrPeriod: act.startPrPeriod,
          endDate: act[actFields.END_DATE],
          startDate: act[actFields.START_DATE],
        },

        meta: meta_fields,
      },
    };
  });

  return cyNodes;
}

export default makeActNodes;
