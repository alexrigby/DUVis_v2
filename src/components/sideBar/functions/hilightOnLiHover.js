export const hilightOnLiHover = (activityId, cyState) => {
  cyState.cy.nodes(`[id = "${activityId}"]`).toggleClass("selectedNode");
  document.querySelectorAll(`.item${activityId}`).forEach((el) => {
    el.classList.toggle("selectedItem");
  });
};

export default hilightOnLiHover;
