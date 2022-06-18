import React, { useState } from "react";
import SelectVisualizeScale from "./SelectVisualizeScale";
import SelectVisualizeState from "./SelectVisualizeState";

const VisualizationCases = ({ setView, setVisualizationLayer }) => {
  const [visualizeStep, setVisualizeStep] = useState("selectScale");
  return (
    <div>
      {visualizeStep === "selectScale" && (
        <SelectVisualizeScale
          setView={setView}
          setVisualizeStep={setVisualizeStep}
          setVisualizationLayer={setVisualizationLayer}
        />
      )}
      {visualizeStep === "selectState" && (
        <SelectVisualizeState
          setView={setView}
          setVisualizeStep={setVisualizeStep}
          setVisualizationLayer={setVisualizationLayer}
        />
      )}
    </div>
  );
};

export default VisualizationCases;
