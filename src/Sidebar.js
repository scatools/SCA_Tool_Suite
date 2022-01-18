import React, { useState } from "react";
import { Alert, Container, Button } from "react-bootstrap";
import SidebarDismiss from "./SidebarDismiss";
import AddAOIView from "./ViewAddAOI/AddAOIView";
import CurrentAOIView from "./ViewCurrentAOI/CurrentAOIView";
import CreateAssessView from "./ViewCreateAssess/CreateAssessView";
import SidebarMode from "./SidebarMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const arrowIcon = (
  <FontAwesomeIcon
    icon={faRedo}
    color="red"
    size="lg"
    flip="horizontal"
    style={{ paddingLeft: "30px;" }}
  />
);

const Sidebar = ({
  aoiAssembled,
  setAoiAssembled,
  activeSidebar,
  setActiveSidebar,
  setActiveTable,
  setDrawingMode,
  featureList,
  aoiSelected,
  setAoiSelected,
  editAOI,
  setEditAOI,
  setViewport,
  hucBoundary,
  setHucBoundary,
  hucIDSelected,
  setHucIDSelected,
  setFilterList,
  setReportLink,
  autoDraw,
  customizedMeasures,
  setHexGrid
}) => {
  const [view, setView] = useState("add");
  const [alerttext, setAlerttext] = useState(false);
  const aoi = useSelector((state) => state.aoi);
  const resetButton = () => {
    window.location.reload(true);
  };

  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <SidebarDismiss setActiveSidebar={setActiveSidebar} />
      <div className="ControlWrapper">
        <SidebarMode view={view} setView={setView} />
        <hr />
        {view === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setView={setView}
            hucBoundary={hucBoundary}
            setHucBoundary={setHucBoundary}
            hucIDSelected={hucIDSelected}
            setHucIDSelected={setHucIDSelected}
            setFilterList={setFilterList}
            setReportLink={setReportLink}
            autoDraw={autoDraw}
          />
        )}
        {view === "viewCurrent" && (
<<<<<<< HEAD
          <CurrentAOIView
            aoiSelected={aoiSelected}
            setAoiSelected={setAoiSelected}
            setActiveTable={setActiveTable}
            setViewport={setViewport}
            setView={setView}
            setDrawingMode={setDrawingMode}
            editAOI={editAOI}
            setEditAOI={setEditAOI}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setReportLink={setReportLink}
            view={view}
          />
        )}
        {view === "createAssess" && (
          <CreateAssessView
            aoiAssembled={aoiAssembled}
            setAoiAssembled={setAoiAssembled}
            setAlerttext={setAlerttext}
            setView={setView}
          />
=======
          <Container>
            <CurrentAOIView
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              setViewport={setViewport}
              setView={setView}
            />
            <SidebarViewDetail
              aoiSelected={aoiSelected}
              setActiveTable={setActiveTable}
              setDrawingMode={setDrawingMode}
              editAOI={editAOI}
              setEditAOI={setEditAOI}
              featureList={featureList}
              setAlerttext={setAlerttext}
              setReportLink={setReportLink}
              setHexGrid={setHexGrid}
            />
          </Container>
        )}
        {view === "createAssess" && (
          <Container>
            <CreateAssessView
              aoiAssembled={aoiAssembled}
              setAoiAssembled={setAoiAssembled}
              setAlerttext={setAlerttext}
              setView={setView}
              customizedMeasures={customizedMeasures}
            />
          </Container>
>>>>>>> 1a087b9059bbd0db4fa426bc38978069ff9cea6e
        )}
        {alerttext && (
          <Alert
            className="mt-4"
            variant="danger"
            onClose={() => setAlerttext(false)}
            dismissible
          >
            <Alert.Heading>You've got an error!</Alert.Heading>
            <p style={{ color: "#842029" }}>{alerttext}</p>
          </Alert>
        )}
      </div>

      {Object.keys(aoi).length > 0 && (
        <Button
          id="resetButton"
          variant="dark"
          style={{ float: "left" }}
          onClick={resetButton}
        >
          Start Over {arrowIcon}
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
