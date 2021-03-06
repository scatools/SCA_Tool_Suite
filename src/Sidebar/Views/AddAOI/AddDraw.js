import React, { useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
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
  setHucBoundary,
  setView,
  setAlertText,
  setAlertType,
}) => {
  const aoiList = Object.values(useSelector((state) => state.aoi))  
  const dispatch = useDispatch();
  const [drawData, setDrawData] = useState("");

  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };
  const handleSubmit = async () => {
    dispatch(setLoader(true));
    const myTimeoutError = setTimeout(() => timeoutHandler(), 28000);
    if (!drawData) {
      setAlertType("danger");
      setAlertText("A name for this area of interest is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else if (featureList.length === 0) {
      setAlertType("danger");
      setAlertText("At least one polygon is required.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      if(aoiList.length < 10){
        setAlertText(false);
        const newList = featureList;
        const planArea = calculateArea(newList);
        console.log(planArea);
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
          clearTimeout(myTimeoutError);

        } else {
          clearTimeout(myTimeoutError);
          setAlertType("danger");
          setAlertText("Your AOI is too large. Reduce the size and try again.");
          window.setTimeout(() => setAlertText(false), 4000);
        }
      }
      else{
        clearTimeout(myTimeoutError);
        setAlertType("danger");
        setAlertText("The max limit of 10 AOIs was reached. Remove AOIs and try again.");
        window.setTimeout(() => setAlertText(false), 4000);
      }
      
    }

    dispatch(setLoader(false));
  };
  setHucBoundary(false);
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
