import "./Header.css";
import LAYOUTS from "../cytoscape/functions/cyLayouts";

export function Header({ cyState }) {
  function changeLayout() {
    cyState.cy.layout(LAYOUTS.COSE).run();
  }

  return (
    <header>
      <h1>Dwr Uisce Work Package Visualiser</h1>
      <button onClick={changeLayout}>Change Layout </button>
      <button>Filter Options</button>
    </header>
  );
}

export default Header;
