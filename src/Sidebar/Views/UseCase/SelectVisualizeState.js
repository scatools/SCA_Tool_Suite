import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  alLayerSource,
  flLayerSource,
  laLayerSource,
  msLayerSource,
  txLayerSource,
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

const SelectVisualizeState = ({
  setView,
  setVisualizeStep,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight,
  setSelectedState
}) => {
  const onClick = (e) => {
    setSelectedState(e.target.value);
    setView("assess");
  };
  const useCase = useSelector((state) => state.usecase.useCase);
  const handleBack = () => {
    setVisualizeStep("selectScale");
  };

  return (
    <div>
      {useCase === "visualization" && (
        <Container style={{ marginTop: "-85px", marginBottom: "35px" }}>
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        </Container>
      )}
      <h4>Please select one Gulf Coast State to visualize:</h4>
      <hr />
      <hr />
      <hr />
      <Container
        className="d-flex flex-column justify-content-between"
        style={{ height: "50vh" }}
      >
        <Button
          variant="outline-light"
          value="Alabama"
          onClick={(e) => {
            onClick(e);
            setVisualizationSource(alLayerSource);
            setVisualizationLayer(alVisualizationLayer);
            setVisualizaitonHighlight(alVisualizationHighlight);
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
            setVisualizaitonHighlight(flVisualizationHighlight);
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
            setVisualizaitonHighlight(laVisualizationHighlight);
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
            setVisualizaitonHighlight(msVisualizationHighlight);
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
            setVisualizaitonHighlight(txVisualizationHighlight);
          }}
        >
          Texas
        </Button>
      </Container>
    </div>
  );
};

export default SelectVisualizeState;
