import SDG_ICONS from "../../../assets/sdg_icons";

const sdgIconStyle = { width: "92px", height: "92px", paddingRight: "4px" };

export function makeSDGList(sdgs) {
  return sdgs.map((sdg) => {
    const sdgRef = `SDG_${sdg}`; //creates sdg id from provided numbers
    if (SDG_ICONS[sdgRef]) {
      // makes sure to return only if sdg is defined (i.e. only 1-17)
      return (
        <a href={`${SDG_ICONS[sdgRef].link}`} key={sdgRef} to="route" target="_blank" rel="noopener noreferrer">
          <img
            src={SDG_ICONS[sdgRef].icon}
            alt={`${SDG_ICONS[sdgRef].description}`}
            title={`${SDG_ICONS[sdgRef].description}`}
            style={sdgIconStyle}
          />
        </a>
      );
    }
  });
}

export default makeSDGList;
