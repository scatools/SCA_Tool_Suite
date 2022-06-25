import React, { useState } from "react";
import SelectVisualizeScale from "./SelectVisualizeScale";
import SelectVisualizeState from "./SelectVisualizeState";

const VisualizationCases = ({
  setView,
  setVisualizationScale,
  setVisualizationSource,
  setVisualizationLayer
}) => {
  const [visualizeStep, setVisualizeStep] = useState("selectScale");
  return (
    <div>
      {visualizeStep === "selectScale" && (
        <SelectVisualizeScale
          setView={setView}
          setVisualizeStep={setVisualizeStep}
          setVisualizationScale={setVisualizationScale}
          setVisualizationSource={setVisualizationSource}
          setVisualizationLayer={setVisualizationLayer}
        />
      )}
      {visualizeStep === "selectState" && (
        <SelectVisualizeState
          setView={setView}
          setVisualizeStep={setVisualizeStep}
          setVisualizationSource={setVisualizationSource}
          setVisualizationLayer={setVisualizationLayer}
        />
      )}
    </div>
  );
};

export default VisualizationCases;
