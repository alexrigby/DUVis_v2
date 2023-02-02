import "./PRScroll.css";

export function PRScroll({ setPrPeriod, currentPr, prPeriod, datesRef, prSectionDisplay, cyState }) {
  const prOptions = datesRef.current !== null && [...new Set(datesRef.current.map((p) => p.prPeriod))];
  const maxPr = prOptions[prOptions.length - 1];

  const prStyle = {
    display: prSectionDisplay ? "flex" : "none",
  };

  //colors current PR period in red
  const radioLableStyle = (i) => {
    return { color: currentPr === i + 1 ? "#007200" : "black" };
  };

  //allows user to set pr period using the arrow buttons
  const scrollHandler = (event) => {
    // console.log(event.currentTarget.id);
    if (event.currentTarget.id === "forwardButton") {
      setPrPeriod((prevState) => ({
        ...prevState,
        pr: prevState.pr >= maxPr ? maxPr : prevState.pr + 1,
      }));
    } else if (event.currentTarget.id === "backButton") {
      setPrPeriod((prevState) => ({
        ...prevState,
        pr: prevState.pr <= 1 ? 1 : prevState.pr - 1,
      }));
    }
  };

  const prClickHandler = (event) => {
    cyState.cy.ready(() => {
      cyState.cy.fit();
    });

    if (prPeriod.pr === null) {
      setPrPeriod((prevState) => ({
        pr: event.target.type === "radio" ? parseFloat(event.target.value) : null,
        undefined: event.target.type === "checkbox" ? !prevState.undefined : prevState.undefined,
      }));
    } else {
      setPrPeriod((prevState) => ({
        pr: event.target.type === "radio" ? parseFloat(event.target.value) : prevState.pr,
        undefined: event.target.type === "checkbox" ? !prevState.undefined : prevState.undefined,
      }));
    }
  };

  const prRadio =
    datesRef.current !== null &&
    prOptions.map((opt, i) => (
      <div className="radioGroup" key={opt}>
        <label htmlFor="prPeriod" style={radioLableStyle(i)}>
          {opt}
        </label>
        <input
          type="radio"
          id={opt}
          name="prPeriod"
          value={opt}
          onChange={prClickHandler}
          checked={prPeriod.pr !== null && prPeriod.pr - 1 === i} //check the current pr period
        ></input>
      </div>
    ));

  return (
    <div>
      <div style={prStyle}>
        <div className="undefinedCheck">
          {/* <label htmlFor="prPeriod">Include Undefined</label> */}
          {/* <input
            type="checkBox"
            id="undef"
            name="prPeriod"
            value="undef"
            onChange={prClickHandler}
            defaultChecked={true}
          ></input> */}
        </div>
      </div>
      <div className="prSelection" style={prStyle}>
        {prRadio}
        <button id="backButton" onClick={scrollHandler}>
          <i className="fa fa-angles-left"></i>
        </button>
        <button id="forwardButton" onClick={scrollHandler}>
          <i className="fa fa-angles-right"></i>
        </button>
      </div>
    </div>
  );
}

export default PRScroll;
