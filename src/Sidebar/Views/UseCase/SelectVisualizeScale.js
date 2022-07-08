import React from "react";
import { Button, Container } from "react-bootstrap";
import { gcrLayerSource } from "../../../Map/layerSource";
import { gcrVisualizationLayer, gcrVisualizationHighlight } from "../../../Map/layerStyle";

const SelectVisualizeScale = ({
  setView,
  setVisualizeStep,
  setVisualizationScale,
  setVisualizationSource,
  setVisualizationLayer
}) => {
  return (
    <div>
      <h4>On which scale would you like this visualization to be based?</h4>
      <hr /><hr /><hr />
      <Container className="d-flex flex-column justify-content-between" style={{height:"50vh"}}>
        <Button
          variant="outline-light"
          onClick={() => {
            setVisualizationScale("region");
            setVisualizationSource(gcrLayerSource);
            setVisualizationLayer(gcrVisualizationLayer);
            setView("assess");
          }}
        >
          I would like to create the visualization within the entire Gulf Coast Region
        </Button>
        <Button
          variant="outline-light"
          onClick={() => {
            setVisualizationScale("state");
            setVisualizeStep("selectState");
          }}
        >
          I would like to create the visualization within a single Gulf Coast State
        </Button>
        <Button
          variant="outline-light"
          onClick={() => {
            setVisualizationScale("aoi");
            setView("add");
          }}
        >
          I would like to create the visualization within a certain Area of Interest
        </Button>
      </Container>
    </div>
  );
};

export default SelectVisualizeScale;
