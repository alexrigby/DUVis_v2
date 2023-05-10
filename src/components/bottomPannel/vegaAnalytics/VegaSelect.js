import { useContext } from "react";
import Select from "react-select";
import ConfigContext from "../../../context/ConfigContext";

import "./VegaAnalytics.css";

export function VegaSelect({ setSelectedMetric }) {
  const config = useContext(ConfigContext);
  const actFields = config.actFields;
  //maps over values from user defined categorical meta_fileds  to create select options
  const options = actFields.META_FIELDS.filter((f) => f.type === "category").map((field) => ({
    value: field.name,
    label: field.name,
  }));

  const optionSelectHandler = (selected) => {
    setSelectedMetric((prevState) => (selected.value === prevState ? prevState : selected.value));
  };

  return (
    <div className="vegaSelect">
      <Select options={options} onChange={optionSelectHandler} />
    </div>
  );
}

export default VegaSelect;
