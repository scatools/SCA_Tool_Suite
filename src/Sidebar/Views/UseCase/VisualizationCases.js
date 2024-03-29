import React, { useState } from "react";
import SelectVisualizeScale from "./SelectVisualizeScale";
import SelectVisualizeState from "./SelectVisualizeState";

const VisualizationCases = ({
  setAssessStep,
  setView,
  setVisualizationScale,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight,
  setSelectedState
}) => {
  const [visualizeStep, setVisualizeStep] = useState("selectScale");
  return (
    <div>
      {visualizeStep === "selectScale" && (
        <SelectVisualizeScale
          setAssessStep={setAssessStep}
          setView={setView}
          setVisualizeStep={setVisualizeStep}
          setVisualizationScale={setVisualizationScale}
          setVisualizationSource={setVisualizationSource}
          setVisualizationLayer={setVisualizationLayer}
          setVisualizaitonHighlight={setVisualizaitonHighlight}
        />
      )}
      {visualizeStep === "selectState" && (
        <SelectVisualizeState
          setView={setView}
          setVisualizeStep={setVisualizeStep}
          setVisualizationSource={setVisualizationSource}
          setVisualizationLayer={setVisualizationLayer}
          setVisualizaitonHighlight={setVisualizaitonHighlight}
          setSelectedState={setSelectedState}
        />
      )}
    </div>
  );
};

export default VisualizationCases;
