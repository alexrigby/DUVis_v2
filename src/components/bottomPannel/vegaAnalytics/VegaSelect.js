import Select from "react-select";

import { actFields } from "../../../data";

import "./VegaAnalytics.css";

export function VegaSelect({ setSelectedMetric }) {
  //maps over values from user defined categorical meta_fileds  to create select options
  const options = actFields.META_FIELDS.filter((f) => f.type === "categorical").map((field) => ({
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
