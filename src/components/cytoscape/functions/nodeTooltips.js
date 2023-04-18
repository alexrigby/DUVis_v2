import popper from "cytoscape-popper";
import cytoscape from "cytoscape";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

cytoscape.use(popper);
// NODE TOOLTIP
export function nodeTooltip(cy) {
  const nodes = cy.nodes("[type != 'project']");
  makeTooltips(nodes, "mouseover", "mouseout");
}

export default nodeTooltip;

function makeTooltips(nodes, triggerEvent, cancelEvent) {
  nodes.on(triggerEvent, (el) => {
    let node = el.target;
    let ref = el.target.popperRef();
    let dummyDomEle = document.createElement("div");
    // eslint-disable-next-line no-undef
    let tip = new tippy(dummyDomEle, {
      getReferenceClientRect: ref.getBoundingClientRect,
      trigger: "manual",
      //content to show in toolti
      content: () => {
        let content = document.createElement("div");
        if (node.data().name) {
          content.innerHTML = `${node.data().label}. ${node.data("name")}`;
        } else {
          content.innerHTML =
            node.data().type === "activityNode" ? `Activity ${node.data().label}` : `Work Package ${node.data().label}`;
        }

        return content;
      },
    });
    tip.show();
    //hide the tooltip
    el.target.on(cancelEvent, () => {
      tip.hide(); // try destroy()
    });
  });
}
