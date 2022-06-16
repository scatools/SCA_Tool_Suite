import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import InventoryCases from "./InventoryCases";
import VisualizationCases from "./VisualizationCases";

const UseCaseView = ({ useCase, setView }) => {
  useEffect(() =>{
    if (useCase === "prioritization") {
      setView("add");
    }
  }, [useCase]);
  
  return (
    <Container>
      {useCase === "inventory" && (
        <InventoryCases />
      )}
      {useCase === "visualization" && (
        <VisualizationCases />
      )}
    </Container>
  );
};

export default UseCaseView;
