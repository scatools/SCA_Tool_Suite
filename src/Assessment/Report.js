import React, { useState } from "react";
import { Button, Container, Dropdown, Row } from "react-bootstrap";
import MapGL, { Source, Layer, WebMercatorViewport } from "react-map-gl";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import MultiSwitch from "react-multi-switch-toggle";
import { FaChrome } from "react-icons/fa";
import { MdDownload, MdSave } from "react-icons/md";
import { FiMap, FiLayers } from "react-icons/fi";
import { download } from "shp-write";
import bbox from "@turf/bbox";
import axios from "axios";
import ReportTable from "./ReportTable";
import PDFDownloader from "./PDFDownloader";
import Appendix from "./Appendix";
import Legend from "../Components/Legend";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Report = ({ aoiSelected, userLoggedIn, setAlertText, setAlertType }) => {
  const [selectBasemap, setSelectBasemap] = useState(false);
  const [selectOverlay, setSelectOverlay] = useState(false);
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [overlayList, setOverlayList] = useState([]);
  const [selectedSwitch, setSelectedSwitch] = useState(0);
  const overlaySources = {
    "secas": "mapbox://chuck0520.dkcwxuvl"
  };

  const history = useHistory();

  // Constant aoi contains all the AOIs provided so those not selected need to be filtered out
  const aoi = useSelector((state) => state.aoi);
  const aoiList = Object.values(aoi).filter((aoi) => aoiSelected === aoi.id);
  const aoiColors = ["#00188f"];

  // Use the selected AOI to calculate the bounding box
  var aoiBbox = bbox({
    type: "FeatureCollection",
    features: aoiList[0].geometry,
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
  }).fitBounds(viewportBbox, { padding: 200 });
  // console.log(newViewport);

  const [viewport, setViewport] = useState({
    latitude: newViewport.latitude,
    longitude: newViewport.longitude,
    zoom: newViewport.zoom,
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
  const downloadHTML = () => {
    var pageHTMLObject = document.getElementsByClassName("container")[0];
    var pageHTML =
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
      'map.on("load", () => {' +
      'map.addSource("aoi", {"type": "geojson", "data": {"type": "FeatureCollection", "features": [' +
      aoiList[0].geometry.map((feature) => {
        return JSON.stringify(feature);
      }) +
      "]}});" +
      'map.addLayer({"id": "aoi", "type": "fill", "source": "aoi", "layout": {},' +
      '"paint": {"fill-color":"' +
      aoiColors[0] +
      '", "fill-opacity": 0.5}});' +
      "});" +
      "</script></html>";
    var tempElement = document.createElement("a");

    tempElement.href =
      "data:text/html;charset=UTF-8," + encodeURIComponent(pageHTML);
    tempElement.target = "_blank";
    tempElement.download = "report.html";
    tempElement.click();
  };

  const downloadFootprint = () => {
    var aoiGeoJson = {
      type: "FeatureCollection",
      features: aoiList[0].geometry,
    };
    var options = {
      folder: "Spatial Footprint",
      types: {
        polygon: aoiList[0].name,
      },
    };
    download(aoiGeoJson, options);
  };

  const saveReport = async () => {
    try {
      var today = new Date().toISOString().slice(0, 10);
      var reportName =
        "Detailed Report for " + aoiList[0].name + " (" + today + ")";
      var pageHTMLObject = document.getElementsByClassName("container")[0];
      var pageHTML =
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
        'map.on("load", () => {' +
        'map.addSource("aoi", {"type": "geojson", "data": {"type": "FeatureCollection", "features": [' +
        aoiList[0].geometry.map((feature) => {
          return JSON.stringify(feature);
        }) +
        "]}});" +
        'map.addLayer({"id": "aoi", "type": "fill", "source": "aoi", "layout": {},' +
        '"paint": {"fill-color":"' +
        aoiColors[0] +
        '", "fill-opacity": 0.5}});' +
        "});" +
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
          username: userLoggedIn,
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

  if (!aoiSelected) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <div className="reportNav">
        <a href="#map">Spatial Footprint</a>
        <a href="#checklist">Conservation Checklist</a>
        <a href="#summary">Overall Summary</a>
        <a href="#appendix">Appendix</a>
      </div>

      <div className="back-to-map">
        <Button variant="secondary" onClick={() => history.push("/tool")}>
          Back to Map View
        </Button>
      </div>

      <div className="buttonContainer">
        <div className="reportDownload">
          <Dropdown>
            <Dropdown.Toggle
              className="downloadButton"
              variant="dark"
            >
              <MdDownload /> Detailed Report
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item variant="dark" onClick={downloadHTML}>
                <FaChrome /> &nbsp; Download as HTML
              </Dropdown.Item>
              <PDFDownloader
                downloadFileName="Report"
                rootElementId="reportOverview"
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="footprintDownload">
          <Button
            className="downloadButton"
            variant="dark"
            onClick={downloadFootprint}
          >
            <MdDownload /> Spatial Footprint
          </Button>
        </div>
        
        {userLoggedIn && (
          <div className="reportSave">
            <Button
              className="downloadButton"
              variant="dark"
              onClick={saveReport}
            >
              <MdSave /> Save to:
              {userLoggedIn.length > 9 ? (
                <span style={{ fontSize: "10px" }}>{userLoggedIn}</span>
              ) : (
                userLoggedIn
              )}
            </Button>
          </div>
        )}
      </div>

      <div id="reportOverview">
        <Container>
          <Row>
            <h1 className="report-h1">Detailed Report for {aoiList[0].name}</h1>
          </Row>
          <Row id="mapHeading">
            <h2>Spatial Footprint:</h2>
          </Row>
          <Row id="map">
            <Button
              className="reportBasemapButton"
              variant="secondary"
              title="Base Map"
              onClick={() => setSelectBasemap(!selectBasemap)}
            >
              <FiMap />
            </Button>
            <Button
              className="reportOverlayButton"
              variant="secondary"
              title="Overlay Layers"
              onClick={() => setSelectOverlay(!selectOverlay)}
            >
              <FiLayers />
            </Button>
            {selectBasemap && (
              <div className="reportBasemapSwitch">
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
              <div className="reportOverlaySelect">
                <div>
                  <input
                    type="checkbox"
                    value="secas"
                    checked={overlayList.includes("secas")}
                    onChange={() => {
                      if (overlayList.includes("secas")) {
                        setOverlayList(list => list.filter(element => element !== "secas"));
                      } else {
                        setOverlayList(list => [...list, "secas"]);
                      };
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
                    paint={{"raster-opacity": 0.5}}
                  />
                </Source>
              ))}
              {aoiList.length > 0 &&
                aoiList.map((aoi) => (
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
                        "fill-color": aoiColors[aoiList.indexOf(aoi)],
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
          <Row id="checklist">
            <h2>Conservation Checklist:</h2>
            <ReportTable aoiSelected={aoiSelected} />
          </Row>
          <hr />
          <Row id="summary">
            <h2>Overall Summary:</h2>
            <p>
              This report evaluates the area of <b>{aoiList[0].name}</b>, with
              approximately <b>{aoiList[0].scaleScore.hab0}</b> of land. &nbsp;
              {aoiList[0].scaleScore.hab1 === "Yes"
                ? aoiList[0].name +
                  " is within 1 km of currently protected land, according to the PAD-US layer."
                : aoiList[0].name +
                  " is not within 1 km of currently protected land, according to the PAD-US layer."}{" "}
              &nbsp;
              {aoiList[0].scaleScore.hab2 === "0%"
                ? aoiList[0].name +
                  " does not have any land classified as a hub or corridor by the EPA National Ecological Framework (NEF)."
                : [
                    aoiList[0].name +
                      " also supports structural connectivity, as ",
                    <b>{aoiList[0].scaleScore.hab2}</b>,
                    " percent of the area is classified as a hub or corridor by the EPA National Ecological Framework (NEF).",
                  ]}{" "}
              &nbsp;
              {/* Need to double check */}
              {aoiList[0].scaleScore.hab3 === "Insufficient Data"
                ? "There is insufficient data to determine the future threat of development for " +
                  aoiList[0].name +
                  "."
                : aoiList[0].scaleScore.hab3 === "No Threat"
                ? aoiList[0].name + " has no threat of urbanization."
                : [
                    aoiList[0].name + " is expected to have a ",
                    <b>{aoiList[0].scaleScore.hab3}</b>,
                    " threat of development by the year 2060, according to the SLEUTH urbanization model.",
                  ]}{" "}
              &nbsp;
              {/* Missing Information */}
              {aoiList[0].scaleScore.hab4 === "0%"
                ? aoiList[0].name +
                  " is not known to house any habitat deemed high priority."
                : [
                    aoiList[0].name +
                      " houses habitats deemed high priority, occupying roughly ",
                    <b>{aoiList[0].scaleScore.hab4}</b>,
                    " of the total area.",
                  ]}
            </p>
            <p>
              {/* Missing Information */}
              {aoiList[0].scaleScore.wq1 === "0%"
                ? "There is no stream or river recognized within " +
                  aoiList[0].name +
                  "."
                : [
                    // aoiList[0].name +
                    //   " also buffers water flowing into the" +
                    //   ",report_table_1$Impaired_Name," +
                    //   ", a waterbody with known impairments, and preservation would allow this landscape to continue to provide such water quality protections. " +
                    "Approximately ",
                    <b>{aoiList[0].scaleScore.wq1}</b>,
                    " of the waterways within " +
                      aoiList[0].name +
                      " are designated as impaired according to the EPA's 303(d) list.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.wq2 === "Insufficient Data"
                ? "There is insufficient data to determine the hydrologic response of " +
                  aoiList[0].name +
                  " to land-use change."
                : [
                    "Land-use change in " +
                      aoiList[0].name +
                      " has resulted in a ",
                    <b>{aoiList[0].scaleScore.wq2}</b>,
                    " hydrologic response to a standard rainfall event for this region.",
                  ]}
              {/* Missing Information*/}
              {/* Missing Information*/}
              {/* Missing Information*/}
              {/* Missing Information*/}
            </p>
            <p>
              The landscape of {aoiList[0].name} has a{" "}
              <b>{aoiList[0].scaleScore.lcmr1}</b> value for vulnerable areas of
              terrestrial endemic species, in accordance with the methods used
              by Jenkins et. al, 2015. &nbsp;
              {/* Confusing Information*/}
              {aoiList[0].scaleScore.lcmr2 === "0%"
                ? "Lands within " +
                  aoiList[0].name +
                  " are not known to support critical habitats for any federally listed species."
                : [
                    "Lands within " + aoiList[0].name + " support roughly ",
                    <b>{aoiList[0].scaleScore.lcmr2}</b>,
                    " of the critical habitat ranges for federally listed species.",
                  ]}{" "}
              &nbsp;
              {/* Confusing & Missing Information*/}
              {aoiList[0].scaleScore.lcmr3 === 0
                ? "Lands within " +
                  aoiList[0].name +
                  " are not known to support habitat ranges for any federally listed species."
                : [
                    "Lands within " +
                      aoiList[0].name +
                      " support habitat ranges for ",
                    <b>{aoiList[0].speciesName.length}</b>,
                    " federally listed species, including the ",
                    <em>{aoiList[0].speciesName.join(", ")}</em>,
                    "*.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.lcmr4 === "No"
                ? "There is no light pollution in " + aoiList[0].name + "."
                : [
                    aoiList[0].name + " has a ",
                    <b>{aoiList[0].scaleScore.lcmr4}</b>,
                    " level of light pollution.",
                  ]}
              {/* Missing Information*/}
              {/* Missing Information*/}
            </p>
            <p>
              {aoiList[0].scaleScore.cl1 === "No"
                ? "No places listed under the National Register of Historic Places are known to exist within or around " +
                  aoiList[0].name +
                  "."
                : [
                    "The National Register of Historic Places indicates that there are historic places within or around " +
                      aoiList[0].name +
                      ".",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.cl2 === "0%"
                ? aoiList[0].name +
                  " is not within a designated National Heritage Area."
                : [
                    "About ",
                    <b>{aoiList[0].scaleScore.cl1}</b>,
                    " of " +
                      aoiList[0].name +
                      " is within a designated National Heritage Area.",
                  ]}{" "}
              &nbsp;
              {[
                "According to NOAA's Office for Coastal Management, " +
                  aoiList[0].name +
                  " is considered to locate ",
                <b>{aoiList[0].scaleScore.cl3}</b>,
                " from socially vulnerable communities.",
              ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.cl4 === "Insufficient Data"
                ? "There is insufficient data to determine the community threat level of " +
                  aoiList[0].name +
                  "."
                : [
                    aoiList[0].name + " has a ",
                    <b>{aoiList[0].scaleScore.cl4}</b>,
                    " threat from coastal flooding and severe storm hazards.",
                  ]}
            </p>
            <p>
              {/* Missing Information*/}
              {aoiList[0].scaleScore.eco1 === "0%"
                ? "No working lands are known to exist within " +
                  aoiList[0].name +
                  "."
                : [
                    "Conserving this area of interest would also provide protection to working lands, ",
                    // "with [Names of WL],",
                    "comprising about ",
                    <b>{aoiList[0].scaleScore.eco1}</b>,
                    " of the landscape.",
                  ]}{" "}
              &nbsp;
              {aoiList[0].scaleScore.eco2 === "Yes"
                ? "The communities in and around " +
                  aoiList[0].name +
                  " has commercial fishing reliance."
                : "The communities in and around " +
                  aoiList[0].name +
                  " has no commercial fishing reliance."}{" "}
              &nbsp;
              {aoiList[0].scaleScore.eco3 === "Yes"
                ? "The communities in and around " +
                  aoiList[0].name +
                  " has recreational fishing engagement."
                : "The communities in and around " +
                  aoiList[0].name +
                  " has no recreational fishing engagement."}{" "}
              &nbsp;
              {aoiList[0].scaleScore.eco4 === 0 ||
              aoiList[0].scaleScore.eco4 === 1
                ? [
                    "There is ",
                    <b>{aoiList[0].scaleScore.eco4}</b>,
                    " access point to natural areas within 25 km of " +
                      aoiList[0].name +
                      ".",
                  ]
                : [
                    "There are ",
                    <b>{aoiList[0].scaleScore.eco4}</b>,
                    " access points to natural areas within 25 km of " +
                      aoiList[0].name +
                      ".",
                  ]}
            </p>
          </Row>
          <hr />
          <Row id="appendix">
            <Appendix />
          </Row>
          <Row>
            <h4>Disclaimer:</h4>
            <p>
              * Data for federally listed species are provided by USFWS. It may
              contain species found in state-level investigations. For the most
              accurate result, please refer to the
              <a
                href="https://ipac.ecosphere.fws.gov/"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Information for Planning and Consultation (IPaC) Tool
              </a>
              .
            </p>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Report;
