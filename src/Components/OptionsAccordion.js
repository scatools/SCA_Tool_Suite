import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { setUseCase } from "../Redux/action";

const downArrow = <FontAwesomeIcon icon={faChevronDown} color="white" />;

const OptionsAccordion = ({
  view,
  setView,
  setAssessStep,
  setVisualizationOpacity,
  setShowTableContainer,
}) => {
  const aoi = Object.values(useSelector((state) => state.aoi));
  const useCase = useSelector((state) => state.usecase.useCase);
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Accordion className="options-accordion">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
          <div className="accordion-dropdown">
            <p>More Ways To Explore Your AOI(s)</p>
            <p>{downArrow}</p>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            <Accordion>
              {useCase !== "prioritization" && (
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    <div className="accordion-dropdown">
                      <p>Evaluate Multiple AOIs</p>
                      <p>{downArrow}</p>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <p className="edit-instructions">
                        Use your RESTORE council goal weights and data measure
                        priorities to evaluate multiple areas of interest.
                      </p>

                      <div className="option-nav-cont">
                        <Button
                          onClick={() => {
                            setShowTableContainer(false);
                            Object.keys(aoi).length > 1
                              ? setView("list")
                              : setView("add");
                            dispatch(setUseCase("prioritization"));
                            setVisualizationOpacity(0);
                          }}
                          variant="primary"
                          style={{ height: "40px" }}
                        >
                          Compare AOIs
                        </Button>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              )}
              {useCase !== "visualization" && (
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="3">
                    <div className="accordion-dropdown">
                      <p>Heatmap Visualization</p>
                      <p>{downArrow}</p>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="3">
                    <Card.Body>
                      <p className="edit-instructions">
                        Use your goal weights and priorities to produce a
                        heatmap that allows for at-a-glance comparisons over a
                        specific AOI.
                      </p>

                      <div className="option-nav-cont">
                        <Button
                          onClick={() => {
                            dispatch(setUseCase("visualization"));
                            setAssessStep("selectAOI");
                            setView("assess");
                            setVisualizationOpacity(0);
                            setShowTableContainer(false);
                          }}
                          variant="primary"
                          style={{ height: "40px" }}
                        >
                          Visualize AOI Heatmap
                        </Button>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              )}
              {useCase !== "inventory" && (
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    <div className="accordion-dropdown">
                      <p>Find Related Conservation Plans</p>
                      <p>{downArrow}</p>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <p className="edit-instructions">
                        Use our extensive inventory of conservation plas to
                        track down conservation plans related to your AOI from
                        across the SCA region.
                      </p>
                      <div className="option-nav-cont">
                        <Button
                          onClick={() => history.push("/plans")}
                          variant="primary"
                          style={{ height: "40px" }}
                        >
                          Find Related Plans
                        </Button>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              )}
            </Accordion>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default OptionsAccordion;
