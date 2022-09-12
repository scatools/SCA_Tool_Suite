import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { GoReport } from "react-icons/go";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import SidebarDismiss from "./SidebarDismiss";
import UseCaseView from "./Views/UseCase/UseCaseView";
import AddAOIView from "./Views/AddAOI/AddAOIView";
import ListAOIView from "./Views/ListAOI/ListAOIView";
import AssessAOIView from "./Views/AssessAOI/AssessAOIView";
import VisualizeAOIView from "./Views/VisualizeAOI/VisualizeAOIView";
import SidebarMode from "./SidebarMode";

const arrowIcon = (
  <FontAwesomeIcon icon={faRedo} color="red" size="lg" flip="horizontal" />
);

const alertIcon = (
  <FontAwesomeIcon
    icon={faExclamationCircle}
    color="red"
    style={{ margin: "0 5px;" }}
  />
);

const Sidebar = ({
  mapRef,
  activeSidebar,
  setActiveSidebar,
  useCase,
  setUseCase,
  setActiveTable,
  setDrawingMode,
  featureList,
  aoiSelected,
  setAoiSelected,
  aoiAssembled,
  setAoiAssembled,
  editAOI,
  setEditAOI,
  setViewport,
  hucBoundary,
  setHucBoundary,
  hucIDSelected,
  setHucIDSelected,
  setFilterList,
  setReportLink,
  customizedMeasures,
  setCustomizedMeasures,
  setHexGrid,
  setHexDeselection,
  hexIDDeselected,
  setHexIDDeselected,
  setHexFilterList,
  userLoggedIn,
  autoDraw,
  stopDraw,
  editMode,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight,
  setVisualizationFillColor,
  visualizationOpacity,
  setVisualizationOpacity,
  setShowTableContainer,
  zoom,
  instruction,
  view,
  setView,
  setAlertText,
  setAlertType,
  assessStep,
  setAssessStep,
  setLargeAoiProgress,
}) => {
  const aoi = useSelector((state) => state.aoi);
  const resetButton = () => {
    window.location.reload(true);
  };
  const [confirmShow, setConfirmShow] = useState(false);
  const [visualizationScale, setVisualizationScale] = useState(null);

  const history = useHistory();

  const confirmClose = () => setConfirmShow(false);
  const showConfirm = () => setConfirmShow(true);

  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <SidebarDismiss setActiveSidebar={setActiveSidebar} />
      <div className="ControlWrapper">
        <SidebarMode view={view} setView={setView} />
        <hr />
        {view === "selectUseCase" && (
          <UseCaseView
            useCase={useCase}
            setVisualizationScale={setVisualizationScale}
            setVisualizationSource={setVisualizationSource}
            setVisualizationLayer={setVisualizationLayer}
            setVisualizaitonHighlight={setVisualizaitonHighlight}
            setView={setView}
          />
        )}
        {view === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            hucBoundary={hucBoundary}
            setHucBoundary={setHucBoundary}
            hucIDSelected={hucIDSelected}
            setHucIDSelected={setHucIDSelected}
            setFilterList={setFilterList}
            setReportLink={setReportLink}
            autoDraw={autoDraw}
            stopDraw={stopDraw}
            setView={setView}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            setLargeAoiProgress={setLargeAoiProgress}
          />
        )}
        {view === "list" && (
          <ListAOIView
            useCase={useCase}
            aoiSelected={aoiSelected}
            setAoiSelected={setAoiSelected}
            setActiveTable={setActiveTable}
            setViewport={setViewport}
            setDrawingMode={setDrawingMode}
            editAOI={editAOI}
            setEditAOI={setEditAOI}
            featureList={featureList}
            setReportLink={setReportLink}
            setHexGrid={setHexGrid}
            setHexDeselection={setHexDeselection}
            hexIDDeselected={hexIDDeselected}
            setHexIDDeselected={setHexIDDeselected}
            setHexFilterList={setHexFilterList}
            userLoggedIn={userLoggedIn}
            editMode={editMode}
            stopDraw={stopDraw}
            setShowTableContainer={setShowTableContainer}
            view={view}
            setView={setView}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            setAssessStep={setAssessStep}
          />
        )}
        {view === "assess" && (
          <AssessAOIView
            useCase={useCase}
            aoiAssembled={aoiAssembled}
            setAoiAssembled={setAoiAssembled}
            customizedMeasures={customizedMeasures}
            setCustomizedMeasures={setCustomizedMeasures}
            visualizationScale={visualizationScale}
            setVisualizationSource={setVisualizationSource}
            setVisualizationLayer={setVisualizationLayer}
            setVisualizaitonHighlight={setVisualizaitonHighlight}
            setVisualizationFillColor={setVisualizationFillColor}
            setVisualizationOpacity={setVisualizationOpacity}
            setView={setView}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            assessStep={assessStep}
            setAssessStep={setAssessStep}
          />
        )}
        {view === "visualize" && (
          <VisualizeAOIView
            mapRef={mapRef}
            visualizationOpacity={visualizationOpacity}
            setVisualizationOpacity={setVisualizationOpacity}
            zoom={zoom}
            instruction={instruction}
            setAssessStep={setAssessStep}
            setView={setView}
          />
        )}
      </div>

      {Object.keys(aoi).length > 0 && (
        <Button
          id="resetButton"
          variant="dark"
          style={{ float: "left" }}
          onClick={showConfirm}
        >
          Start Over {arrowIcon}
        </Button>
      )}

      <Modal show={confirmShow} onHide={confirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>WAIT{alertIcon}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This will delete everything you've done so far.</p>
          <p>Are you sure you'd like to continue?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={confirmClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={resetButton}>
            Yes, start over.
          </Button>
        </Modal.Footer>
      </Modal>

      <Button
        title="Report A Bug"
        onClick={() => history.push("/support")}
        className="bug-icon-btn"
      >
        <GoReport />
      </Button>
    </div>
  );
};

export default Sidebar;
