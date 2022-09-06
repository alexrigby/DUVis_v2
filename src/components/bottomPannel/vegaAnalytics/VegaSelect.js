import Select from "react-select";

import vegaMetricFields from "../../../configs/vegaMetricFields";

import "./VegaAnalytics.css";

export function VegaSelect({ setSelectedMetric }) {
  //maps over values from vegametricFields config file to create select options
  const options = vegaMetricFields.map((field) => ({
    value: field,
    label: field,
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
