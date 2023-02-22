// REDUNDANT!!!!!!!!!!!!!!!!!!!

import nodeHtmlLabel from "../../../../node_modules/cytoscape-node-html-label/dist/cytoscape-node-html-label.js";
import cytoscape from "cytoscape";
import { renderToString } from "react-dom/server";
import { actFields } from "../../../data/index.js";
import React from "react";

import iconByCategory from "./iconByCategory";
import styleActivitiesByWP from "./styleActivitiesByWP";

import "../Cytoscape.css";

cytoscape.use(nodeHtmlLabel);

export function addCategoryIcon(cy) {
  cy.nodeHtmlLabel([
    {
      query: "node[type = 'activityNode']",
      //added myslef. might need to alter (-0.2) (mid-top)
      valign: "mid-top",
      halign: "left",
      valignBox: "center",
      //added myslef. might need to alter (0.3) (mid-center)
      halignBox: "mid-center",
      tpl(data) {
        return renderToString(
          <div className="categoryIcon" style={styleActivitiesByWP(data.parent)} value={data.id}>
            {iconByCategory(data.meta[actFields.CATEGORY])}
          </div>
        );
      },
    },
  ]);
}

export default addCategoryIcon;
