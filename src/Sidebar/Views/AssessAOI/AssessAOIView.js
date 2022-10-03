import React, { useState, useEffect } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

const AssessAOIView = ({
  aoiAssembled,
  setAoiAssembled,
  customizedMeasures,
  setCustomizedMeasures,
  visualizationScale,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight,
  setVisualizationFillColor,
  setVisualizationOpacity,
  setView,
  setAlertText,
  setAlertType,
  assessStep,
  setAssessStep,
}) => {
  const location = useLocation();
  const useCase = useSelector((state) => state.usecase.useCase);
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
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          setAoiAssembled={setAoiAssembled}
          setVisualizationSource={setVisualizationSource}
          setVisualizationLayer={setVisualizationLayer}
          setVisualizaitonHighlight={setVisualizaitonHighlight}
          setView={setView}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {assessStep === "selectRestoreWeights" && (
        <SelectRestoreWeights
          setAssessStep={setAssessStep}
          visualizationScale={visualizationScale}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {assessStep === "selectDataMeasures" && (
        <SelectDataMeasures
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          customizedMeasures={customizedMeasures}
          setCustomizedMeasures={setCustomizedMeasures}
        />
      )}

      {assessStep === "reviewAssessSettings" && (
        <ReviewAssessSettings
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
