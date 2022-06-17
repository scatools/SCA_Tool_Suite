import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import InventoryCases from "./InventoryCases";
import VisualizationCases from "./VisualizationCases";

const UseCaseView = ({ useCase, setUseCase, setView }) => {
  useEffect(() =>{
    if (useCase === "prioritization") {
      setView("add");
    }
  }, [useCase]);
  
  return (
    <Container>
      {useCase === "inventory" && (
        <InventoryCases setView={setView} />
      )}
      {useCase === "visualization" && (
        <VisualizationCases setView={setView}/>
      )}
    </Container>
  );
};

export default UseCaseView;
