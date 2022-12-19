import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { DrawPolygonMode, EditingMode } from "react-map-gl-draw";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBug,
  faPlus,
  faChevronRight,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Sidebar/Sidebar";
import Map from "../Map/Map";
import AoiDetailTable from "../Sidebar/Views/ListAOI/AoiDetailTable";
import HexagonScoreTable from "../Sidebar/Views/VisualizeAOI/HexagonScoreTable";

const arrowIcon = (
  <FontAwesomeIcon icon={faArrowRight} color="white" size="lg" />
);

const expandIcon = (
  <FontAwesomeIcon icon={faChevronRight} color="white" size="lg" />
);

const Main = ({
  aoiSelected,
  setAoiSelected,
  aoiAssembled,
  setAoiAssembled,
  setReportLink,
  customizedMeasures,
  setCustomizedMeasures,
  userLoggedIn,
  view,
  setView,
  setAlertText,
  setAlertType,
  assessStep,
  setAssessStep,
  setLargeAoiProgress,
}) => {
  const mapRef = useRef();
  const [mode, setMode] = useState(null);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [editAOI, setEditAOI] = useState(false);
  const [hucBoundary, setHucBoundary] = useState(false);
  const [hucIDSelected, setHucIDSelected] = useState([]);
  const [hucFilterList, setHucFilterList] = useState([]);
  const [hexGrid, setHexGrid] = useState(false);
  const [hexDeselection, setHexDeselection] = useState(false);
  const [hexIDDeselected, setHexIDDeselected] = useState([]);
  const [hexFilterList, setHexFilterList] = useState([]);
  const [visualizationSource, setVisualizationSource] = useState(null);
  const [visualizationLayer, setVisualizationLayer] = useState(null);
  const [visualizationHighlight, setVisualizaitonHighlight] = useState(null);
  const [visualizationFillColor, setVisualizationFillColor] = useState(null);
  const [visualizationOpacity, setVisualizationOpacity] = useState(0);
  const [visualizedHexagon, setVisualizedHexagon] = useState(null);
  const [showTableContainer, setShowTableContainer] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [clickedProperty, setClickedProperty] = useState(null);

  const [scoreTableClass, setScoreTableClass] = useState("score-table");
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
      <HexagonScoreTable
        setScoreTableClass={setScoreTableClass}
        scoreTableClass={scoreTableClass}
        visualizedHexagon={visualizedHexagon}
      />
      <Sidebar
        mapRef={mapRef}
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
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
        setHucFilterList={setHucFilterList}
        setReportLink={setReportLink}
        customizedMeasures={customizedMeasures}
        setCustomizedMeasures={setCustomizedMeasures}
        setHexGrid={setHexGrid}
        setHexDeselection={setHexDeselection}
        hexIDDeselected={hexIDDeselected}
        setHexIDDeselected={setHexIDDeselected}
        setHexFilterList={setHexFilterList}
        userLoggedIn={userLoggedIn}
        autoDraw={autoDraw}
        stopDraw={stopDraw}
        editMode={editMode}
        setVisualizationSource={setVisualizationSource}
        setVisualizationLayer={setVisualizationLayer}
        setVisualizaitonHighlight={setVisualizaitonHighlight}
        setVisualizationFillColor={setVisualizationFillColor}
        visualizationOpacity={visualizationOpacity}
        setVisualizationOpacity={setVisualizationOpacity}
        setShowTableContainer={setShowTableContainer}
        zoom={zoom}
        instruction={instruction}
        view={view}
        setView={setView}
        setAlertText={setAlertText}
        setAlertType={setAlertType}
        assessStep={assessStep}
        setAssessStep={setAssessStep}
        setLargeAoiProgress={setLargeAoiProgress}
        showTableContainer={showTableContainer}
        setInteractiveLayerIds={setInteractiveLayerIds}
        setScoreTableClass={setScoreTableClass}
        setClickedProperty={setClickedProperty}
      />
      <div className="content">
        <Button
          style={{
            position: "absolute",
            top: "65px",
            left: "-05px",
            zIndex: 1,
          }}
          className="sidebarControlBtn"
          variant="secondary"
          onClick={() => {
            setActiveSidebar(true);
          }}
        >
          {expandIcon}
        </Button>
        <Map
          stopDraw={stopDraw}
          mapRef={mapRef}
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          setAoiSelected={setAoiSelected}
          editAOI={editAOI}
          hucBoundary={hucBoundary}
          hucIDSelected={hucIDSelected}
          setHucIDSelected={setHucIDSelected}
          hucFilterList={hucFilterList}
          setHucFilterList={setHucFilterList}
          mode={mode}
          setMode={setMode}
          interactiveLayerIds={interactiveLayerIds}
          setInteractiveLayerIds={setInteractiveLayerIds}
          autoDraw={autoDraw}
          hexGrid={hexGrid}
          hexDeselection={hexDeselection}
          hexIDDeselected={hexIDDeselected}
          hexFilterList={hexFilterList}
          visualizationSource={visualizationSource}
          visualizationLayer={visualizationLayer}
          visualizationHighlight={visualizationHighlight}
          visualizationFillColor={visualizationFillColor}
          visualizationOpacity={visualizationOpacity}
          setVisualizedHexagon={setVisualizedHexagon}
          showTableContainer={showTableContainer}
          setShowTableContainer={setShowTableContainer}
          zoom={zoom}
          setZoom={setZoom}
          viewport={viewport}
          setViewport={setViewport}
          setInstruction={setInstruction}
          view={view}
          clickedProperty={clickedProperty}
          setClickedProperty={setClickedProperty}
        />
      </div>
    </div>
  );
};

export default Main;
