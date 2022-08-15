import nodeHtmlLabel from "cytoscape-node-html-label";

import iconByCategory from "./categoryIcon";
import styleActivitiesByWP from "./styleActivitiesByWP";
import cytoscape from "cytoscape";

import { renderToString } from "react-dom/server";
import React from "react";

// var nodeHtmlLabel = require("cytoscape-node-html-label");

export function addCategoryIcon(cy) {
  nodeHtmlLabel(cy);
  console.log(cy.nodeHtmlLabel);

  cy.nodeHtmlLabel([
    {
      query: "node[type = 'act']",
      //added myslef. might need to alter (-0.2) (mid-center)
      valign: "top",
      halign: "left",
      valignBox: "center",
      //added myslef. might need to alter (0.3) (mid-cente)
      halignBox: "center",
      tpl(data) {
        console.log("hi");
        return `<div class=categoryIcon style="${styleActivitiesByWP(data.parent)}" value="${data.id}">${iconByCategory(
          data.meta["Activity Category"]
        )}</div>`;
      },
    },
  ]);
}

export default addCategoryIcon;
