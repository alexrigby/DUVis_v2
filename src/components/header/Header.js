import "./Header.css";
import LAYOUTS from "../../configs/cyLayouts";

export function Header({ cyState }) {
  function changeLayout() {
    cyState.cy.layout(LAYOUTS.COSE).run();
  }

  return (
    <div className="headerSection">
      <h1>Dwr Uisce Work Package Visualiser</h1>
      <button onClick={changeLayout} style={{ zIndex: "11111" }}>
        Change Layout{" "}
      </button>
      <button>Filter Options</button>
    </div>
  );
}

export default Header;
