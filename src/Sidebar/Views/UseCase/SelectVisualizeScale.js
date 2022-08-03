import React from "react";
import { Button, Container } from "react-bootstrap";
import { gcrLayerSource } from "../../../Map/layerSource";
import { gcrVisualizationLayer, gcrVisualizationHighlight } from "../../../Map/layerStyle";

const SelectVisualizeScale = ({
  setView,
  setVisualizeStep,
  setVisualizationScale,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight
}) => {
  return (
    <div>
      <h4>I would like to create the visualization within ...</h4>
      <hr /><hr /><hr />
      <Container className="d-flex flex-column justify-content-between" style={{height:"50vh"}}>
        <Button
          variant="outline-light"
          onClick={() => {
            setVisualizationScale("region");
            setVisualizationSource(gcrLayerSource);
            setVisualizationLayer(gcrVisualizationLayer);
            setVisualizaitonHighlight(gcrVisualizationHighlight);
            setView("assess");
          }}
        >
          The entire Gulf Coast Region
        </Button>
        <Button
          variant="outline-light"
          onClick={() => {
            setVisualizationScale("state");
            setVisualizeStep("selectState");
          }}
        >
          A single Gulf Coast State
        </Button>
        <Button
          variant="outline-light"
          onClick={() => {
            setVisualizationScale("aoi");
            setView("add");
          }}
        >
          A certain Area of Interest
        </Button>
      </Container>
    </div>
  );
};

export default SelectVisualizeScale;
