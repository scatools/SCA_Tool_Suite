import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const downArrow = <FontAwesomeIcon icon={faChevronDown} color="white" />;

const OptionsAccordion = () => {
  const aoiList = Object.values(useSelector((state) => state.aoi));
  const useCase = useSelector((state) => state.usecase.useCase);

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
                      <Button variant="primary" style={{ height: "40px" }}>
                        Find Related Plans
                      </Button>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
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
                      Use your goal weights and priorities to produce a heatmap
                      that allows for at-a-glance comparisons over a specific
                      AOI.
                    </p>

                    <div className="option-nav-cont">
                      <Button variant="primary" style={{ height: "40px" }}>
                        Visualize AOI Heatmap
                      </Button>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
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
                      Use our conservation plan inventory to track down plans
                      that are related to your area of interest.
                    </p>

                    <div className="option-nav-cont">
                      <Button variant="primary" style={{ height: "40px" }}>
                        Find Related Plans
                      </Button>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default OptionsAccordion;
