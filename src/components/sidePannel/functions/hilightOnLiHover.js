export const hilightOnLiHover = (activityId, cyState) => {
  cyState.cy.nodes(`[id = "${activityId}"]`).toggleClass("hilightedNode");
  document.querySelectorAll(`.item${activityId}`).forEach((el) => {
    el.classList.toggle("hilightedItem");
  });
};

export default hilightOnLiHover;
