import React, { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  changeGoalWeights,
  changeMeasures,
  setCurrentWeight,
} from "../../../Redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "../../../Components/MultiSelect";
import { getWeightsThunk } from "../../../Redux/thunk";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const SelectAOIForAssess = ({
  setAssessStep,
  aoiAssembled,
  setAoiAssembled,
  setVisualizationSource,
  setVisualizationLayer,
  setVisualizaitonHighlight,
  setView,
  setAlertText,
  setAlertType,
}) => {
  const dispatch = useDispatch();
  const aoi = useSelector((state) => state.aoi);
  const aoiList = Object.values(aoi).map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const useCase = useSelector((state) => state.usecase.useCase);

  const changeToArray = (obj) => {
    if (typeof obj === "object" && !Array.isArray(obj) && obj !== null) {
      console.log("CHANGE FROM OBJECT TO ARRAY");
      setAoiAssembled([obj]);
    }
  };

  console.log(aoiAssembled);

  // useEffect(() => {
  //   setAoiAssembled([]);
  // }, []);

  const handleNext = () => {
    if (
      aoiAssembled &&
      aoiAssembled.length >= 11 &&
      useCase === "prioritization"
    ) {
      setAlertType("danger");
      setAlertText("Max number of AOIs is 10. Remove AOI(s) to continue");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      if (useCase === "visualization") {
        if (aoiAssembled) {
          console.log(aoi);
          const aoiVisualized = Object.values(aoi).filter(
            (item) => item.id === aoiAssembled[0].value
          );
          console.log(aoiVisualized);

          const hexFeatureList = aoiVisualized[0].hexagons.map((hex) => {
            // Parse all the properties for measure scores to numbers
            let hexProperties = hex;
            Object.keys(hexProperties).map(function (key, index) {
              if (key !== "geometry") {
                hexProperties[key] = parseFloat(hexProperties[key]);
              }
            });
            return {
              type: "Feature",
              geometry: JSON.parse(hex.geometry),
              properties: hexProperties,
            };
          });
          const hexData = {
            type: "FeatureCollection",
            features: hexFeatureList,
          };
          setVisualizationSource({
            type: "geojson",
            data: hexData,
          });
          setVisualizationLayer({
            id: "visualization-layer",
            type: "fill",
          });
          setAssessStep("selectRestoreWeights");
        } else {
          setAlertType("danger");
          setAlertText("Add at least 1 AOI for visualization");
          window.setTimeout(() => setAlertText(false), 4000);
        }
      } else {
        // aoiAssembled is an array for multiple selects
        if (aoiAssembled && aoiAssembled.length > 1) {
          // console.log("RESETTING GOAL WEIGHTS");
          // const measures = {
          //   hab: {
          //     selected: null,
          //     weight: 0,
          //   },
          //   wq: {
          //     selected: null,
          //     weight: 0,
          //   },
          //   lcmr: {
          //     selected: null,
          //     weight: 0,
          //   },
          //   cl: {
          //     selected: null,
          //     weight: 0,
          //   },
          //   eco: {
          //     selected: null,
          //     weight: 0,
          //   },
          // };

          // let keys = Object.keys(measures);
          // keys.map((value, index) => {
          //   const newValue =
          //     Number(measures[value].weight) > 100
          //       ? 100
          //       : Number(measures[value].weight);
          //   console.log(measures[value].selected);
          //   dispatch(changeGoalWeights(newValue, value));
          //   dispatch(changeMeasures(value, measures[value].selected));
          // });
          // dispatch(setCurrentWeight("No Saved Measures"));
          setAssessStep("selectRestoreWeights");
        } else {
          setAlertType("danger");
          setAlertText("Add at least 2 AOIs for comparison");
          window.setTimeout(() => setAlertText(false), 4000);
        }
        // aoiAssembled is an array for multiple selects
      }
    }
  };

  return (
    <Container>
      {useCase === "visualization" ? (
        <h3>Select one area of interest to visualize </h3>
      ) : (
        <h3>Select two or more areas of interest</h3>
      )}
      <br />
      {useCase === "visualization" ? (
        <Select
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
          options={aoiList}
          isMulti={false}
          isClearable={true}
          placeholder="Select ab area of interest..."
          value={aoiAssembled}
          onChange={(selectedOption) => {
            if (selectedOption) {
              changeToArray(selectedOption);
              // setAoiAssembled(selectedOption);
            } else {
              setAoiAssembled([]);
            }
          }}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      ) : (
        <MultiSelect
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
          options={aoiList}
          isMulti
          isClearable={true}
          placeholder="Select areas of interests..."
          value={aoiAssembled}
          onChange={(selectedOption) => {
            if (selectedOption) {
              setAoiAssembled(selectedOption);
            } else {
              setAoiAssembled([]);
            }
          }}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      )}
      <br />
      <Container className="add-assess-cont">
        <Button variant="secondary" onClick={() => setView("list")}>
          {arrowIcon} Review/Edit AOIs
        </Button>
        {useCase === "visualization" ? (
          aoiAssembled && aoiAssembled.length === 1 ? (
            <Button variant="primary" onClick={() => handleNext()}>
              Next
            </Button>
          ) : (
            <Button variant="secondary" disabled onClick={() => handleNext()}>
              Next
            </Button>
          )
        ) : aoiAssembled && aoiAssembled.length > 1 ? (
          <Button variant="primary" onClick={() => handleNext()}>
            Next
          </Button>
        ) : (
          <Button variant="secondary" disabled onClick={() => handleNext()}>
            Next
          </Button>
        )}
      </Container>
    </Container>
  );
};

export default SelectAOIForAssess;
