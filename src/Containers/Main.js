import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { DrawPolygonMode, EditingMode } from "react-map-gl-draw";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBug } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Sidebar/Sidebar";
import Map from "../Map/Map";
import AoiDetailTable from "../Sidebar/Views/ListAOI/AoiDetailTable";

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
  const [filterList, setFilterList] = useState([]);
  const [hexGrid, setHexGrid] = useState(false);
  const [hexDeselection, setHexDeselection] = useState(false);
  const [hexIDDeselected, setHexIDDeselected] = useState([]);
  const [hexFilterList, setHexFilterList] = useState([]);
  const [visualizationSource, setVisualizationSource] = useState(null);
  const [visualizationLayer, setVisualizationLayer] = useState(null);
  const [visualizationFillColor, setVisualizationFillColor] = useState(null);
  const [visualizationOpacity, setVisualizationOpacity] = useState(0);
	const [showTableContainer, setShowTableContainer] = useState(false);
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
        mapRef={mapRef}
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
        setVisualizationSource={setVisualizationSource}
        setVisualizationLayer={setVisualizationLayer}
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
          mapRef={mapRef}
          useCase={useCase}
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          setAoiSelected={setAoiSelected}
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
          visualizationSource={visualizationSource}
          visualizationLayer={visualizationLayer}
          visualizationFillColor={visualizationFillColor}
          visualizationOpacity={visualizationOpacity}
          showTableContainer={showTableContainer}
          setShowTableContainer={setShowTableContainer}
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
