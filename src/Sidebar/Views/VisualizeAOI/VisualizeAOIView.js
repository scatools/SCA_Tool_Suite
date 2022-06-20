import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const VisualizeAOIView = ({
  visualizationOpacity,
  setVisualizationOpacity,
  zoom,
  instruction
}) => {
  return (
    <Container>
      <p>
        <em>{instruction}</em>
      </p>
      <p>Current Zoom Level : {zoom}</p>
      <label>Layer Opacity (%) :</label>
      <RangeSlider
        step={1}
        value={visualizationOpacity}
        onChange={(e) => setVisualizationOpacity(e.target.value)}
        variant="secondary"
      />
    </Container>
  );
};

export default VisualizeAOIView;
