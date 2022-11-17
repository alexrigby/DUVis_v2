import popper from "cytoscape-popper";
import cytoscape from "cytoscape";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

cytoscape.use(popper);
// NODE TOOLTIP
export function nodeTooltip(cy) {
  const activityNodes = cy.nodes("[type != 'wp']");
  //   const wpNodes = cy.nodes("[type = 'wp']");

  makeTooltips(activityNodes, "mouseover", "mouseout");
  //   makeTooltips(wpNodes, "click", "click"); propbably dont need as already have legend
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
      //content to show in tooltip
      content: () => {
        let content = document.createElement("div");
        content.innerHTML = `${node.data().label}. ${node.data("name")}`;
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
