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
}) => {
  const useCase = useSelector((state) => state.usecase.useCase);
  useEffect(() => {
    if (useCase === "prioritization") {
      setView("add");
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
