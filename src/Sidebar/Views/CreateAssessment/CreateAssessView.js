import React, { useState, useEffect } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";
import { Container } from "react-bootstrap";

const CreateAssessView = ({
  useCase,
  aoiAssembled,
  setAoiAssembled,
  customizedMeasures,
  setView,
  setAlertText,
  setAlertType
}) => {
  const [assessStep, setAssessStep] = useState("selectAOI");
  useEffect(() => {
    if (useCase === "visualization") {
      setAssessStep("selectRestoreWeights");
    }
  }, [useCase]);

  return (
    <Container>
      {assessStep === "selectAOI" && (
        <SelectAOIForAssess
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          setAoiAssembled={setAoiAssembled}
          setView={setView}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {assessStep === "selectRestoreWeights" && (
        <SelectRestoreWeights
          useCase={useCase}
          setAssessStep={setAssessStep}
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
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          customizedMeasures={customizedMeasures}
        />
      )}
    </Container>
  );
};

export default CreateAssessView;
