import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import InventoryCases from "./InventoryCases";
import VisualizationCases from "./VisualizationCases";
import { useSelector } from "react-redux";

const UseCaseView = ({
  setVisualizationScale,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight,
  setView,
  setShowTableContainer,
  setAssessStep,
}) => {
  const useCase = useSelector((state) => state.usecase.useCase);
  const aoi = useSelector((state) => state.aoi);
  const aoiList = Object.values(aoi).map((item) => ({
    label: item.name,
    value: item.id,
  }));
  useEffect(() => {
    if (useCase === "prioritization") {
      if (aoiList && aoiList.length > 0) {
        setView("list");
      } else setView("add");
    }
  }, [useCase]);

  return (
    <Container>
      {useCase === "inventory" && (
        <InventoryCases
          setShowTableContainer={setShowTableContainer}
          setView={setView}
        />
      )}
      {useCase === "visualization" && (
        <VisualizationCases
          setAssessStep={setAssessStep}
          setView={setView}
          setVisualizationScale={setVisualizationScale}
          setVisualizationSource={setVisualizationSource}
          setVisualizationLayer={setVisualizationLayer}
          setVisualizaitonHighlight={setVisualizaitonHighlight}
        />
      )}
    </Container>
  );
};

export default UseCaseView;
