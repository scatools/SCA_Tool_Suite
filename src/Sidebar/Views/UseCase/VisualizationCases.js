import React from "react";
import SelectVisualizeScale from "./SelectVisualizeScale";
import SelectVisualizeState from "./SelectVisualizeState";

const VisualizationCases = ({ setView }) => {
  const [visualizeStep, setVisualizeStep] = useState("selectScale");
  return (
    <div>
      {visualizeStep === "selectScale" && (
        <SelectVisualizeScale setView={setView} setVisualizeStep={setVisualizeStep} />
      )}
      {visualizeStep === "selectState" && (
        <SelectVisualizeState setView={setView} setVisualizeStep={setVisualizeStep} />
      )}
    </div>
  );
};

export default VisualizationCases;
