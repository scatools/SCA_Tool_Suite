import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Carousel,
  Container,
  ToggleButton,
  Accordion,
  Card,
} from "react-bootstrap";
import OptionsAccordion from "../../../Components/OptionsAccordion";
import { useSelector } from "react-redux";
import { WebMercatorViewport } from "react-map-gl";
import bbox from "@turf/bbox";
import { MdDelete, MdEdit, MdMore, MdSave, MdViewList } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FaFileExport } from "react-icons/fa";
import { IoFileTrayFull } from "react-icons/io5";
import SidebarViewDetail from "./SidebarViewDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setUseCase } from "../../../Redux/action";

const arrowLeft = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;
const arrowRight = <FontAwesomeIcon icon={faArrowRight} size="lg" />;
const downArrow = <FontAwesomeIcon icon={faChevronDown} color="white" />;

const ListAOIView = ({
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
  showTableContainer,
  view,
  setView,
  setAlertText,
  setAlertType,
  setLargeAoiProgress,
  setAssessStep,
}) => {
  const aoiList = Object.values(useSelector((state) => state.aoi));
  const useCase = useSelector((state) => state.usecase.useCase);
  const dispatch = useDispatch();
  const history = useHistory();
  let dismissButton = document.querySelector("#dismiss-detail");
  const [aoiListLength, setAoiListLength] = useState(aoiList.length);

  useEffect(() => {
    if (useCase === "inventory") setShowTableContainer(true);
  }, [useCase]);

  useEffect(() => {
    setAoiListLength(aoiList.length);
    if (aoiList.length === 0) setView("add");
  }, [aoiList]);

  useEffect(() => {
    if (view === "list" && aoiList.length > 0) {
      let viewThisAoi = aoiList[aoiListLength - 1].id;
      setAoiSelected(viewThisAoi);
      let aoiBbox = bbox({
        type: "FeatureCollection",
        features: aoiList[aoiListLength - 1].geometry,
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
    //ANTHONY VERSION
    // <Container className="test">
    //   <h3 style={{ marginBottom: "20px" }}>
    //     {useCase === "inventory"
    //       ? "View Plans for Selected AOI"
    //       : "Review/Edit Current AOIs"}
    //   </h3>
    //   <Container className="add-assess-cont">
    //     {useCase === "inventory" ? (
    //       <Button
    //         variant="primary"
    //         onClick={() => {
    //           if (aoiList && aoiList.length > 1) {
    //             dispatch(setUseCase("prioritization"));
    //             setShowTableContainer(false);
    //             setAssessStep("selectAOI");
    //             setView("assess");
    //           } else {
    //             dispatch(setUseCase("prioritization"));
    //             setShowTableContainer(false);
    //             setView("add");
    //           }
    //         }}
    //       >
    //         Compare Multiple AOIs
    //       </Button>
    //     ) : (
    //       <Button variant="secondary" onClick={() => setView("add")}>
    //         {arrowLeft} Add More AOIs
    //       </Button>
    //     )}
    //     {useCase === "visualization" ? (
    //       <Button
    //         variant="primary"
    //         onClick={() => {
    //           setAssessStep("selectAOI");
    //           setView("assess");
    //         }}
    //       >
    //         Visualize AOI {arrowRight}
    //       </Button>
    //     ) : useCase === "prioritization" ? (
    //       <Button
    //         variant="primary"
    //         onClick={() => {
    //           setAssessStep("selectAOI");
    //           setView("assess");
    //         }}
    //       >
    //         Evaluate AOIs {arrowRight}
    //       </Button>
    //     ) : (
    //       <Button
    //         variant="primary"
    //         onClick={() => {
    //           dispatch(setUseCase("visualization"));
    //           setShowTableContainer(false);
    //           setAssessStep("selectAOI");
    //           setView("assess");
    //         }}
    //       >
    //         Visualize AOI Heatmap
    //       </Button>
    //     )}
    //   </Container>
    <>
      <h3 style={{ marginBottom: "20px" }}>
        {useCase === "inventory"
          ? "View Plans for Selected AOI"
          : "Review/Edit Current AOIs"}
      </h3>
      <Container className="button-container">
        {useCase === "prioritization" ? (
          <Button variant="secondary" onClick={() => setView("add")}>
            {arrowLeft} Add More AOIs
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => setView("add")}>
            {arrowLeft} Add Another AOI
          </Button>
        )}
        {useCase === "visualization" ? (
          <Button variant="primary" onClick={() => setView("assess")}>
            Visualize AOI {arrowRight}
          </Button>
        ) : useCase === "prioritization" ? (
          <Button
            variant="primary"
            onClick={() => {
              setAssessStep("selectAOI");
              setView("assess");
            }}
          >
            Evaluate AOIs {arrowRight}
          </Button>
        ) : (
          <></>
        )}
      </Container>
      <Container className="aoi-list-container">
        <ButtonGroup
          toggle
          className="mb-2 "
          vertical
          style={{ width: "100%" }}
        >
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
                  let aoiBbox = bbox({
                    type: "FeatureCollection",
                    features: aoi.geometry,
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
            showTableContainer={showTableContainer}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            aoiFullList={aoiList}
            setAoiSelected={setAoiSelected}
            setViewport={setViewport}
            setLargeAoiProgress={setLargeAoiProgress}
            setView={setView}
          />
        </ButtonGroup>
        {/* <Carousel style={{ cursor: "pointer" }} interval={null}>
          <Carousel.Item
            onClick={() => {
              history.push("/report");
              setReportLink(true);
            }}
          >
            <img className="d-block w-100" src="/Banner_gray.png" />
            <Carousel.Caption>
              <h6 style={{ margin: 0, padding: 0 }}>Would you like to...</h6>
              <p style={{ fontSize: 12, margin: 0, padding: 0 }}>
                Quantify this area of interest according to its conservation
                values?
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          {useCase !== "visualization" && (
            <Carousel.Item
              onClick={() => {
                dispatch(setUseCase("visualization"));
                setShowTableContainer(false);
                setView("assess");
              }}
            >
              <img className="d-block w-100" src="/Banner_gray.png" />
              <Carousel.Caption>
                <h6 style={{ margin: 0, padding: 0 }}>Would you like to...</h6>
                <p style={{ fontSize: 11, margin: 0, padding: 0 }}>
                  Visualize this area of interest based on your conservation
                  priorities?
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {useCase !== "prioritization" && (
            <Carousel.Item
              onClick={() => {
                dispatch(setUseCase("prioritization"));
                setShowTableContainer(false);
                setView("add");
              }}
            >
              <img className="d-block w-100" src="/Banner_gray.png" />
              <Carousel.Caption>
                <h6 style={{ margin: 0, padding: 0 }}>Would you like to...</h6>
                <p style={{ fontSize: 11, margin: 0, padding: 0 }}>
                  Compare multiple areas of interest under certain conservation
                  scenario?
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {useCase !== "inventory" && (
            <Carousel.Item
              onClick={() => {
                setShowTableContainer(!showTableContainer);
              }}
            >
              <img className="d-block w-100" src="/Banner_gray.png" />
              <Carousel.Caption>
                <h6 style={{ margin: 0, padding: 0 }}>Would you like to...</h6>
                <p style={{ fontSize: 12, margin: 0, padding: 0 }}>
                  View the list of conservation plans related to this area of
                  interest?
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          )}
        </Carousel> */}
        <OptionsAccordion
          view={view}
          setView={setView}
          setAssessStep={setAssessStep}
          setShowTableContainer={setShowTableContainer}
        />
      </Container>
    </>
  );
};

export default ListAOIView;
