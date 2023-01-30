import React, { useState, useEffect } from "react";
import { Table, CloseButton } from "react-bootstrap";

const HexagonScoreTable = ({
  visualizedHexagon,
  scoreTableClass,
  setScoreTableClass,
}) => {
  const filterData = (value) => {
		if (value !== undefined) {
			if (parseFloat(value) === -1) {
				return "No Data";
			} else {
				return value.toFixed(2);
			};
		};
	};

  useEffect(() => {
    if (visualizedHexagon) {
      setScoreTableClass("score-table active");
    }
  }, [visualizedHexagon]);

  return (
    <div className={scoreTableClass}>
      {visualizedHexagon && (
        <Table striped bordered size="sm" variant="dark">
          <thead>
            <tr>
              <th colSpan="2">
                <CloseButton
                  variant="dark"
                  onClick={() => {
                    setScoreTableClass("score-table");
                  }}
                />
                <h5 style={{ padding: "2px" }}>Detailed Score Table</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2">
                <b>Habitat: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Connectivity to Existing Protected Area:</td>
              <td>{filterData(visualizedHexagon.hab1)}</td>
            </tr>
            <tr>
              <td>Connectivity of Natural Lands:</td>
              <td>{filterData(visualizedHexagon.hab2)}</td>
            </tr>
            <tr>
              <td>Threat of Urbanization:</td>
              <td>{filterData(visualizedHexagon.hab3)}</td>
            </tr>
            <tr>
              <td>Composition of Priority Natural Lands:</td>
              <td>{filterData(visualizedHexagon.hab4)}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Water Quality & Quantity: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Impaired Watershed Area:</td>
              <td>{filterData(visualizedHexagon.wq1)}</td>
            </tr>
            <tr>
              <td>Hydrologic Response to Land-Use Change:</td>
              <td>{filterData(visualizedHexagon.wq2)}</td>
            </tr>
            <tr>
              <td>Percent Irrigated Agriculture:</td>
              <td>{filterData(visualizedHexagon.wq3)}</td>
            </tr>
            <tr>
              <td>Lateral Connectivity to Floodplain:</td>
              <td>{filterData(visualizedHexagon.wq4)}</td>
            </tr>
            <tr>
              <td>Composition of Riparizan Zone Lands:</td>
              <td>{filterData(visualizedHexagon.wq5)}</td>
            </tr>
            <tr>
              <td>Presence of Impoundments:</td>
              <td>{filterData(visualizedHexagon.wq6)}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Living Coastal & Marine Resources:</b>{" "}
              </td>
            </tr>
            <tr>
              <td>Vulnerable Area of Terrestrial Endemic Species: </td>
              <td>{filterData(visualizedHexagon.lcmr1)}</td>
            </tr>
            <tr>
              <td>T&E Critical Habitat Area:</td>
              <td>{filterData(visualizedHexagon.lcmr2)}</td>
            </tr>
            <tr>
              <td>T&E Number of Species:</td>
              <td>{filterData(visualizedHexagon.lcmr3)}</td>
            </tr>
            <tr>
              <td>Light Pollution Index:</td>
              <td>{filterData(visualizedHexagon.lcmr4)}</td>
            </tr>
            <tr>
              <td>Terrestrial Vertebrate Biodiversity:</td>
              <td>{filterData(visualizedHexagon.lcmr5)}</td>
            </tr>
            <tr>
              <td>Vulnerability to Invasive Plants:</td>
              <td>{filterData(visualizedHexagon.lcmr6)}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Community Resilience:</b>{" "}
              </td>
            </tr>
            <tr>
              <td>National Register of Historic Places: </td>
              <td>{filterData(visualizedHexagon.cl1)}</td>
            </tr>
            <tr>
              <td>National Heritage Area:</td>
              <td>{filterData(visualizedHexagon.cl2)}</td>
            </tr>
            <tr>
              <td>Proximity to Socially Vulnerability Communities:</td>
              <td>{filterData(visualizedHexagon.cl3)}</td>
            </tr>
            <tr>
              <td>Community Threat Index:</td>
              <td>{filterData(visualizedHexagon.cl4)}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Gulf Economy:</b>{" "}
              </td>
            </tr>
            <tr>
              <td>High Priority Working Lands: </td>
              <td>{filterData(visualizedHexagon.eco1)}</td>
            </tr>
            <tr>
              <td>Commercial Fishery Reliance:</td>
              <td>{filterData(visualizedHexagon.eco2)}</td>
            </tr>
            <tr>
              <td>Recreational Fishery Engagement:</td>
              <td>{filterData(visualizedHexagon.eco3)}</td>
            </tr>
            <tr>
              <td>Access & Recreation - Number of Access Points:</td>
              <td>{filterData(visualizedHexagon.eco4)}</td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default HexagonScoreTable;
