//REDUNDANT !!!!!!!!!!!!!!!!!!!!!!!!!!!

export function iconByCategory(c) {
  if (c === "Tool") {
    return <i className="fa fa-hammer"></i>;
  } else if (c === "Project") {
    return <i className="fa fa-list-check"></i>;
  } else if (c === "Publication") {
    return <i className="fa fa-newspaper"></i>;
  } else if (c === "Event") {
    return <i className="fa fa-calendar-day"></i>;
  } else if (c === "Installation/Demo site") {
    return <i className="fa fa-screwdriver"></i>;
  } else if (c === "Activity") {
    return <i className="fa fa-bullhorn"></i>;
  } else if (c === "Technology") {
    return <i className="fa fa-desktop"></i>;
  }
}

export default iconByCategory;
