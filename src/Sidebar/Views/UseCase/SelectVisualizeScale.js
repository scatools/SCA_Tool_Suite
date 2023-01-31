import React from "react";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { gcrLayerSource } from "../../../Map/layerSource";
import {
  gcrVisualizationLayer,
  gcrVisualizationHighlight,
} from "../../../Map/layerStyle";

const SelectVisualizeScale = ({
  setView,
  setVisualizeStep,
  setVisualizationScale,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight,
  setAssessStep,
}) => {
  const aoi = useSelector((state) => state.aoi);
  const aoiList = Object.values(aoi).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <div>
      <h4>I would like to create the visualization within ...</h4>
      <Container className="vis-select" style={{ height: "50vh" }}>
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
            if (aoiList && aoiList.length > 0) {
              setAssessStep("selectAOI");
              setView("assess");
            } else setView("add");
          }}
        >
          A certain Area of Interest
        </Button>
      </Container>
    </div>
  );
};

export default SelectVisualizeScale;
