import React, { useEffect, useState } from "react";
import { Button, Container, Col, Form, Row } from "react-bootstrap";
import {
  changeGoalWeights,
  changeMeasures,
  setCurrentWeight,
} from "../../../Redux/action";
import Select from "react-select";
import { useDispatch, useSelector, useStore } from "react-redux";
import RangeSlider from "react-bootstrap-range-slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { data } from "jquery";
import { useLocation } from "react-router-dom";
const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const SelectRestoreWeights = ({
  setAssessStep,
  visualizationScale,
  setAlertText,
  setAlertType,
}) => {
  const weights = useSelector((state) => state.weights);
  const [list, setList] = useState([
    { value: "No Saved Measures", label: "No Saved Measures" },
  ]);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const currentWeight = useSelector((state) => state.currentWeight);
  const dispatch = useDispatch();

  const lst = useSelector((state) => state.multipleWeights);
  useEffect(() => {
    let data = [];
    lst.names.map((val, index) => {
      data.push({ value: val.title, label: val.title });
    });
    setList(data);
  }, [lst]);

  const location = useLocation();

  let sumWeights =
    weights.hab.weight +
    weights.wq.weight +
    weights.lcmr.weight +
    weights.cl.weight +
    weights.eco.weight;

  const handleNext = () => {
    if (sumWeights !== 100) {
      setAlertType("danger");
      setAlertText("Make sure all weights add to exactly 100");
      window.setTimeout(() => setAlertText(false), 4000);
    } else setAssessStep("selectDataMeasures");
  };

  const handleWeights = (value, goal) => {
    const newValue = Number(value) > 100 ? 100 : Number(value);
    dispatch(changeGoalWeights(newValue, goal));
  };

  const loadSave = (dataSave) => {
    const default_setting = {
      hab: {
        selected: null,
        weight: 0,
      },
      wq: {
        selected: null,
        weight: 0,
      },
      lcmr: {
        selected: null,
        weight: 0,
      },
      cl: {
        selected: null,
        weight: 0,
      },
      eco: {
        selected: null,
        weight: 0,
      },
    };
    let measures;
    let direct = "selectRestoreWeights";
    if (dataSave === "No Saved Measures") {
      measures = default_setting;
      let keys = Object.keys(measures);
      keys.map((value, index) => {
        const newValue =
          Number(measures[value].weight) > 100
            ? 100
            : Number(measures[value].weight);
        dispatch(changeGoalWeights(newValue, value));
        dispatch(changeMeasures(value, measures[value].selected));
      });
    } else {
      measures = lst.names;
      direct = "reviewAssessSettings";
      const list_ele = () => {
        for (let i = 0; i < measures.length; i++) {
          if (measures[i].title === dataSave) {
            return measures[i];
          }
        }
      };
      let measures_selected = list_ele();
      let keys = Object.keys(measures_selected.weight);
      keys.map((value, index) => {
        const newValue =
          Number(measures_selected.weight[value].weight) > 100
            ? 100
            : Number(measures_selected.weight[value].weight);
        dispatch(changeGoalWeights(newValue, value));
        dispatch(
          changeMeasures(value, measures_selected.weight[value].selected)
        );
      });
    }

    dispatch(setCurrentWeight(dataSave));
    setAssessStep(direct);
  };

  return (
    <Container className="test">
      <h3>RESTORE Council Goal Weights:</h3>
      <p className="smaller-text">
        Below are the 5 RESTORE Council Goals
        <br />
        Rank them by importance to your organization
        {loggedIn === true ? (
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={list}
            value={currentWeight}
            isClearable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(value) => {
              loadSave(value.value);
            }}
          />
        ) : (
          ""
        )}
        <span className="glow">Total must add up to 100</span>
        <span className="sum-text">
          Total:
          {sumWeights !== 100 ? (
            <span className="error-text">{sumWeights}</span>
          ) : (
            <span className="total-text">{sumWeights}</span>
          )}
        </span>
      </p>
      {/* 
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/introduction/definitions-acronyms-and-abbreviations"
        target="_blank"
        style={{float:"right"}}
      >
        <em>Learn More about RESTORE Council Goals</em>
      </a>
      <br /> */}
      <Form>
        <>
          <span>Habitat: {weights.hab.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.hab.weight}
                onChange={(e) => handleWeights(e.target.value, "hab")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.hab.weight}
                onChange={(e) => handleWeights(e.target.value, "hab")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Water Quality & Quantity: {weights.wq.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.wq.weight}
                onChange={(e) => handleWeights(e.target.value, "wq")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.wq.weight}
                onChange={(e) => handleWeights(e.target.value, "wq")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Living Coastal & Marine Resources: {weights.lcmr.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.lcmr.weight}
                onChange={(e) => handleWeights(e.target.value, "lcmr")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.lcmr.weight}
                onChange={(e) => handleWeights(e.target.value, "lcmr")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Community Resilience: {weights.cl.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.cl.weight}
                onChange={(e) => handleWeights(e.target.value, "cl")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.cl.weight}
                onChange={(e) => handleWeights(e.target.value, "cl")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Gulf Economy: {weights.eco.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.eco.weight}
                onChange={(e) => handleWeights(e.target.value, "eco")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.eco.weight}
                onChange={(e) => handleWeights(e.target.value, "eco")}
              />
            </Col> */}
          </Form.Group>
        </>
      </Form>

      <Container className="button-container">
        {location.pathname !== "/user/measures"
          ? visualizationScale !== "region" &&
            visualizationScale !== "state" && (
              <Button
                variant="secondary"
                onClick={() => setAssessStep("selectAOI")}
              >
                {arrowIcon}{" "}
                {visualizationScale === "aoi" ? "Select AOI" : "Select AOIs"}
              </Button>
            )
          : ""}

        <Button
          variant={sumWeights === 100 ? "primary" : "secondary"}
          onClick={() => handleNext()}
        >
          Next
        </Button>
      </Container>
    </Container>
  );
};

export default SelectRestoreWeights;
