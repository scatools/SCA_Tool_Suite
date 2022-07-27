import React, { useState, useEffect } from "react";
import { Table, Button, CloseButton } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import FilterPane from "./FilterPane";
import CustomPagination from "./CustomPagination";
import ReactTooltip from "react-tooltip";
import { GoInfo } from "react-icons/go";

const TableContainer = ({
  coordinates,
  aoiSelected,
  setShowTableContainer,
}) => {
  const history = useHistory();
  const [tableDetails, setTableDetails] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPane, setShowFilterPane] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    state: "All",
    time: "All",
    priority: "All",
  });

  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );

  const onFilterConfigChange = (newConfig) => {
    setFilterConfig(newConfig);
    setCurrentPage(1);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleFilterPane = () => {
    setShowFilterPane((showFilterPane) => !showFilterPane);
  };

  const planQueryByPOI = async () => {
    const response = await axios.get(
      // `http://localhost:5000/plan/spatial/point`,
      `https://sca-cpt-backend.herokuapp.com/plan/spatial/point`,
      {
        params: {
          start: 10 * (currentPage - 1),
          end: 10 * currentPage,
          state: filterConfig.state,
          time: filterConfig.time,
          priority: filterConfig.priority,
          lng: coordinates[0],
          lat: coordinates[1],
        },
      }
    );
    setTableDetails(response.data.data);
    setTotalCount(response.data.totalRowCount);
    if (response.data.totalRowCount !== 0) {
      setShowTableContainer(true);
    } else {
      setShowTableContainer(false);
    }
  };

  const planQueryByAOI = async () => {
    const newPolygon = {
      type: "MultiPolygon",
      coordinates: aoiList[0].geometry.map(
        (feature) => feature.geometry.coordinates
      ),
    };
    const response = await axios.get(
      // `http://localhost:5000/plan/spatial/polygon`,
      `https://sca-cpt-backend.herokuapp.com/plan/spatial/polygon`,
      {
        params: {
          start: 10 * (currentPage - 1),
          end: 10 * currentPage,
          state: filterConfig.state,
          time: filterConfig.time,
          priority: filterConfig.priority,
          coordinates: JSON.stringify(newPolygon.coordinates),
        },
      }
    );
    setTableDetails(response.data.data);
    setTotalCount(response.data.totalRowCount);
    if (response.data.totalRowCount !== 0) {
      setShowTableContainer(true);
    } else {
      setShowTableContainer(false);
    }
  };

  useEffect(() => {
    if (coordinates[0] && coordinates[1]) {
      planQueryByPOI();
    }
  }, [currentPage, filterConfig, coordinates]);

  useEffect(() => {
    if (aoiSelected) {
      planQueryByAOI();
    }
  }, [currentPage, filterConfig, aoiSelected]);

  return (
    <div className="table-container-wrapper">
      {showFilterPane && (
        <FilterPane
          currentFilterConfig={filterConfig}
          onFilterConfigChange={onFilterConfigChange}
          size="small"
        />
      )}
      <div className="map-table-filter-button">
        <Button variant="secondary" onClick={toggleFilterPane}>
          Filter
        </Button>
      </div>
      <div id="map-table-container">
        <CloseButton onClick={() => setShowTableContainer(false)} />
        <Table hover borderless striped>
          <thead>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th>Plan Name</th>
              <th>Related State</th>
              <th>Plan Details</th>
              <GoInfo data-tip data-for="plan-disclaimer" />
              <ReactTooltip
                id="plan-disclaimer"
                delayHide={500}
                delayUpdate={500}
                clickable="true"
                type="dark"
                place="right"
              >
                <span>
                  Every effort was made to ensure plan overviews are correct but
                  we cannot guarantee the summaries to be accurate. Please view
                  the raw document for the most accurate plan information.
                </span>
              </ReactTooltip>
            </tr>
          </thead>
          <tbody style={{ borderBottom: "1px solid black" }}>
            {!!tableDetails ? (
              tableDetails.map((row) => (
                <tr key={row.id}>
                  <td style={{ width: "50%" }}>
                    <div
                      style={{
                        overflow: "hidden",
                        height: 50,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                      title={row.agency_lead}
                    >
                      {row.plan_name}
                    </div>
                  </td>
                  <td>{row.related_state}</td>
                  <td>
                    <Button
                      onClick={() => {
                        history.push(`/plan/${row.id}`);
                      }}
                    >
                      Learn more
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" align="center">
                  Loading table
                  <BeatLoader size={5} />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {!!tableDetails && (
          <CustomPagination
            totalCount={totalCount}
            onPageChange={onPageChange}
            currentPage={currentPage}
          />
        )}
      </div>
    </div>
  );
};

export default TableContainer;
