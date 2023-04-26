import { wpFields } from "../../data";
//for each work package a node is created, each WP is a parent to one of the activities
export function makeWpNodes(data) {
  const wps = data.map((wp) => {
    // gets the wp number from the wp id
    const wpNumber = wp[wpFields.ID].charAt(wp[wpFields.ID].length - 1);

    // if no name supplied in excel then use ID. Selecting from selected node as supposed to config file incase some have names and others dont
    const wpName = wp[wpFields.NAME] ? wp[wpFields.NAME] : `Work Package ${wpNumber}`;
    const wpDisplayName = wp[wpFields.NAME] ? `${wp[wpFields.ID]}. ${wpNumber}` : `Work Package ${wpNumber}`;

    // if user specifies additional meta fields
    const meta_fields = wpFields.META_FIELDS.reduce((a, b) => ({ ...a, [b.name]: wp[b.name] }), {});

    return {
      group: "nodes",
      classes: "wpNodes",
      data: {
        parent: "project",
        id: wp[wpFields.ID],
        label: wpNumber,
        type: "wp",
        name: wpName,
        displayName: wpDisplayName,
        bgColor: wp.bgColor,
        borderColor: wp.borderColor,
        // SDGs: item[wpFields.SDGs],

        meta: meta_fields,
      },
    };
  });

  return wps;
}

export default makeWpNodes;
