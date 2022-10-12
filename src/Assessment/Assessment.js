import React, { useState, useEffect } from "react";
import { Button, Container, Dropdown, Row } from "react-bootstrap";
import MapGL, { Source, Layer, WebMercatorViewport } from "react-map-gl";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import MultiSwitch from "react-multi-switch-toggle";
import { FaChrome } from "react-icons/fa";
import { MdDownload, MdSave } from "react-icons/md";
import { VscFolder, VscFileSubmodule } from "react-icons/vsc";
import { FiMap, FiLayers } from "react-icons/fi";
import { download } from "shp-write";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import bbox from "@turf/bbox";
import axios from "axios";
import AssessmentTable from "./AssessmentTable";
import AssessmentScoreTable from "./AssessmentScoreTable";
import UserDefinedResult from "./UserDefinedResult";
import MCDAResult from "./MCDAResult";
import MCDAReport from "./MCDAReport";
import PDFDownloader from "./PDFDownloader";
import Appendix from "./Appendix";
import Legend from "../Components/Legend";
import ReactTooltip from "react-tooltip";
import { GoInfo } from "react-icons/go";
import { setLoader, setUseCase } from "../Redux/action";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Assessment = ({
  aoiAssembled,
  setAoiSelected,
  setReportLink,
  customizedMeasures,
  userLoggedIn,
  setAlertText,
  setAlertType,
  setView,
  setAssessStep,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectBasemap, setSelectBasemap] = useState(false);
  const [selectOverlay, setSelectOverlay] = useState(false);
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [overlayList, setOverlayList] = useState([]);
  const [selectedSwitch, setSelectedSwitch] = useState(0);
  const overlaySources = {
    secas: "mapbox://chuck0520.dkcwxuvl",
  };

  const history = useHistory();
  const assessment = useSelector((state) => state.assessment);
  const aoi = useSelector((state) => state.aoi);
  const user = useSelector((state) => state.user);
  const useCase = useSelector((state) => state.usecase.useCase);
  let aoiAssembly = [];

  const dispatch = useDispatch();
  dispatch(setLoader(false));

  // Up to 10 colors for 10 different AOIs
  const aoiColors = [
    "#00188f",
    "#00bcf2",
    "#00b294",
    "#009e49",
    "#bad80a",
    "#fff100",
    "#ff8c00",
    "#e81123",
    "#ec008c",
    "#68217a",
  ];

  // Get the list of IDs of assembled AOIs
  const aoiAssembledList = aoiAssembled.map((aoi) => aoi.value);

  // Constant aoi contains all the AOIs provided so those not assembled need to be filtered out
  const aoiList = Object.values(aoi).filter((aoi) =>
    aoiAssembledList.includes(aoi.id)
  );

  // AOIs are stored as [0:{}, 1:{}, 2:{}, ...]
  for (let num in aoiList) {
    aoiAssembly = aoiAssembly.concat(aoiList[num].geometry);
  }

  // Use the set of all selected AOIs to calculate the bounding box
  let aoiBbox = bbox({
    type: "FeatureCollection",
    features: aoiAssembly,
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
  }).fitBounds(viewportBbox, { padding: 200 });
  // console.log(newViewport);

  // Adjust the zoom level according to the extent of the AOIs
  const [viewport, setViewport] = useState({
    latitude: newViewport.latitude,
    longitude: newViewport.longitude,
    zoom: newViewport.zoom,
  });

  // Calculate the final scores with user-customized measures
  const aoiScoreCustomized = assessment.aoiScore.map((planScore, index) => {
    const planScoreList = [];
    const weightList = {
      low: 0.33,
      medium: 0.67,
      high: 1,
    };

    // hab
    if (customizedMeasures.hab.length > 0) {
      let planScoreValue = 0;
      for (let i = 0; i < customizedMeasures.hab.length; i++) {
        if (customizedMeasures.hab[i].utility === "1") {
          planScoreValue =
            planScoreValue +
            customizedMeasures.hab[i].data[index] *
              weightList[customizedMeasures.hab[i].weight];
        } else {
          planScoreValue =
            planScoreValue +
            1 -
            customizedMeasures.hab[i].data[index] *
              weightList[customizedMeasures.hab[i].weight];
        }
      }
      planScoreList[0] = planScore[0] + planScoreValue;
    } else {
      planScoreList[0] = planScore[0];
    }

    // wq
    if (customizedMeasures.wq.length > 0) {
      let planScoreValue = 0;
      for (let j = 0; j < customizedMeasures.wq.length; j++) {
        if (customizedMeasures.wq[j].utility === "1") {
          planScoreValue =
            planScoreValue +
            customizedMeasures.wq[j].data[index] *
              weightList[customizedMeasures.wq[j].weight];
        } else {
          planScoreValue =
            planScoreValue +
            1 -
            customizedMeasures.wq[j].data[index] *
              weightList[customizedMeasures.wq[j].weight];
        }
      }
      planScoreList[1] = planScore[1] + planScoreValue;
    } else {
      planScoreList[1] = planScore[1];
    }

    // lcmr
    if (customizedMeasures.lcmr.length > 0) {
      let planScoreValue = 0;
      for (let k = 0; k < customizedMeasures.lcmr.length; k++) {
        if (customizedMeasures.lcmr[k].utility === "1") {
          planScoreValue =
            planScoreValue +
            customizedMeasures.lcmr[k].data[index] *
              weightList[customizedMeasures.lcmr[k].weight];
        } else {
          planScoreValue =
            planScoreValue +
            1 -
            customizedMeasures.lcmr[k].data[index] *
              weightList[customizedMeasures.lcmr[k].weight];
        }
      }
      planScoreList[2] = planScore[2] + planScoreValue;
    } else {
      planScoreList[2] = planScore[2];
    }

    // cl
    if (customizedMeasures.cl.length > 0) {
      let planScoreValue = 0;
      for (let l = 0; l < customizedMeasures.cl.length; l++) {
        if (customizedMeasures.cl[l].utility === "1") {
          planScoreValue =
            planScoreValue +
            customizedMeasures.cl[l].data[index] *
              weightList[customizedMeasures.cl[l].weight];
        } else {
          planScoreValue =
            planScoreValue +
            1 -
            customizedMeasures.cl[l].data[index] *
              weightList[customizedMeasures.cl[l].weight];
        }
      }
      planScoreList[3] = planScore[3] + planScoreValue;
    } else {
      planScoreList[3] = planScore[3];
    }

    // eco
    if (customizedMeasures.eco.length > 0) {
      let planScoreValue = 0;
      for (let m = 0; m < customizedMeasures.eco.length; m++) {
        if (customizedMeasures.eco[m].utility === "1") {
          planScoreValue =
            planScoreValue +
            customizedMeasures.eco[m].data[index] *
              weightList[customizedMeasures.eco[m].weight];
        } else {
          planScoreValue =
            planScoreValue +
            1 -
            customizedMeasures.eco[m].data[index] *
              weightList[customizedMeasures.eco[m].weight];
        }
      }
      planScoreList[4] = planScore[4] + planScoreValue;
    } else {
      planScoreList[4] = planScore[4];
    }

    return planScoreList;
  });

  const onToggle = (value) => {
    setSelectedSwitch(value);
    if (value === 0) {
      setBasemapStyle("light-v10");
    } else if (value === 1) {
      setBasemapStyle("dark-v10");
    } else if (value === 2) {
      setBasemapStyle("satellite-v9");
    } else if (value === 3) {
      setBasemapStyle("outdoors-v11");
    }
  };

  // Download HTML report

  // Download from backend
  // const downloadHTML = async () =>{
  // For development on local server
  // 	const result = await axios.get('http://localhost:5000/report');
  // For production on Heroku
  // 	const result = await axios.get('https://sca-cpt-backend.herokuapp.com/report');
  // 	const url = window.URL.createObjectURL(new Blob([result.data]));
  // 	console.log(url);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'file.html');
  //     document.body.appendChild(link);
  //     link.click();
  // }

  // Download from frontend
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const downloadHTML = async () => {
    // Delay 2 seconds for the charts to render before downloading
    await delay(2000);
    let pageHTMLObject = document.getElementsByClassName("container")[0];
    let pageHTML =
      "<html><head>" +
      '<meta charset="utf-8">' +
      '<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">' +
      '<link href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet">' +
      '<script src="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js"></script>' +
      '<link rel="stylesheet" href="https://raw.githubusercontent.com/scatools/SCA_Tool_Suite/main/src/App.css"/>' +
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" ' +
      'integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" ' +
      'crossorigin="anonymous"/>' +
      "</head><body>" +
      pageHTMLObject.outerHTML +
      '</body><script type="module">' +
      'mapboxgl.accessToken = "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";' +
      'const map = new mapboxgl.Map({container: "map",' +
      'style: "mapbox://styles/mapbox/light-v9",' +
      "center: [" +
      newViewport.longitude +
      "," +
      newViewport.latitude +
      "]," +
      "zoom: " +
      newViewport.zoom +
      "});" +
      aoiList
        .map((aoi, index) => {
          return (
            'map.on("load", () => {' +
            'map.addSource("aoi' +
            index +
            '", {"type": "geojson", "data": {"type": "FeatureCollection", "features": [' +
            aoi.geometry.map((feature) => {
              return JSON.stringify(feature);
            }) +
            "]}});" +
            'map.addLayer({"id": "aoi' +
            index +
            '", "type": "fill", "source": "aoi' +
            index +
            '", "layout": {},' +
            '"paint": {"fill-color":"' +
            aoiColors[index] +
            '", "fill-opacity": 0.5}});' +
            "});"
          );
        })
        .join("") +
      "</script></html>";

    let tempElement = document.createElement("a");
    tempElement.href =
      "data:text/html;charset=UTF-8," + encodeURIComponent(pageHTML);
    tempElement.target = "_blank";
    tempElement.download = "assessment.html";
    tempElement.click();
  };

  const downloadFootprintAsSingle = () => {
    let aoiGeoJson = { type: "FeatureCollection", features: aoiAssembly };
    let options = {
      folder: "Spatial Footprint",
      types: {
        polygon: "Combined Assessment Area",
      },
    };
    download(aoiGeoJson, options);
  };

  const downloadFootprintAsMultiple = () => {
    aoiList.forEach((aoi, index) => {
      let aoiGeoJson = { type: "FeatureCollection", features: aoi.geometry };
      let options = {
        folder: "Spatial Footprint " + (index + 1).toString,
        types: {
          polygon: aoi.name,
        },
      };
      download(aoiGeoJson, options);
    });
  };

  const saveAssessment = async () => {
    try {
      // Delay 2 seconds for the charts to render before saving
      await delay(2000);
      let today = new Date().toISOString().slice(0, 10);
      let reportName =
        "Assessment Report for " +
        aoiList[0].name +
        " and " +
        String(aoiList.length - 1) +
        " Other AOIs" +
        " (" +
        today +
        ")";
      let pageHTMLObject = document.getElementsByClassName("container")[0];
      let pageHTML =
        "<html><head>" +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">' +
        '<link href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet">' +
        '<script src="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js"></script>' +
        '<link rel="stylesheet" href="https://raw.githubusercontent.com/scatools/SCA_Tool_Suite/main/src/App.css"/>' +
        '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" ' +
        'integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" ' +
        'crossorigin="anonymous"/>' +
        "</head><body>" +
        pageHTMLObject.outerHTML +
        '</body><script type="module">' +
        'mapboxgl.accessToken = "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";' +
        'const map = new mapboxgl.Map({container: "map",' +
        'style: "mapbox://styles/mapbox/light-v9",' +
        "center: [" +
        newViewport.longitude +
        "," +
        newViewport.latitude +
        "]," +
        "zoom: " +
        newViewport.zoom +
        "});" +
        aoiList
          .map((aoi, index) => {
            return (
              'map.on("load", () => {' +
              'map.addSource("aoi' +
              index +
              '", {"type": "geojson", "data": {"type": "FeatureCollection", "features": [' +
              aoi.geometry.map((feature) => {
                return JSON.stringify(feature);
              }) +
              "]}});" +
              'map.addLayer({"id": "aoi' +
              index +
              '", "type": "fill", "source": "aoi' +
              index +
              '", "layout": {},' +
              '"paint": {"fill-color":"' +
              aoiColors[index] +
              '", "fill-opacity": 0.5}});' +
              "});"
            );
          })
          .join("") +
        "</script></html>";

      // For development on local server
      // const res = await axios.post(
      //   "http://localhost:5000/save/report",
      //   {
      //     report_name: reportName,
      //     script: pageHTML,
      //     username: userLoggedIn
      //   }
      // );

      // For production on Heroku
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/save/report",
        {
          report_name: reportName,
          script: pageHTML,
          username: user.username,
        }
      );
      if (res) {
        setAlertType("success");
        setAlertText("You have saved " + reportName + " in your account.");
        window.setTimeout(() => setAlertText(false), 4000);
      }
    } catch (e) {
      setAlertType("danger");
      setAlertText("Failed to save the report in your account!");
      window.setTimeout(() => setAlertText(false), 4000);
      console.error(e);
    }
  };
  console.log(useCase);
  useEffect(() => {
    if (!assessment.hasOwnProperty("aoi")) {
      return <Redirect to="/" />;
    } else if (downloading) {
      downloadHTML().then(() => {
        setDownloading(false);
      });
    }
  }, [downloading]);

  useEffect(() => {
    if (!assessment.hasOwnProperty("aoi")) {
      return <Redirect to="/" />;
    } else if (saving) {
      saveAssessment().then(() => {
        setSaving(false);
      });
    }
  }, [saving]);

  // if (!assessment.hasOwnProperty("aoi")) {
  //   return <Redirect to="/" />;
  // };

  return (
    <>
      <div className="assessmentNav">
        <a href="#mapHeading">Spatial Footprint</a>
        <a href="#scoreHeading">Overall Scores</a>
        <a href="#dataHeading">Data Summary</a>
        <a href="#mcdaHeading">MCDA Results</a>
        <a href="#appendix">Appendix</a>
      </div>

      <div className="back-to-map">
        <Button
          variant="secondary"
          onClick={() => {
            history.push("/tool");
          }}
        >
          Back to Map View
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(setUseCase("visualization"));
            setView("assess");
            setAssessStep("selectAOI");
            history.push("/tool");
          }}
        >
          AOI Heatmap Visualization
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(setUseCase("inventory"));
            setView("list");
            history.push("/tool");
          }}
        >
          Find Related Conservation Plans
        </Button>
      </div>

      <div className="buttonContainer">
        <div className="assessmentDownload">
          <Dropdown>
            <Dropdown.Toggle className="downloadButton" variant="dark">
              <MdDownload /> Assessment Report
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item
                variant="dark"
                onClick={() => {
                  setDownloading(true);
                }}
              >
                <FaChrome /> &nbsp; Download as HTML
              </Dropdown.Item>
              <PDFDownloader
                downloadFileName="Assessment"
                rootElementId="assessmentOverview"
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="footprintDownload">
          <Dropdown>
            <Dropdown.Toggle className="downloadButton" variant="dark">
              <MdDownload /> Spatial Footprint
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item variant="dark" onClick={downloadFootprintAsSingle}>
                <VscFolder /> &nbsp; Download as Single Shapefile
              </Dropdown.Item>
              <Dropdown.Item
                variant="dark"
                onClick={downloadFootprintAsMultiple}
              >
                <VscFileSubmodule /> &nbsp; Download as Multiple Shapefiles
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="tableDownload">
          <Dropdown>
            <Dropdown.Toggle className="downloadButton" variant="dark">
              <MdDownload /> Data Table
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item variant="dark">
                <ReactHTMLTableToExcel
                  id="tableDownloadButton"
                  className="downloadButton"
                  table="assessmentScoreTable"
                  filename="Goal Scores Table"
                  sheet="Assessment"
                  buttonText="Goal Scores Table"
                />
              </Dropdown.Item>
              <Dropdown.Item variant="dark">
                <ReactHTMLTableToExcel
                  id="tableDownloadButton"
                  className="downloadButton"
                  table="assessmentTable"
                  filename="Measure Scores Table"
                  sheet="Assessment"
                  buttonText="Measure Scores Table"
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {userLoggedIn && (
          <div className="assessmentSave">
            <Button
              className="downloadButton"
              variant="dark"
              onClick={() => {
                setSaving(true);
              }}
            >
              <MdSave /> Save to:{" "}
              {userLoggedIn.length > 9 ? (
                <span style={{ fontSize: "10px" }}>{userLoggedIn}</span>
              ) : (
                userLoggedIn
              )}
            </Button>
          </div>
        )}
      </div>

      <div id="assessmentOverview">
        <Container>
          <Row>
            <h1 className="assessment-h1">
              Assessment Report for:
              <br /> {aoiList[0].name} and {String(aoiList.length - 1)} Other
              AOIs
            </h1>
          </Row>
          <Row id="mapHeading">
            <h2>Spatial Footprint:</h2>
          </Row>
          <br />
          <Row id="map">
            <Button
              className="reportBasemapButton"
              variant="secondary"
              title="Base Map"
              style={{ top: "250px" }}
              onClick={() => setSelectBasemap(!selectBasemap)}
            >
              <FiMap />
            </Button>
            <Button
              className="reportOverlayButton"
              variant="secondary"
              title="Overlay Layers"
              style={{ top: "290px" }}
              onClick={() => setSelectOverlay(!selectOverlay)}
            >
              <FiLayers />
            </Button>
            {selectBasemap && (
              <div className="reportBasemapSwitch" style={{ top: "247px" }}>
                <MultiSwitch
                  texts={["Light", "Dark", "Satellite", "Terrain", ""]}
                  selectedSwitch={selectedSwitch}
                  bgColor={"gray"}
                  onToggleCallback={onToggle}
                  height={"38px"}
                  fontSize={"15px"}
                  fontColor={"white"}
                  selectedFontColor={"#6e599f"}
                  selectedSwitchColor={"white"}
                  borderWidth={0}
                  eachSwitchWidth={80}
                />
              </div>
            )}
            {selectOverlay && (
              <div className="reportOverlaySelect" style={{ top: "290px" }}>
                <div>
                  <input
                    type="checkbox"
                    value="secas"
                    checked={overlayList.includes("secas")}
                    onChange={() => {
                      if (overlayList.includes("secas")) {
                        setOverlayList((list) =>
                          list.filter((element) => element !== "secas")
                        );
                      } else {
                        setOverlayList((list) => [...list, "secas"]);
                      }
                    }}
                  />
                  <span>&nbsp; Southeast Blueprint</span>
                </div>
              </div>
            )}
            <MapGL
              {...viewport}
              style={{ position: "relative" }}
              width="100%"
              height="100%"
              mapStyle={"mapbox://styles/mapbox/" + basemapStyle}
              onViewportChange={(nextViewport) => setViewport(nextViewport)}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            >
              {overlayList.map((overlay) => (
                <Source
                  type="raster"
                  url={overlaySources[overlay]}
                  maxzoom={22}
                  minzoom={0}
                >
                  <Layer
                    type="raster"
                    id={overlay}
                    value={overlay}
                    paint={{ "raster-opacity": 0.5 }}
                  />
                </Source>
              ))}
              {aoiList.length > 0 &&
                aoiList.map((aoi, index) => (
                  <Source
                    type="geojson"
                    data={{
                      type: "FeatureCollection",
                      features: aoi.geometry,
                    }}
                  >
                    <Layer
                      id={aoi.name}
                      type="fill"
                      paint={{
                        "fill-color": aoiColors[index],
                        "fill-opacity": 0.5,
                      }}
                    />
                  </Source>
                ))}
              {aoiList.length > 0 && (
                <Legend aoiList={aoiList} aoiColors={aoiColors}></Legend>
              )}
            </MapGL>
          </Row>
          <hr />
          <Row id="scoreHeading">
            <h2>Overall Scores with User-Provided Weights</h2>
            <GoInfo data-tip data-for="score-explain" />
            <ReactTooltip
              id="score-explain"
              delayHide={500}
              delayUpdate={500}
              clickable="true"
              type="dark"
              place="right"
            >
              <span>
                Overall score is how well an AOI meets the goals and priorities
                for land conservation that the user has defined. The “Overall
                Score” is only relevant for AOIs with current weights and
                measures. This score is not meant to evaluate AOIs across
                different weights. For evaluation across all weights see the
                MCDA Results below.
              </span>
            </ReactTooltip>
          </Row>
          <br />
          <Row id="score">
            <div>
              <UserDefinedResult aoiScoreCustomized={aoiScoreCustomized} />
            </div>
            <p>
              Overall score is how well an AOI meets the goals and priorities
              for land conservation that the user has defined. The “Overall
              Score” is only relevant for AOIs with current weights and
              measures. This score is not meant to evaluate AOIs across
              different weights. For evaluation across all weights see the MCDA
              Results below.
            </p>
          </Row>
          <hr />
          <Row id="dataHeading">
            <h2>Data Summary:</h2>
          </Row>
          <br />
          <Row id="data">
            <h4>Values & Weights by RESTORE Council Goal:</h4>
            <p>
              The following table indicates the weighted scores of all RESTORE
              goals for each each area of interest (AOI) achieved, along with
              user-provided weights for different goals displayed in the
              rightmost column.
            </p>
            <AssessmentScoreTable aoiScoreCustomized={aoiScoreCustomized} />
            <h4>Values & Weights by Data Measure:</h4>
            <p>
              The following table indicates the weighted scores of all data
              measures for each area of interest (AOI) achieved, along with
              user-provided weights for different priority attributes displayed
              in the rightmost column.
            </p>
            <AssessmentTable
              setAoiSelected={setAoiSelected}
              setReportLink={setReportLink}
              customizedMeasures={customizedMeasures}
            />
          </Row>
          <hr />
          <Row id="mcdaHeading">
            <h2>SMAA MCDA Results:</h2>
          </Row>
          <br />
          <Row id="mcda">
            <p>
              <b>Stochastic Multicriteria Acceptability Analysis (SMAA) </b>
              is a collection of
              <b> Multi-Criteria Decision Analysis (MCDA) </b>
              methods that considers user preference as a weight space to rank
              the proposed projects from most preferred to least preferred. The
              SMAA algorithms produce an index called
              <b> Rank Acceptability (RA) </b>, which helps the user to
              understand the problem in conjunction with the preference. This RA
              index describes the combination of user preferences resulting in a
              certain rank for a project. The following charts indicate the RA
              results for each area of interest (AOI).
            </p>
            <div>{downloading || saving ? <MCDAReport /> : <MCDAResult />}</div>
          </Row>
          <hr />
          <Row id="appendix">
            <Appendix />
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Assessment;
