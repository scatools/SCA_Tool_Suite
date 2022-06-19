import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
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

const VisualizationByState = ({ setView, setVisualizeStep, setVisualizationLayer }) => {
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
        <Button variant="outline-light" value="Alabama" onClick={(e) => onClick(e)}>
          Alabama
        </Button>
        <Button variant="outline-light" value="Florida" onClick={(e) => onClick(e)}>
          Florida
        </Button>
        <Button variant="outline-light" value="Louisiana" onClick={(e) => onClick(e)}>
          Louisiana
        </Button>
        <Button variant="outline-light" value="Mississippi" onClick={(e) => onClick(e)}>
          Mississippi
        </Button>
        <Button variant="outline-light" value="Texas" onClick={(e) => onClick(e)}>
          Texas
        </Button>
      </Container>
    </div>
  );
};

export default VisualizationByState;
