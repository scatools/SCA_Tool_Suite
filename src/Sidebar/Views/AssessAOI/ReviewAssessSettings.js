import React, { useState, useEffect } from "react";
import { Button, Container, Table } from "react-bootstrap";
import {
  generate_assessment,
  setLoader,
  setCurrentWeight,
  changeGoalWeights,
  changeMeasures,
  mutipleSavedWeights,
  mutipleSavedWeightsUpdate,
  mutipleSavedWeightsDelete,
} from "../../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import { updateMeasuresThunk } from "../../../Redux/thunk";

import Select from "react-select";
import {
  calculateMeasures,
  getScaledForAssessment,
  mergeIntoArray,
} from "../../../Helper/aggregateHex";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { GoInfo } from "react-icons/go";
import ReactTooltip from "react-tooltip";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const RESTOREGoal = [
  "Habitat",
  "Water Quality & Quantity",
  "Living Coastal & Marine Resources",
  "Community Resilience",
  "Gulf Economy",
];

const ReviewAssessSettings = ({
  setAssessStep,
  aoiAssembled,
  customizedMeasures,
  setVisualizationFillColor,
  setVisualizationOpacity,
  setView,
  setAlertText,
  setAlertType,
  setInteractiveLayerIds,
}) => {
  const weights = useSelector((state) => state.weights);
  const currentWeight = useSelector((state) => state.currentWeight);
  const aoi = useSelector((state) => state.aoi);
  const useCase = useSelector((state) => state.usecase.useCase);
  const [confirmShow, setConfirmShow] = useState(false);
  const confirmClose = () => setConfirmShow(false);
  const showConfirm = () => setConfirmShow(true);
  const [buttonSlider, setSlider] = useState(false);
  const [list, setList] = useState([
    { value: "No Saved Measures", label: "No Saved Measures" },
  ]);
  const lst = useSelector((state) => state.multipleWeights);
  const loggedIn = useSelector((state) => state.user.loggedIn);

  useEffect(() => {
    let data = [];
    lst.names.map((val, index) => {
      data.push({ value: val.title, label: val.title });
    });
    setList(data);
  }, [lst]);
  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();
  const createVisualization = async () => {
    const weightList = {
      high: 1,
      medium: 0.67,
      low: 0.33,
    };

    const intermediate = Object.entries(weights)
      .filter((goal) => goal[1].weight !== 0)
      .map((goal) => [
        "*",
        goal[1].weight / 100,
        [
          "/",
          [
            "+",
            0,
            ...goal[1].selected.map((measure) => {
              if (measure.utility === "1") {
                return [
                  "*",
                  weightList[measure.weight],
                  ["number", ["get", measure.value]],
                ];
              } else {
                return [
                  "+",
                  1,
                  [
                    "*",
                    -1 * weightList[measure.weight],
                    ["number", ["get", measure.value]],
                  ],
                ];
              }
            }),
          ],
          goal[1].selected.length,
        ],
      ]);

    const fillColor = [
      "step",
      ["+", 0, ...intermediate],
      "#ffeda0",
      0.1,
      "#f8d685",
      0.2,
      "#f1bf6d",
      0.3,
      "#eaa757",
      0.4,
      "#e28e45",
      0.5,
      "#db7537",
      0.6,
      "#d2592e",
      0.7,
      "#c83a28",
      0.8,
      "#bd0026",
    ];

    await setVisualizationFillColor(fillColor);
    setVisualizationOpacity(50);
  };

  const createAssessment = () => {
    dispatch(setLoader(true));
    async function calculateNewData() {
      const newAoiData = aoiAssembled.map((item) =>
        getScaledForAssessment(
          aoi[item.value].rawScore,
          aoi[item.value].id,
          aoi[item.value].name
        )
      );

      const newAoi = mergeIntoArray(newAoiData);

      const scoreByGoal = calculateMeasures(newAoiData, weights);

      const goalList = {
        hab: "Habitat",
        wq: "Water Quality & Quantity",
        lcmr: "Living Coastal & Marine Resources",
        cl: "Community Resilience",
        eco: "Gulf Economy",
      };

      const goalWeights = Object.entries(weights).map((goal) => {
        return {
          goal: goalList[goal[0]],
          weights: goal[1].weight / 100,
        };
      });

      const defaultWeights = {
        hab: {
          selected: [
            {
              value: "hab0",
              label: "Project Area",
              utility: "1",
              weight: "medium",
            },
            {
              value: "hab1",
              label: "Connectivity to Existing Protected Area",
              utility: "1",
              weight: "medium",
            },
            {
              value: "hab2",
              label: "Connectivity of Natural Lands",
              utility: "1",
              weight: "medium",
            },
            {
              value: "hab3",
              label: "Threat of Urbanization",
              utility: "1",
              weight: "medium",
            },
            {
              value: "hab4",
              label: "Composition of Priority Natural Lands",
              utility: "1",
              weight: "medium",
            },
          ],
          weight: 20,
        },
        wq: {
          selected: [
            {
              value: "wq1",
              label: "303(d): Impaired Watershed Area",
              utility: "1",
              weight: "medium",
            },
            {
              value: "wq2",
              label: "Hydrologic Response to Land-Use Change",
              utility: "1",
              weight: "medium",
            },
            {
              value: "wq3",
              label: "Percent Irrigated Agriculture",
              utility: "1",
              weight: "medium",
            },
            {
              value: "wq4",
              label: "Lateral Connectivity of Floodplain",
              utility: "1",
              weight: "medium",
            },
            {
              value: "wq5",
              label: "Composition of Riparizan Zone Lands",
              utility: "1",
              weight: "medium",
            },
            {
              value: "wq6",
              label: "Presence of Impoundments",
              utility: "1",
              weight: "medium",
            },
          ],
          weight: 20,
        },
        lcmr: {
          selected: [
            {
              value: "lcmr1",
              label: "Vulnerable Areas of Terrestrial Endemic Species",
              utility: "1",
              weight: "medium",
            },
            {
              value: "lcmr2",
              label:
                "Threatened and Endangered Species - Critical Habitat Area",
              utility: "1",
              weight: "medium",
            },
            {
              value: "lcmr3",
              label: "Threatened and Endangered Species - Number of Species",
              utility: "1",
              weight: "medium",
            },
            {
              value: "lcmr4",
              label: "Light Pollution Index",
              utility: "1",
              weight: "medium",
            },
            {
              value: "lcmr5",
              label: "Terrestrial Vertebrate Biodiversity",
              utility: "1",
              weight: "medium",
            },
            {
              value: "lcmr6",
              label: "Vulnerability to Invasive Plants",
              utility: "1",
              weight: "medium",
            },
          ],
          weight: 20,
        },
        cl: {
          selected: [
            {
              value: "cl1",
              label: "National Register of Historic Places",
              utility: "1",
              weight: "medium",
            },
            {
              value: "cl2",
              label: "National Heritage Area",
              utility: "1",
              weight: "medium",
            },
            {
              value: "cl3",
              label: "Proximity to Socially Vulnerable Communities",
              utility: "1",
              weight: "medium",
            },
            {
              value: "cl4",
              label: "Community Threat Index",
              utility: "1",
              weight: "medium",
            },
            {
              value: "cl5",
              label: "Social Vulnerability Index",
              utility: "1",
              weight: "medium",
            },
          ],
          weight: 20,
        },
        eco: {
          selected: [
            {
              value: "eco1",
              label: "High Priority Working Lands",
              utility: "1",
              weight: "medium",
            },
            {
              value: "eco2",
              label: "Commercial Fishing Reliance",
              utility: "1",
              weight: "medium",
            },
            {
              value: "eco3",
              label: "Recreational Fishing Engagement",
              utility: "1",
              weight: "medium",
            },
            {
              value: "eco4",
              label: "Access & Recreation - Number of Access Points",
              utility: "1",
              weight: "medium",
            },
          ],
          weight: 20,
        },
      };

      const defaultScoreByGoal = calculateMeasures(newAoiData, defaultWeights);

      // For development on local server
      // const result = await axios.post('http://localhost:5000/mcda',{
      // 	mean: defaultScoreByGoal,
      // 	std: 0.1
      // });

      // For production on Heroku
      const result = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/mcda",
        {
          mean: defaultScoreByGoal,
          std: 0.1,
        }
      );

      const returnData = {
        aoi: newAoi,
        aoiScore: scoreByGoal,
        weights: goalWeights,
        rankAccept: result.data.rankAccept,
        centralWeight: result.data.centralWeight,
      };

      dispatch(generate_assessment(returnData));
    }

    calculateNewData().then(() => {
      history.push("/assessment");
    });
  };

  const saveMeasures = () => {
    let input = document.getElementById("save-modal").querySelector("input");
    let save_name = input.value;
    let lst_bool = list.some((val) => val.value === save_name);
    if (lst_bool) {
      setAlertType("danger");
      setAlertText("This save name already exists!");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      dispatch(mutipleSavedWeights({ title: save_name, weight: weights })).then(
        (result) => dispatch(updateMeasuresThunk)
      );
      dispatch(setCurrentWeight(save_name));
      confirmClose();
    }
  };

  const updateMeasures = () => {
    let input = document.getElementById("save-modal").querySelector("input");
    let save_name = input.value;
    let measures = lst.names;

    const list_ele = () => {
      for (let i = 0; i < measures.length; i++) {
        if (measures[i].title === currentWeight.value) {
          return i;
        }
      }
    };
    let measures_selected = list_ele();
    dispatch(
      mutipleSavedWeightsUpdate({
        info: { title: save_name, weight: weights },
        index: measures_selected,
      })
    ).then((result) => dispatch(updateMeasuresThunk));
    dispatch(setCurrentWeight(save_name));
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

  const deleteSave = () => {
    let measures = lst.names;
    const list_ele = () => {
      for (let i = 0; i < measures.length; i++) {
        if (measures[i].title === currentWeight.value) {
          return i;
        }
      }
    };
    let measures_selected = list_ele();
    dispatch(mutipleSavedWeightsDelete(measures_selected)).then((result) =>
      dispatch(updateMeasuresThunk)
    );
    loadSave(lst.names[0].title);
  };

  return (
    <>
      {loggedIn === true ? (
        <Select
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
          value={currentWeight}
          options={list}
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

      <Container
        id="assessment-card"
        style={{ paddingBottom: "1.25rem", marginTop: "1.25rem" }}
        className="test card-body"
      >
        Goal Weights:
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>RESTORE Council Goal</th>
              <th>
                Goal Weights &nbsp;
                <GoInfo data-tip data-for="goalWeights" />
                <ReactTooltip id="goalWeights" type="dark">
                  <span>
                    Goal weights are set by users to emphasize specific RESTORE
                    goals
                  </span>
                </ReactTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {RESTOREGoal.map((goal, idx) => {
              return (
                <tr key={idx}>
                  <td>{goal}</td>
                  <td>{Object.values(weights)[idx].weight}%</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        Data Measure Weights Summary:
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th className="align-top">Measure Name</th>
              <th className="align-top">Goal Related</th>
              <th className="align-top">
                Utility &nbsp;
                <GoInfo data-tip data-for="utility" />
                <ReactTooltip id="utility" type="dark">
                  <span>
                    Utility functions are mathematical representations of how
                    users prefer varying values of a single measure
                  </span>
                </ReactTooltip>
              </th>
              <th className="align-top">
                Weights &nbsp;
                <GoInfo data-tip data-for="measureWeights" />
                <ReactTooltip id="measureWeights" type="dark">
                  <span>
                    Measure weights are set by users to emphasize certain
                    priority attributes
                  </span>
                </ReactTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {weights.hab.selected &&
              weights.hab.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type="dark">
                      <span>
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Connectivity to existing protected area indicates if the proposed conservation area is within 1 km of an area classified as protected by PAD-US 2.0 data."
                          : measure.label === "Connectivity of Natural Lands"
                          ? "A percent attribute that stands for the proportion of area classified as a hub or corridor."
                          : measure.label === "Threat of Urbanization"
                          ? "Threat of urbanization (ToU) indicates the likelihood of the given project area or area of interest (AoI) being urbanized by the year 2060."
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "This attribute prioritizes rare habitat types and those that have been identified as conservation priorities in state and regional plans."
                          : ""}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Habitat</td>
                  <td>
                    {measure.utility === "1"
                      ? measure.label ===
                        "Connectivity to Existing Protected Area"
                        ? "More"
                        : measure.label === "Connectivity of Natural Lands"
                        ? "More"
                        : measure.label === "Threat of Urbanization"
                        ? "Lower"
                        : measure.label ===
                          "Composition of Priority Natural Lands"
                        ? "More"
                        : ""
                      : measure.label ===
                        "Connectivity to Existing Protected Area"
                      ? "Less"
                      : measure.label === "Connectivity of Natural Lands"
                      ? "Less"
                      : measure.label === "Threat of Urbanization"
                      ? "Higher"
                      : measure.label ===
                        "Composition of Priority Natural Lands"
                      ? "Less"
                      : ""}
                  </td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {!!customizedMeasures.hab.length &&
              customizedMeasures.hab.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Habitat</td>
                  <td>{measure.utility === "1" ? "Higher" : "Lower"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.wq.selected &&
              weights.wq.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type="dark">
                      <span>
                        {measure.label === "303(d): Impaired Watershed Area"
                          ? "A percent attribute that stands for the proportion of impaired watershed within each hexagon."
                          : measure.label ===
                            "Hydrologic Response to Land-Use Change"
                          ? "The magnitude of change in peak flow due to Land-Use/Land-Cover change from 1996 to 2016."
                          : measure.label === "Percent Irrigated Agriculture"
                          ? "The proportion (%) of the area of interest that is covered by irrigated agriculture."
                          : measure.label ===
                            "Lateral Connectivity of Floodplain"
                          ? "The proportion of floodplain within the area of interest that is connected."
                          : measure.label ===
                            "Composition of Riparizan Zone Lands"
                          ? "An average index value of the composition of lands within a 100-meter buffer of streams."
                          : measure.label === "Presence of Impoundments"
                          ? "This measure describes whether or not an area is impacted by hydromodification."
                          : ""}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Water</td>
                  <td>
                    {measure.utility === "1"
                      ? measure.label === "303(d): Impaired Watershed Area"
                        ? "Less"
                        : measure.label ===
                          "Hydrologic Response to Land-Use Change"
                        ? "Less"
                        : measure.label === "Percent Irrigated Agriculture"
                        ? "Less"
                        : measure.label === "Lateral Connectivity of Floodplain"
                        ? "More"
                        : measure.label ===
                          "Composition of Riparizan Zone Lands"
                        ? "More"
                        : measure.label === "Presence of Impoundments"
                        ? "Less"
                        : ""
                      : measure.label === "303(d): Impaired Watershed Area"
                      ? "More"
                      : measure.label ===
                        "Hydrologic Response to Land-Use Change"
                      ? "More"
                      : measure.label === "Percent Irrigated Agriculture"
                      ? "More"
                      : measure.label === "Lateral Connectivity of Floodplain"
                      ? "Less"
                      : measure.label === "Composition of Riparizan Zone Lands"
                      ? "Less"
                      : measure.label === "Presence of Impoundments"
                      ? "More"
                      : ""}
                  </td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {!!customizedMeasures.wq.length &&
              customizedMeasures.wq.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Water</td>
                  <td>{measure.utility === "1" ? "Higher" : "Lower"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.lcmr.selected &&
              weights.lcmr.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type="dark">
                      <span>
                        {measure.label ===
                        "Vulnerable Areas of Terrestrial Endemic Species"
                          ? "This measure represents the ratio of endemic species to the amount of protected land in the contiguous U.S."
                          : measure.label ===
                            "Threatened and Endangered Species - Critical Habitat Area"
                          ? "The measure is based on the U.S. Fish and Wildlife Service designated federally threatened and endangered (T&E) critical habitat."
                          : measure.label ===
                            "Threatened and Endangered Species - Number of Species"
                          ? "This attribute measures the number of federally threatened and endangered (T&E) species that have habitat ranges identified within each hexagon."
                          : measure.label === "Light Pollution Index"
                          ? "An index that measures the intensity of light pollution within each hexagon."
                          : measure.label ===
                            "Terrestrial Vertebrate Biodiversity"
                          ? "Definition of Terrestrial Vertebrate Biodiversity."
                          : measure.label === "Vulnerability to Invasive Plants"
                          ? "Definition of Vulnerability to Invasive Plants."
                          : ""}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>LCMR</td>
                  <td>
                    {measure.utility === "1"
                      ? measure.label ===
                        "Vulnerable Areas of Terrestrial Endemic Species"
                        ? "More"
                        : measure.label ===
                          "Threatened and Endangered Species - Critical Habitat Area"
                        ? "More"
                        : measure.label ===
                          "Threatened and Endangered Species - Number of Species"
                        ? "More"
                        : measure.label === "Light Pollution Index"
                        ? "Less"
                        : measure.label ===
                          "Terrestrial Vertebrate Biodiversity"
                        ? "Higher"
                        : measure.label === "Vulnerability to Invasive Plants"
                        ? "Higher"
                        : ""
                      : measure.label ===
                        "Vulnerable Areas of Terrestrial Endemic Species"
                      ? "Less"
                      : measure.label ===
                        "Threatened and Endangered Species - Critical Habitat Area"
                      ? "Less"
                      : measure.label ===
                        "Threatened and Endangered Species - Number of Species"
                      ? "Less"
                      : measure.label === "Light Pollution Index"
                      ? "More"
                      : measure.label === "Terrestrial Vertebrate Biodiversity"
                      ? "Lower"
                      : measure.label === "Vulnerability to Invasive Plants"
                      ? "Lower"
                      : ""}
                  </td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {!!customizedMeasures.lcmr.length &&
              customizedMeasures.lcmr.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>LCMR</td>
                  <td>{measure.utility === "1" ? "Higher" : "Lower"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.cl.selected &&
              weights.cl.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type="dark">
                      <span>
                        {measure.label ===
                        "National Register of Historic Places"
                          ? "A numeric attribute that represents the counts of historic places within each hexagon."
                          : measure.label === "National Heritage Area"
                          ? "A percent attribute that stands for the proportion of heritage area within each hexagon."
                          : measure.label ===
                            "Proximity to Socially Vulnerable Communities"
                          ? "This measure indicates the proximity to communities that are socially vulnerable according to the National Oceanic and Atmospheric Administration’s (NOAA) Social Vulnerability Index."
                          : measure.label === "Community Threat Index"
                          ? "The Community Threat Index (CTI) comes from the Coastal Resilience Evaluation and Siting Tool (CREST)."
                          : ""}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Resilience</td>
                  <td>
                    {measure.utility === "1"
                      ? measure.label === "National Register of Historic Places"
                        ? "More"
                        : measure.label === "National Heritage Area"
                        ? "More"
                        : measure.label ===
                          "Proximity to Socially Vulnerable Communities"
                        ? "More"
                        : measure.label === "Community Threat Index"
                        ? "Higher"
                        : measure.label === "Social Vulnerability Index"
                        ? "Higher"
                        : ""
                      : measure.label === "National Register of Historic Places"
                      ? "Less"
                      : measure.label === "National Heritage Area"
                      ? "Less"
                      : measure.label ===
                        "Proximity to Socially Vulnerable Communities"
                      ? "Less"
                      : measure.label === "Community Threat Index"
                      ? "Lower"
                      : measure.label === "Social Vulnerability Index"
                      ? "Lower"
                      : ""}
                  </td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {!!customizedMeasures.cl.length &&
              customizedMeasures.cl.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Resilience</td>
                  <td>{measure.utility === "1" ? "Higher" : "Lower"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.eco.selected &&
              weights.eco.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>
                    {measure.label} &nbsp;
                    <GoInfo data-tip data-for={measure.value} />
                    <ReactTooltip id={measure.value} type="dark">
                      <span>
                        {measure.label === "High Priority Working Lands"
                          ? "The percentage area of pine, cropland, and pasture/hay classes from the National Land Cover Database (NLCD) 2016 classification map."
                          : measure.label === "Commercial Fishing Reliance"
                          ? "Commercial fishing reliance measures the presence of commercial fishing through fishing activity as shown through permits and vessel landings relative to the population of a community. "
                          : measure.label === "Recreational Fishing Engagement"
                          ? "Recreational fishing engagement measures the presence of recreational fishing through fishing activity estimates, including charter fishing pressure, private fishing pressure, and shore fishing pressure."
                          : measure.label ===
                            "Access & Recreation - Number of Access Points"
                          ? "This measure indicates the number of points within a 25 km buffer radius of a hexagon, where the public can access places to engage in outdoor recreation."
                          : ""}
                      </span>
                    </ReactTooltip>
                  </td>
                  <td>Economy</td>
                  <td>
                    {measure.utility === "1"
                      ? measure.label === "High Priority Working Lands"
                        ? "More"
                        : measure.label === "Commercial Fishing Reliance"
                        ? "Higher"
                        : measure.label === "Recreational Fishing Engagement"
                        ? "More"
                        : measure.label ===
                          "Access & Recreation - Number of Access Points"
                        ? "More"
                        : ""
                      : measure.label === "High Priority Working Lands"
                      ? "Less"
                      : measure.label === "Commercial Fishing Reliance"
                      ? "Lower"
                      : measure.label === "Recreational Fishing Engagement"
                      ? "Less"
                      : measure.label ===
                        "Access & Recreation - Number of Access Points"
                      ? "Less"
                      : ""}
                  </td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {!!customizedMeasures.eco.length &&
              customizedMeasures.eco.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.name}</td>
                  <td>Economy</td>
                  <td>{measure.utility === "1" ? "Higher" : "Lower"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between">
          {loggedIn === true ? (
            <Button
              style={{ float: "left" }}
              className={"btn-dark"}
              variant="secondary"
              onClick={() => {
                currentWeight.value !== "No Saved Measures"
                  ? setSlider(true)
                  : setSlider(false);
                showConfirm();
              }}
            >
              Save Measures
            </Button>
          ) : (
            ""
          )}
          {currentWeight.value !== "No Saved Measures" ? (
            <Button
              style={{
                float: "right",
                background: "#c82333",
                borderColor: "#bd2130",
              }}
              variant="secondary"
              onClick={deleteSave}
            >
              Delete Save
            </Button>
          ) : (
            ""
          )}
        </div>
      </Container>
      <div className="button-container container">
        <Button
          style={{ float: "left" }}
          variant="secondary"
          onClick={() => setAssessStep("selectDataMeasures")}
        >
          {arrowIcon} Edit Data Measures
        </Button>

        {location.pathname !== "/user/measures" ? (
          useCase === "visualization" ? (
            <Button
              className="ml-2"
              variant="primary"
              style={{ float: "right" }}
              onClick={() => {
                setInteractiveLayerIds(["visualization-layer"]);
                createVisualization();
                setView("visualize");
              }}
            >
              Generate Visualization
            </Button>
          ) : (
            <Button
              className="ml-2"
              variant="primary"
              style={{ float: "right" }}
              onClick={createAssessment}
            >
              Generate Assessment
            </Button>
          )
        ) : (
          ""
        )}
      </div>
      <Modal show={confirmShow} onHide={confirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>Save Measure</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="save-modal">
          <div className="slider-buttons">
            <Button
              style={{ color: buttonSlider ? "" : "black" }}
              onClick={() => {
                setSlider(false);
              }}
            >
              Create
            </Button>
            {currentWeight.value === "No Saved Measures" ? (
              ""
            ) : (
              <Button
                style={{ color: buttonSlider ? "black" : "" }}
                onClick={() => {
                  setSlider(true);
                }}
              >
                Update
              </Button>
            )}
            <span style={{ left: (buttonSlider ? 50 : 0) + "%" }}></span>
          </div>
          {buttonSlider ? (
            <p style={{ marginTop: "10px" }}>
              Update the measures of your save below.
            </p>
          ) : (
            <p style={{ marginTop: "10px" }}>
              Create a save for your measures to allow ease of use. Enter a save
              name below.
            </p>
          )}

          {buttonSlider ? (
            <input
              key={"random_keyFor_btn_slider1"}
              autoComplete="none"
              style={{
                border: "lightgray solid 1px",
                borderRadius: "4px",
                padding: "5px 10px",
                outline: "none",
              }}
              type={"text"}
              defaultValue={
                currentWeight.value === "No Saved Measures"
                  ? ""
                  : currentWeight.value
              }
            ></input>
          ) : (
            <input
              key={"random_keyFor_btn_slider2"}
              autoComplete="none"
              style={{
                border: "lightgray solid 1px",
                borderRadius: "4px",
                padding: "5px 10px",
                outline: "none",
              }}
              type={"text"}
              defaultValue=""
            ></input>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={confirmClose}>
            Cancel
          </Button>
          {buttonSlider ? (
            <Button
              onClick={() => {
                updateMeasures();
                confirmClose();
              }}
            >
              Update
            </Button>
          ) : (
            <Button
              onClick={() => {
                saveMeasures();
              }}
            >
              Create
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReviewAssessSettings;
