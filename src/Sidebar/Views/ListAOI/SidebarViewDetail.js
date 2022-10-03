import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Accordion,
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { MdViewList, MdEdit, MdDelete, MdSave } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FaFileExport } from "react-icons/fa";
import { IoFileTrayFull } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { download } from "shp-write";
import axios from "axios";
import { delete_aoi, edit_aoi, setLoader } from "../../../Redux/action";
import {
  calculateArea,
  aggregate,
  getStatus,
} from "../../../Helper/aggregateHex";
import { WebMercatorViewport } from "react-map-gl";

import {
  squareGrid,
  intersect,
  distance,
  square,
  bbox,
  buffer,
} from "@turf/turf";

const alertIcon = (
  <FontAwesomeIcon
    icon={faExclamationCircle}
    color="red"
    style={{ margin: "0 5px;" }}
  />
);

const downArrow = <FontAwesomeIcon icon={faChevronDown} color="white" />;

const SidebarViewDetail = ({
  aoiSelected,
  setActiveTable,
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
  setAlertText,
  setAlertType,
  setLargeAoiProgress,
  setView,
}) => {
  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );
  const useCase = useSelector((state) => state.usecase.useCase);
  const dispatch = useDispatch();
  const history = useHistory();
  const [aoiName, setAoiName] = useState("");
  const [modifyButtonState, setModifyButtonState] = useState("modify");
  const [modifyButtonLabel, setModifyButtonLabel] = useState("Modify Shape");
  const [modifyButtonDisabled, setModifyButtonDisabled] = useState(false);
  const [showButtonState, setShowButtonState] = useState("show");
  const [showButtonLabel, setShowButtonLabel] = useState("Show Hexagon Grid");
  const [showButtonDisabled, setShowButtonDisabled] = useState(false);
  const [deselectButtonState, setDeselectButtonState] = useState("deselect");
  const [deselectButtonLabel, setDeselectButtonLabel] =
    useState("Deselect Hexagon");
  const [deselectButtonDisabled, setDeselectButtonDisabled] = useState(true);
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
  const [confirmShow, setConfirmShow] = useState(false);

  let maxProgress = 0;

  useEffect(() => {
    dispatch(setLoader(false));
  }, []);

  const modifyShape = () => {
    if (modifyButtonState === "modify") {
      setModifyButtonState("finalize");
      setModifyButtonLabel("Finalize Shape");
      setConfirmButtonDisabled(true);
      setShowButtonDisabled(true);
      setDrawingMode(true);
      editMode();
    } else {
      setModifyButtonState("modify");
      setModifyButtonLabel("Modify Shape");
      setConfirmButtonDisabled(false);
      stopDraw();
    }
  };

  const handleNameEdit = async () => {
    if (!aoiName) {
      setAlertType("danger");
      setAlertText("Name is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      dispatch(setLoader(true));
      setEditAOI(false);
      setAlertText(false);
      dispatch(
        edit_aoi(aoiList[0].id, {
          name: aoiName,
          geometry: aoiList[0].geometry,
          hexagons: aoiList[0].hexagons,
          rawScore: aoiList[0].rawScore,
          scaleScore: aoiList[0].scaleScore,
          speciesName: aoiList[0].speciesName,
          id: aoiList[0].id,
        })
      );
      dispatch(setLoader(false));
    }
  };

  const handleSubmit = async () => {
    dispatch(setLoader(true));
    if (!aoiName) {
      setAlertType("danger");
      setAlertText("A name for this area of interest is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else if (featureList.length === 0) {
      setAlertType("danger");
      setAlertText("At least one polygon is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      if (aoiList.length < 10) {
        setAlertText(false);
        const newList = JSON.parse(JSON.stringify(featureList));
        const planArea = calculateArea(newList);
        const data = {
          type: "MultiPolygon",
          coordinates: newList.map((feature) => feature.geometry.coordinates),
        };

        // For development on local server
        // const res = await axios.post('http://localhost:5000/data', { data });
        // For production on Heroku
        if (planArea < 5500) {
          const res = await axios.post(
            "https://sca-cpt-backend.herokuapp.com/data",
            { data }
          );
          // const planArea = calculateArea(newList);
          dispatch(
            edit_aoi(aoiList[0].id, {
              name: aoiName,
              geometry:
                newList && newList.length ? newList : aoiList[0].geometry,
              hexagons:
                newList && newList.length ? res.data.data : aoiList[0].hexagons,
              rawScore:
                newList && newList.length
                  ? aggregate(res.data.data, planArea)
                  : aoiList[0].rawScore,
              scaleScore: newList.length
                ? getStatus(aggregate(res.data.data, planArea))
                : aoiList[0].scaleScore,
              speciesName: newList.length
                ? res.data.speciesName
                : aoiList[0].speciesName,
              id: aoiList[0].id,
            })
          );
          setDrawingMode(false);

          dispatch(setLoader(false));
        } else {
          setLargeAoiProgress(6);
          const boundingBox = bbox({
            type: "Feature",
            geometry: data,
          });
          const bboxSquare = square(boundingBox); //array of verticies of the square ["minLong","minLat","maxLong","maxLat"]
          const bboxSquareSide = distance(
            [bboxSquare[1], bboxSquare[0]],
            [bboxSquare[1], bboxSquare[2]]
          );
          let cellSide = 40;
          if (bboxSquareSide > 1500) {
            cellSide = bboxSquareSide / 40;
          } else if (bboxSquareSide > 1000) {
            cellSide = bboxSquareSide / 30;
          } else if (bboxSquareSide > 500) {
            cellSide = bboxSquareSide / 20;
          } else if (bboxSquareSide > 250) {
            cellSide = bboxSquareSide / 10;
          } else if (bboxSquareSide > 150) {
            cellSide = bboxSquareSide / 7;
          } else {
            cellSide = bboxSquareSide / 5;
          }

          const bufferedBox = bbox(
            buffer(
              {
                type: "Feature",
                geometry: data,
              },
              cellSide,
              { units: "kilometers" }
            )
          );

          console.log("Size of each box side: " + cellSide);
          const options = { units: "kilometers" };
          const grid = squareGrid(bufferedBox, cellSide, options);

          const postData = async (data) => {
            const res = await axios.post(
              "https://sca-cpt-backend.herokuapp.com/data",
              { data }
            );
            setLargeAoiProgress((oldProgress) => {
              const newProgress = oldProgress + 100 / maxProgress;
              return newProgress;
            });
            console.log(res);
            return res;
          };

          // Turf intersect returns null if no overlapping detected
          const overlapping = grid.features.filter((square) => {
            const aoiInSquare = intersect(data, square);
            if (aoiInSquare) {
              return true;
            } else {
              return false;
            }
          });
          const overlapArray = overlapping.map((square) => {
            return intersect(data, square).geometry;
          });
          console.log("Number of requests: " + overlapArray.length);
          maxProgress = overlapArray.length;

          const getAllAoiInfo = async (arrayOfAOIs) => {
            const requests = arrayOfAOIs.map((aoi) => {
              return postData(aoi).then((a) => {
                return a;
              });
            });
            return Promise.all(requests);
          };

          getAllAoiInfo(overlapArray).then((lotsOfObjects) => {
            console.log("lotsOfObjects");
            console.log(lotsOfObjects);
            let speciesNames = [];
            let allData = [];

            lotsOfObjects.forEach(
              (obj) =>
                (speciesNames = [
                  ...speciesNames.concat(
                    obj.data.speciesName.filter(
                      (name) => !speciesNames.includes(name)
                    )
                  ),
                ])
            );

            //WITH POTENTIAL DUPLICATE VALUES TO SHOW GRID

            // lotsOfObjects.forEach(
            //   (obj) => (allData = [...allData.concat(obj.data.data)])
            // );

            //WITHOUT DUPLICATE VALUES

            lotsOfObjects.forEach(
              (obj) =>
                (allData = [
                  ...allData.concat(
                    obj.data.data.filter(
                      (gridData) =>
                        !allData.find(
                          (allDataHex) => allDataHex.gid === gridData.gid
                        )
                    )
                  ),
                ])
            );

            console.log("All The Data with no Dups");
            console.log(allData);

            dispatch(
              edit_aoi(aoiList[0].id, {
                name: aoiName,
                geometry:
                  newList && newList.length ? newList : aoiList[0].geometry,
                hexagons:
                  newList && newList.length ? allData : aoiList[0].hexagons,
                rawScore:
                  newList && newList.length
                    ? aggregate(allData, planArea)
                    : aoiList[0].rawScore,
                scaleScore: newList.length
                  ? getStatus(aggregate(allData, planArea))
                  : aoiList[0].scaleScore,
                speciesName: newList.length
                  ? allData.speciesName
                  : aoiList[0].speciesName,
                id: aoiList[0].id,
              })
            );

            setDrawingMode(false);

            dispatch(setLoader(false));
          });
        }
      } else {
        setAlertType("danger");
        setAlertText(
          "The max limit of 10 AOIs was reached. Remove AOIs and try again."
        );
        window.setTimeout(() => setAlertText(false), 4000);
      }
    }
  };

  const handleAdvancedEdit = async () => {
    if (!aoiName) {
      setAlertType("danger");
      setAlertText("Name is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      dispatch(setLoader(true));
      setEditAOI(false);
      setAlertText(false);
      // Use the unselected hexagons as new geometry to recalculate AOI
      const filteredHexList = aoiList[0].hexagons.filter(
        (hexagon) => !hexIDDeselected.includes(hexagon.objectid)
      );
      console.log(filteredHexList);

      const planArea = aoiList[0].rawScore.hab0;
      dispatch(
        edit_aoi(aoiList[0].id, {
          name: aoiName,
          geometry: aoiList[0].geometry,
          hexagons: filteredHexList.length
            ? filteredHexList
            : aoiList[0].hexagons,
          rawScore: filteredHexList.length
            ? aggregate(filteredHexList, planArea)
            : aoiList[0].rawScore,
          scaleScore: filteredHexList.length
            ? getStatus(aggregate(filteredHexList, planArea))
            : aoiList[0].scaleScore,
          speciesName: aoiList[0].speciesName,
          id: aoiList[0].id,
        })
      );
      dispatch(setLoader(false));
    }
  };

  const showHexagon = () => {
    setDrawingMode(false);
    if (showButtonState === "show") {
      setHexGrid(true);
      setShowButtonState("hide");
      setShowButtonLabel("Hide Hexagon Grid");
      setDeselectButtonDisabled(false);
      setModifyButtonDisabled(true);
      setHexIDDeselected([]);
      setHexFilterList([]);
    } else {
      setHexGrid(false);
      setShowButtonState("show");
      setShowButtonLabel("Show Hexagon Grid");
      setDeselectButtonDisabled(true);
    }
  };

  const deselectHexagon = () => {
    setDrawingMode(false);
    if (deselectButtonState === "deselect") {
      setHexDeselection(true);
      setDeselectButtonState("finalize");
      setDeselectButtonLabel("Finalize Hexagon");
      setShowButtonDisabled(true);
      setConfirmButtonDisabled(true);
      setHexIDDeselected([]);
      setHexFilterList([]);
    } else {
      setHexDeselection(false);
      setDeselectButtonState("deselect");
      setDeselectButtonLabel("Deselect Hexagon");
      setShowButtonDisabled(false);
      setConfirmButtonDisabled(false);
    }
  };

  const exitEdit = () => {
    setEditAOI(false);
    setModifyButtonDisabled(false);
    setShowButtonDisabled(false);
    setConfirmButtonDisabled(true);
    // Turn off map editing and reset buttons after cancellation
    stopDraw();
    setDrawingMode(false);
    setModifyButtonState("modify");
    setModifyButtonLabel("Modify Shape");
    // Turn off hex grid layer and reset buttons after cancellation
    setHexGrid(false);
    setShowButtonState("show");
    setShowButtonLabel("Show Hexagon Grid");
    setDeselectButtonDisabled(true);
  };

  const confirmEdit = () => {
    if (featureList.length) {
      handleSubmit();
    } else if (hexIDDeselected.length) {
      handleAdvancedEdit();
    } else if (aoiName) {
      handleNameEdit();
    }
    setModifyButtonDisabled(false);
    setShowButtonDisabled(false);
    setConfirmButtonDisabled(true);
    // Turn off hex grid layer and reset buttons after submission
    setHexGrid(false);
    setShowButtonState("show");
    setShowButtonLabel("Show Hexagon Grid");
    setDeselectButtonDisabled(true);
  };

  const saveFile = async () => {
    try {
      // For development on local server
      // const res = await axios.post(
      //   "http://localhost:5000/save/shapefile",
      //   {
      //     file_name: aoiList[0].name,
      //     geometry: aoiList[0].geometry,
      //     username: userLoggedIn
      //   }
      // );

      // For production on Heroku
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/save/shapefile",
        {
          file_name: aoiList[0].name,
          geometry: aoiList[0].geometry,
          username: userLoggedIn,
        }
      );
      if (res) {
        setAlertType("success");
        setAlertText("You have saved " + aoiList[0].name + " in your account.");
        window.setTimeout(() => setAlertText(false), 4000);
      }
    } catch (e) {
      setAlertType("danger");
      setAlertText("Failed to save the file in your account!");
      window.setTimeout(() => setAlertText(false), 4000);
      console.error(e);
    }
  };

  const showPlan = () => {
    setShowTableContainer(!showTableContainer);
  };

  const accordionReset = () => {
    exitEdit();
    setEditAOI(true);
  };

  const confirmClose = () => setConfirmShow(false);
  const showConfirm = () => setConfirmShow(true);

  return (
    <>
      {aoiList && aoiList.length > 0 && (
        <Card id="sidebar-view-detial">
          <Card.Header>Area of Interest Details:</Card.Header>
          <Card.Body>
            <Card.Title>{aoiList[0].name}</Card.Title>
            <ul>
              <li>
                This area of interest has an area of{" "}
                {Math.round(aoiList[0].rawScore.hab0 * 100) / 100} km
                <sup>2</sup>
              </li>
              <li>
                This area of interest contains {aoiList[0].hexagons.length}{" "}
                hexagons
              </li>
            </ul>
            <Container className="detail-buttons mb-2">
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  setEditAOI(true);
                  setAoiName(aoiList[0].name);
                }}
              >
                <MdEdit /> &nbsp; Edit
              </Button>
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  setActiveTable(aoiSelected);
                }}
              >
                <MdViewList /> &nbsp; Summary
              </Button>
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  history.push("/report");
                  setReportLink(true);
                }}
              >
                <HiDocumentReport /> &nbsp; Report
              </Button>
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  let aoiGeoJson = {
                    type: "FeatureCollection",
                    features: aoiList[0].geometry,
                  };
                  let options = {
                    folder: "Spatial Footprint",
                    types: {
                      polygon: aoiList[0].name,
                    },
                  };
                  download(aoiGeoJson, options);
                }}
              >
                <FaFileExport /> &nbsp; Export Shapefile
              </Button>

              {useCase !== "inventory" && (
                <Button variant="dark" className="ml-1" onClick={showPlan}>
                  <IoFileTrayFull /> &nbsp; Related Conservation Plans
                </Button>
              )}
              {userLoggedIn && (
                <Button variant="dark" className="ml-1" onClick={saveFile}>
                  <MdSave /> &nbsp; Save to: {userLoggedIn}
                </Button>
              )}
              <Button variant="danger" className="ml-1" onClick={showConfirm}>
                <MdDelete /> &nbsp; Delete
              </Button>
            </Container>

            {useCase === "inventory" && (
              <Container
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Button variant="secondary" onClick={showPlan}>
                  <IoFileTrayFull /> &nbsp;{" "}
                  {showTableContainer ? "Hide" : "View"} Related Plans
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowTableContainer(false);
                    history.push("/tool");
                    setView("selectUseCase");
                  }}
                >
                  More Methods to View Plans
                </Button>
              </Container>
            )}
            {editAOI && (
              <>
                <Accordion>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      onClick={accordionReset}
                    >
                      <div className="accordion-dropdown">
                        <p>Basic Edit Options</p>
                        <p>{downArrow}</p>
                      </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <p className="edit-instructions">
                          To change name edit below and click save changes.
                          <br />
                          To edit the AOI polygon:
                        </p>
                        <ul>
                          <li>Click the modify shape button.</li>
                          <li>Click inside the polygon to view vertices.</li>
                          <li>To move entire AOI, click and drag polygon</li>
                          <li>Click and drag to move individual verticies.</li>
                          <li>Click the finalize shape button.</li>
                          <li>Click save changes.</li>
                        </ul>
                        <div className="basic-edit-cont">
                          <InputGroup className="mb-3" style={{ width: "70%" }}>
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">
                                New AOI Name:
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              name="planName"
                              value={aoiName}
                              onChange={(e) => {
                                setAoiName(e.target.value);
                                setConfirmButtonDisabled(false);
                              }}
                              placeholder="Re-name area of interest here..."
                            />
                          </InputGroup>
                          <Button
                            variant="dark"
                            style={{ height: "40px" }}
                            value={modifyButtonState}
                            onClick={modifyShape}
                            disabled={modifyButtonDisabled}
                          >
                            {modifyButtonLabel}
                          </Button>
                        </div>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="1"
                      onClick={accordionReset}
                    >
                      <div className="accordion-dropdown">
                        <p>Advanced Edit Options</p>
                        <p>{downArrow}</p>
                      </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        <p className="edit-instructions">
                          To remove hexagons from your AOI:
                        </p>
                        <ul>
                          <li>Click the show hexagon grid button.</li>
                          <li>Click deselect hexagon.</li>
                          <li>
                            Click the hexagons you'd like to remove from your
                            AOI.<sup>*</sup>
                          </li>
                          <li>Click the finalize hexagon.</li>
                          <li>Click save changes.</li>
                        </ul>
                        <p className="smaller-text">
                          *After clicking, the hexagons selected for removal
                          will only highlight once the cursor has been moved.
                        </p>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="dark"
                            value={showButtonState}
                            onClick={showHexagon}
                            disabled={showButtonDisabled}
                          >
                            {showButtonLabel}
                          </Button>
                          <Button
                            variant="dark"
                            value={deselectButtonState}
                            onClick={deselectHexagon}
                            disabled={deselectButtonDisabled}
                          >
                            {deselectButtonLabel}
                          </Button>
                        </div>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <div className="d-flex justify-content-between">
                  <Button variant="warning" onClick={exitEdit}>
                    Cancel
                  </Button>
                  <Button
                    variant={confirmButtonDisabled ? "secondary" : "success"}
                    onClick={confirmEdit}
                    disabled={confirmButtonDisabled}
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      )}
      {aoiList && aoiList.length > 0 && (
        <Modal show={confirmShow} onHide={confirmClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1>WAIT{alertIcon}</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>This will permanently delete the {aoiList[0].name} AOI.</p>
            <p>Are you sure you'd like to continue?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={confirmClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                let toDelete = aoiList[0].id;
                setActiveTable(false);
                dispatch(delete_aoi(toDelete));
                setConfirmShow(false);
              }}
            >
              Yes, remove this AOI
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default SidebarViewDetail;
