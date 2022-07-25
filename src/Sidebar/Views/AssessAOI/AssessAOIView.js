import React, { useState, useEffect } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";
import { useLocation } from "react-router-dom";
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
  setAlertType,
  assessStep,
  setAssessStep,
}) => {
  const location = useLocation();
  useEffect(() => {
    if (
      useCase === "visualization" &&
      (visualizationScale === "region" || visualizationScale === "state")
    ) {
      setAssessStep("selectRestoreWeights");
    }
  }, [useCase, visualizationScale]);
  useEffect(() => {
    if (location.pathname === "/user/measures") {
      setAssessStep("selectRestoreWeights");
    }
  }, [location]);

  return (
    <Container>
      {assessStep === "selectAOI" && location.pathname !== "/user/measures" && (
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
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}
    </Container>
  );
};

export default AssessAOIView;
