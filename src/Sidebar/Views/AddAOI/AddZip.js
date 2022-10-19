import React, { useCallback } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { v4 as uuid } from "uuid";
import { kml } from "@tmcw/togeojson";
import shp from "shpjs";
import axios from "axios";
import { truncate } from "@turf/turf";
import { setLoader, input_aoi } from "../../../Redux/action";
import { calculateArea, aggregate, getStatus } from "../../../Helper/aggregateHex";
import TimeoutError from "../../../Components/TimeoutError";

const AddZip = ({
  timeoutError,
  timeoutHandler,
  setHucBoundary,
  setDrawingMode,
  setView,
  setAlertText,
  setAlertType,
}) => {
  const dispatch = useDispatch();
  const aoiList = Object.values(useSelector((state) => state.aoi));

  const handleSubmitFile = async (
    geometry,
    geometryType,
    aoiNumber,
    aoiName
  ) => {
    setAlertText(false);
    // Coordinates must be a single array for the area to be correctly calculated
    const newList = geometry.coordinates.map((coordinates) => ({
      type: "Feature",
      properties: {},
      geometry: {
        type: geometryType,
        coordinates: [coordinates],
      },
    }));
    const data = geometry;

    // For development on local server
    // const res = await axios.post('http://localhost:5000/data', { data });
    // For production on Heroku

    const res = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/data",
      { data }
    );
    console.log(res.status);
    const planArea = calculateArea(newList);
    dispatch(
      input_aoi({
        name: aoiName ? aoiName : "Area of Interest " + aoiNumber,
        geometry: newList,
        hexagons: res.data.data,
        rawScore: aggregate(res.data.data, planArea),
        scaleScore: getStatus(aggregate(res.data.data, planArea)),
        speciesName: res.data.speciesName,
        id: uuid(),
      })
    );

    // clearTimeout(loadTimer);
    setView("list");
    dispatch(setLoader(false));
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      for (let file of acceptedFiles) {
        const fileType = file.name.slice(-3);
        if (fileType === "kml" || "zip") {
          const reader = new FileReader();
          reader.onload = async () => {
            const myTimeoutError = setTimeout(() => timeoutHandler(), 20000);
            let result = null;
            if (fileType === "kml") {
              try {
                let result3D = kml(new DOMParser().parseFromString(reader.result,"text/xml"));
                result = truncate(result3D, {precision: 14, coordinates: 2});
                console.log(result);
              } catch(e) {
                clearTimeout(myTimeoutError);
                setAlertType("danger");
                setAlertText("The KML file uploaded is misconfigured!");
                window.setTimeout(() => setAlertText(false), 4000);
                dispatch(setLoader(false));
                return;
              };
            }
            else if (fileType === "zip") {
              result = await shp(reader.result).catch((e) => {
                clearTimeout(myTimeoutError);
                setAlertType("danger");
                setAlertText("The ZIP file uploaded is misconfigured!");
                window.setTimeout(() => setAlertText(false), 4000);
                dispatch(setLoader(false));
                return;
              });
              console.log(result);
            };

            if (result) {
              // Features are stored as [0:{}, 1:{}, 2:{}, ...]
              let index = 0;
              for (var num in result.features) {
                if (aoiList.length + index < 10) {
                  index += 1;
                  var featureGeometry = result.features[num].geometry;
                  var featureGeometryType = result.features[num].geometry.type;
                  var featureNumber = parseInt(num) + 1;
                  var featureName = null;
                  // Check if each feature has a name-like property
                  for (var property in result.features[num].properties) {
                    if (
                      property.indexOf("name") !== -1 ||
                      property.indexOf("Name") !== -1 ||
                      property.indexOf("NAME") !== -1
                    ) {
                      featureName = result.features[num].properties[property];
                    }
                  }
                  // Add geometry type as a parameter to cater to both Polygon and MultiPolygon
                  handleSubmitFile(
                    featureGeometry,
                    featureGeometryType,
                    featureNumber,
                    featureName
                  );
                } else {
                  clearTimeout(myTimeoutError);
                  setAlertType("danger");
                  setAlertText(
                    "The max limit of 10 AOIs was reached. Remove AOIs and try again."
                  );
                  window.setTimeout(() => setAlertText(false), 4000);
                  dispatch(setLoader(false));
                  return;
                };
              };
            };
          };

          if (fileType === "kml") {
            reader.readAsText(file);
          }
          else if (fileType === "zip") {
            reader.readAsArrayBuffer(file);
          };
        }
        else {
          setAlertType("danger");
          setAlertText("Unsupported file type. Only KML or ZIP files will be accepted!");
          window.setTimeout(() => setAlertText(false), 4000);
          dispatch(setLoader(false));
          return;
        };
      };
      dispatch(setLoader(true));
      // let loadTimer = setTimeout(() => timeoutHandler(), 20);
    },[dispatch]
  );
  
  setHucBoundary(false);
  setDrawingMode(false);

  return (
    <div>
      {timeoutError && <TimeoutError />}

      <Container className="instruction">
        <p>
          You can upload a zipped shapefile or KML file with one or more areas of interest.
          Each record in the file will become a separate area of interest. Please make sure
          the geometry of your area of interest is either Polygon or MultiPolygon.{" "}
        </p>
        <p>
          If uploading a zip file, please make sure it includes at least the following files:
          <ul>
            <li>.shp</li>
            <li>.shx</li>
            <li>.prj</li>
          </ul>
        </p>
      </Container>
      <Container className="m-auto file-drop">
        <Dropzone onDrop={onDrop} accept={[".zip", ".kml"]}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              Click me to upload a file!
            </div>
          )}
        </Dropzone>
      </Container>
    </div>
  );
};

export default AddZip;
