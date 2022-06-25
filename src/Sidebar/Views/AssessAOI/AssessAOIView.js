import React, { useState, useEffect } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";
import { Container } from "react-bootstrap";

const AssessAOIView = ({
  useCase,
  aoiAssembled,
  setAoiAssembled,
  customizedMeasures,
  visualizationScale,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizationFillColor,
  setVisualizationOpacity,
  setView,
  setAlertText,
  setAlertType
}) => {
  const [assessStep, setAssessStep] = useState("selectAOI");
  useEffect(() => {
    if (
      useCase === "visualization" && (
        visualizationScale === "region" || visualizationScale === "state"
      )
    ) {
      setAssessStep("selectRestoreWeights");
    }
  }, [useCase, visualizationScale]);

  return (
    <Container>
      {assessStep === "selectAOI" && (
        <SelectAOIForAssess
          useCase={useCase}
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          setAoiAssembled={setAoiAssembled}
          setVisualizationSource={setVisualizationSource}
          setVisualizationLayer={setVisualizationLayer}
          setView={setView}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {assessStep === "selectRestoreWeights" && (
        <SelectRestoreWeights
          useCase={useCase}
          setAssessStep={setAssessStep}
          visualizationScale={visualizationScale}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {assessStep === "selectDataMeasures" && (
        <SelectDataMeasures
          useCase={useCase}
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          customizedMeasures={customizedMeasures}
        />
      )}

      {assessStep === "reviewAssessSettings" && (
        <ReviewAssessSettings
          useCase={useCase}
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          customizedMeasures={customizedMeasures}
          setVisualizationFillColor={setVisualizationFillColor}
          setVisualizationOpacity={setVisualizationOpacity}
          setView={setView}
        />
      )}
    </Container>
  );
};

export default AssessAOIView;
