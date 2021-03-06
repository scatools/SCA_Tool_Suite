import React, { useEffect } from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import { WebMercatorViewport } from "react-map-gl";
import bbox from "@turf/bbox";
import SidebarViewDetail from "./SidebarViewDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const arrowLeft = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;
const arrowRight = <FontAwesomeIcon icon={faArrowRight} size="lg" />;

const ListAOIView = ({
  useCase,
  aoiSelected,
  setAoiSelected,
  setActiveTable,
  setViewport,
  setDrawingMode,
  editAOI,
  setEditAOI,
  featureList,
  setReportLink,
  setHexGrid,
  setHexDeselection,
  hexIDDeselected,
  setHexIDDeselected,
  setHexFilterList,
  userLoggedIn,
  editMode,
  stopDraw,
  setShowTableContainer,
  view,
  setView,
  setAlertText,
  setAlertType
}) => {
  const aoiList = Object.values(useSelector((state) => state.aoi));

  let dismissButton = document.querySelector("#dismiss-detail");

  useEffect(() => {
    if (view === "list" && aoiList.length > 0) {
      let viewThisAoi = aoiList[0].id;
      setAoiSelected(viewThisAoi);
      let aoiBbox = bbox({
        type: "FeatureCollection",
        features: aoiList[0].geometry,
      });
      // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
      let viewportBbox = [
        [aoiBbox[0], aoiBbox[1]],
        [aoiBbox[2], aoiBbox[3]],
      ];
      // Use WebMercatorViewport to get center longitude/latitude and zoom level
      let newViewport = new WebMercatorViewport({
        width: 800,
        height: 600,
      }).fitBounds(viewportBbox, { padding: 100 });
      // console.log(newViewport);
      setViewport({
        latitude: newViewport.latitude,
        longitude: newViewport.longitude - 0.5 * (aoiBbox[2] - aoiBbox[0]),
        zoom: newViewport.zoom,
      });
    }
  }, [view]);

  return (
    <Container className="test">
      <h3 style={{ marginBottom: "20px" }}>Review/Edit Current AOIs</h3>
      <ButtonGroup toggle className="mb-2 " vertical style={{ width: "100%" }}>
        {aoiList.length > 0 &&
          aoiList.map((aoi) => (
            <ToggleButton
              key={aoi.id}
              type="radio"
              variant="outline-secondary"
              name={aoi.id}
              value={aoi.id}
              checked={aoiSelected === aoi.id}
              onChange={(e) => {
                setActiveTable(false);
                dismissButton.classList.remove("active");
                setAoiSelected(e.currentTarget.value);
                // Use Turf to get the bounding box of the collections of features
                var aoiBbox = bbox({
                  type: "FeatureCollection",
                  features: aoi.geometry,
                });
                // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
                var viewportBbox = [
                  [aoiBbox[0], aoiBbox[1]],
                  [aoiBbox[2], aoiBbox[3]],
                ];
                // Use WebMercatorViewport to get center longitude/latitude and zoom level
                var newViewport = new WebMercatorViewport({
                  width: 800,
                  height: 600,
                }).fitBounds(viewportBbox, { padding: 100 });
                // console.log(newViewport);
                setViewport({
                  latitude: newViewport.latitude,
                  longitude:
                    newViewport.longitude - 0.5 * (aoiBbox[2] - aoiBbox[0]),
                  zoom: newViewport.zoom,
                });
              }}
            >
              {aoi.name}
            </ToggleButton>
          ))}

        <SidebarViewDetail
          aoiSelected={aoiSelected}
          setActiveTable={setActiveTable}
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
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      </ButtonGroup>
      <Container className="add-assess-cont">
        <Button variant="secondary" onClick={() => setView("add")}>
          {arrowLeft} Add More AOIs
        </Button>
        {useCase === "visualization" ? (
          <Button variant="primary" onClick={() => setView("assess")}>
            Visualize AOI {arrowRight}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setView("assess")}>
            Evaluate AOIs {arrowRight}
          </Button>
        )}
      </Container>
    </Container>
  );
};

export default ListAOIView;
