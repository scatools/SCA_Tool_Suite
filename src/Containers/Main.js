import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Button } from "react-bootstrap";
import Map from "../Map/Map";
import AoiDetailTable from "../Sidebar/Views/ListAOI/AoiDetailTable";
import { DrawPolygonMode, EditingMode } from "react-map-gl-draw";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBug } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = (
  <FontAwesomeIcon icon={faArrowRight} color="white" size="lg" />
);

const Main = ({
  useCase,
  setUseCase,
  aoiSelected,
  setAoiSelected,
  aoiAssembled,
  setAoiAssembled,
  setReportLink,
  customizedMeasures,
  userLoggedIn,
  view,
  setView,
  setAlertText,
  setAlertType,
}) => {
  const [mode, setMode] = useState(null);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [editAOI, setEditAOI] = useState(false);
  const [hucBoundary, setHucBoundary] = useState(false);
  const [hucIDSelected, setHucIDSelected] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [hexGrid, setHexGrid] = useState(false);
  const [hexDeselection, setHexDeselection] = useState(false);
  const [hexIDDeselected, setHexIDDeselected] = useState([]);
  const [hexFilterList, setHexFilterList] = useState([]);
  const [visualizationLayer, setVisualizationLayer] = useState(null);
  const [visualizationFillColor, setVisualizationFillColor] = useState(null);
  const [visualizationOpacity, setVisualizationOpacity] = useState(50);
  const [zoom, setZoom] = useState(5);
  const [viewport, setViewport] = useState({
    latitude: 27.8,
    longitude: -88.4,
    zoom: zoom,
  });
  const [instruction, setInstruction] = useState(
    "Please zoom in to level 10 to explore the details of a single hexagonal area."
  );

  const autoDraw = async () => {
    setMode(new DrawPolygonMode());
    // Use crosshair as cursor style when drawing new shapes over SCA boundary
    setInteractiveLayerIds(["sca-boundary"]);
  };

  const editMode = async () => {
    setMode(new EditingMode());
  };

  const stopDraw = () => {
    setMode(null);
  };

  return (
    <div>
      <AoiDetailTable
        activeTable={activeTable}
        setActiveTable={setActiveTable}
      />
      <Sidebar
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
        useCase={useCase}
        setUseCase={setUseCase}
        setActiveTable={setActiveTable}
        setDrawingMode={setDrawingMode}
        featureList={featureList}
        aoiSelected={aoiSelected}
        setAoiSelected={setAoiSelected}
        aoiAssembled={aoiAssembled}
        setAoiAssembled={setAoiAssembled}
        editAOI={editAOI}
        setEditAOI={setEditAOI}
        setViewport={setViewport}
        hucBoundary={hucBoundary}
        setHucBoundary={setHucBoundary}
        hucIDSelected={hucIDSelected}
        setHucIDSelected={setHucIDSelected}
        setFilterList={setFilterList}
        setReportLink={setReportLink}
        customizedMeasures={customizedMeasures}
        setHexGrid={setHexGrid}
        setHexDeselection={setHexDeselection}
        hexIDDeselected={hexIDDeselected}
        setHexIDDeselected={setHexIDDeselected}
        setHexFilterList={setHexFilterList}
        userLoggedIn={userLoggedIn}
        autoDraw={autoDraw}
        stopDraw={stopDraw}
        editMode={editMode}
        setVisualizationLayer={setVisualizationLayer}
        setVisualizationFillColor={setVisualizationFillColor}
        visualizationOpacity={visualizationOpacity}
        setVisualizationOpacity={setVisualizationOpacity}
        zoom={zoom}
        instruction={instruction}
        view={view}
        setView={setView}
        setAlertText={setAlertText}
        setAlertType={setAlertType}
      />
      <div className="content">
        <Button
          style={{
            position: "absolute",
            top: "10px",
            left: "-10px",
            zIndex: 1,
          }}
          className="sidebarControlBtn"
          variant="secondary"
          onClick={() => {
            setActiveSidebar(true);
          }}
        >
          {arrowIcon}
        </Button>
        <Map
          useCase={useCase}
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          editAOI={editAOI}
          hucBoundary={hucBoundary}
          hucIDSelected={hucIDSelected}
          filterList={filterList}
          mode={mode}
          setMode={setMode}
          interactiveLayerIds={interactiveLayerIds}
          setInteractiveLayerIds={setInteractiveLayerIds}
          autoDraw={autoDraw}
          hexGrid={hexGrid}
          hexDeselection={hexDeselection}
          hexIDDeselected={hexIDDeselected}
          hexFilterList={hexFilterList}
          visualizationLayer={visualizationLayer}
          visualizationFillColor={visualizationFillColor}
          visualizationOpacity={visualizationOpacity}
          zoom={zoom}
          setZoom={setZoom}
          viewport={viewport}
          setViewport={setViewport}
          setInstruction={setInstruction}
        />
      </div>
    </div>
  );
};

export default Main;
