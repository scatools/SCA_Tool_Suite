import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import {
  alLayerSource,
  flLayerSource,
  laLayerSource,
  msLayerSource,
  txLayerSource
} from "../../../Map/layerSource";
import {
  alVisualizationLayer,
  alVisualizationHighlight,
  flVisualizationLayer,
  flVisualizationHighlight,
  laVisualizationLayer,
  laVisualizationHighlight,
  msVisualizationLayer,
  msVisualizationHighlight,
  txVisualizationLayer,
  txVisualizationHighlight,
} from "../../../Map/layerStyle";

const VisualizationByState = ({ setView, setVisualizeStep, setVisualizationSource, setVisualizationLayer }) => {
  const [selectedState, setSelectedState] = useState(null);
  const onClick = (e) => {
    setSelectedState(e.target.value);
    setView("assess");
  };

  return (
    <div>
      <h4>Please select one Gulf Coast State to visualize:</h4>
      <hr /><hr /><hr />
      <Container className="d-flex flex-column justify-content-between" style={{height:"50vh"}}>
        <Button
          variant="outline-light"
          value="Alabama"
          onClick={(e) => {
            onClick(e);
            setVisualizationSource(alLayerSource);
            setVisualizationLayer(alVisualizationLayer);
          }}
        >
          Alabama
        </Button>
        <Button
          variant="outline-light"
          value="Florida"
          onClick={(e) => {
            onClick(e);
            setVisualizationSource(flLayerSource);
            setVisualizationLayer(flVisualizationLayer);
          }}
        >
          Florida
        </Button>
        <Button
          variant="outline-light"
          value="Louisiana"
          onClick={(e) => {
            onClick(e);
            setVisualizationSource(laLayerSource);
            setVisualizationLayer(laVisualizationLayer);
          }}
        >
          Louisiana
        </Button>
        <Button
          variant="outline-light"
          value="Mississippi"
          onClick={(e) => {
            onClick(e);
            setVisualizationSource(msLayerSource);
            setVisualizationLayer(msVisualizationLayer);
          }}
        >
          Mississippi
        </Button>
        <Button
          variant="outline-light"
          value="Texas"
          onClick={(e) => {
            onClick(e);
            setVisualizationSource(txLayerSource);
            setVisualizationLayer(txVisualizationLayer);
          }}
        >
          Texas
        </Button>
      </Container>
    </div>
  );
};

export default VisualizationByState;
