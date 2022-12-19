import React, { useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";

import {
  squareGrid,
  intersect,
  distance,
  square,
  bbox,
  buffer,
} from "@turf/turf";

import axios from "axios";
import {
  calculateArea,
  aggregate,
  getStatus,
} from "../../../Helper/aggregateHex";
import { v4 as uuid } from "uuid";
import { setLoader, input_aoi } from "../../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import TimeoutError from "../../../Components/TimeoutError";

const AddDraw = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setReportLink,
  autoDraw,
  timeoutError,
  timeoutHandler,
  setView,
  setAlertText,
  setAlertType,
  setLargeAoiProgress,
  stopDraw,
}) => {
  const aoiList = Object.values(useSelector((state) => state.aoi));
  const dispatch = useDispatch();
  const [drawData, setDrawData] = useState("");
  let maxProgress = 0;

  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };
  const handleSubmit = async () => {
    // const myTimeoutError = setTimeout(() => timeoutHandler(), 28000);
    if (!drawData) {
      setAlertType("danger");
      setAlertText("A name for this area of interest is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else if (featureList.length === 0) {
      setAlertType("danger");
      setAlertText("At least one polygon is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      if (aoiList.length < 10) {
        stopDraw();
        dispatch(setLoader(true));
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
            input_aoi({
              name: drawData,
              geometry: newList,
              hexagons: res.data.data,
              rawScore: aggregate(res.data.data, planArea),
              scaleScore: getStatus(aggregate(res.data.data, planArea)),
              speciesName: res.data.speciesName,
              id: uuid(),
            })
          );
          setDrawingMode(false);
          setView("list");
        } else {
          setLargeAoiProgress(6);
          // clearTimeout(myTimeoutError);
          // setAlertType("danger");
          // setAlertText("Your AOI is too large. Reduce the size and try again.");
          // window.setTimeout(() => setAlertText(false), 4000);
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
            // clearTimeout(myTimeoutError);
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
              input_aoi({
                name: drawData,
                geometry: newList,
                hexagons: allData,
                rawScore: aggregate(allData, planArea),
                scaleScore: getStatus(aggregate(allData, planArea)),
                speciesName: speciesNames,
                id: uuid(),
              })
            );

            setDrawingMode(false);
            setView("list");
          });

          // Promise.allSettled(overlapArray.map((data) => postData(data))).then(
          //   (results) => {
          //     results.forEach((result) => {
          //       console.log(result.status);
          //     });
          //   }
          // );
        }
      } else {
        // clearTimeout(myTimeoutError);
        setAlertType("danger");
        setAlertText(
          "The max limit of 10 AOIs was reached. Remove AOIs and try again."
        );
        window.setTimeout(() => setAlertText(false), 4000);
      }
    }
  };

  return (
    <Container className="mt-3">
      {timeoutError && <TimeoutError />}
      <Container className="instruction">
        <p>Give your AOI a unique name.</p>
        <p>Click on the map to start drawing. </p>
        <p>Click again for each corner of your drawing.</p>
        <p>Click 1st point again to stop drawing. </p>
        <p className="note">
          Note: you can draw multiple shapes here. To do so, click "New Shape"
          each time. These will all become part of the same area of interest.
        </p>
      </Container>
      <InputGroup className="m-auto" style={{ width: "80%" }}>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">AOI Name:</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          name="planName"
          value={drawData}
          onChange={handleNameChange}
          placeholder="Name area of interest here..."
        />
      </InputGroup>
      <hr />
      <Container>
        <Button
          variant="warning"
          style={{ float: "left" }}
          onClick={() => {
            setDrawingMode(true);
            autoDraw();
            setAoiSelected(false);
            setReportLink(false);
          }}
        >
          Draw a New Shape
        </Button>

        {drawData && featureList.length !== 0 ? (
          <Button
            variant="primary"
            style={{ float: "right" }}
            onClick={handleSubmit}
          >
            Review AOI
          </Button>
        ) : (
          <Button
            variant="secondary"
            style={{ float: "right" }}
            onClick={handleSubmit}
          >
            Review AOI
          </Button>
        )}
      </Container>
      <hr />
    </Container>
  );
};

export default AddDraw;
