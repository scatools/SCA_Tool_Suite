import React, { useState, useEffect } from "react";
import { Table, Button, CloseButton } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { IoFilter } from "react-icons/io5";
import { GoDesktopDownload, GoInfo } from "react-icons/go";
import ReactTooltip from "react-tooltip";
import Draggable from "react-draggable";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import FilterPane from "./FilterPane";
import CustomPagination from "./CustomPagination";

const TableContainer = ({
  coordinates,
  aoiSelected,
  setShowTableContainer,
  showTableContainer,
  view,
}) => {
  const history = useHistory();
  const [entireTable, setEntireTable] = useState();
  const [tableDetails, setTableDetails] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPane, setShowFilterPane] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    state: "All",
    time: "All",
    priority: "All",
  });

  const csvHeader = [
    {label: "Plan Name", key: "plan_name"},
    {label: "Primary Planning Method", key: "planning_method"},
    {label: "Plan Time Frame", key : "plan_timeframe"},
    {label: "Agency Lead", key: "agency_lead"},
    {label: "Related State", key: "related_state"},
    {label: "Original Document", key: "plan_url"}
  ];

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
    setLoadingTable(false);
    if (showTableContainer) {
      setTableDetails(response.data.data);
      setTotalCount(response.data.totalRowCount);
      if (response.data.totalRowCount === 0) {
        setShowTableContainer(false);
      };
      // Get entire table for download
      const download = await axios.get(
        `https://sca-cpt-backend.herokuapp.com/plan`,
        {
          params: {
            start: 0,
            end: response.data.totalRowCount,
            state: filterConfig.state,
            time: filterConfig.time,
            priority: filterConfig.priority,
          },
        }
      );
      setEntireTable(download.data.data);
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
    setLoadingTable(false);
    if (showTableContainer) {
      setTableDetails(response.data.data);
      setTotalCount(response.data.totalRowCount);
      if (response.data.totalRowCount === 0) {
        setShowTableContainer(false);
      };
      // Get entire table for download
      const download = await axios.get(
        `https://sca-cpt-backend.herokuapp.com/plan`,
        {
          params: {
            start: 0,
            end: response.data.totalRowCount,
            state: filterConfig.state,
            time: filterConfig.time,
            priority: filterConfig.priority,
          },
        }
      );
      setEntireTable(download.data.data);
    }
  };

  useEffect(() => {
    if (view !== "list" && coordinates[0] && coordinates[1]) {
      setLoadingTable(true);
      planQueryByPOI();
    }
  }, [currentPage, filterConfig, coordinates, view]);

  useEffect(() => {
    if (view === "list" && aoiSelected) {
      setLoadingTable(true);
      planQueryByAOI();
    }
  }, [currentPage, filterConfig, aoiSelected, view]);

  return (
    <Draggable>
      {tableDetails && tableDetails.length > 0 ? (
        <div className="table-container-wrapper">
          {showFilterPane && (
            <FilterPane
              currentFilterConfig={filterConfig}
              onFilterConfigChange={onFilterConfigChange}
              size="small"
            />
          )}
          <div id="map-table-container">
            <CloseButton onClick={() => setShowTableContainer(false)} />
            {!!tableDetails && !!entireTable && !loadingTable && (
              <div className="map-table-button-container">
                <Button variant="secondary" onClick={toggleFilterPane}>
                  <IoFilter /> &nbsp; Filter
                </Button>
                <CSVLink data={entireTable} filename="Related Plans.csv" headers={csvHeader}>
                  <Button variant="secondary">
                    <GoDesktopDownload /> &nbsp; Download
                  </Button>
                </CSVLink>
              </div>
            )}
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
                      Every effort was made to ensure plan overviews are correct
                      but we cannot guarantee the summaries to be accurate.
                      Please view the raw document for the most accurate plan
                      information.
                    </span>
                  </ReactTooltip>
                </tr>
              </thead>
              <tbody style={{ borderBottom: "1px solid black" }}>
                {!loadingTable && tableDetails ? (
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
            {!!tableDetails && !loadingTable && (
              <CustomPagination
                totalCount={totalCount}
                onPageChange={onPageChange}
                currentPage={currentPage}
              />
            )}
          </div>
        </div>
      ) : (
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
                      Every effort was made to ensure plan overviews are correct
                      but we cannot guarantee the summaries to be accurate.
                      Please view the raw document for the most accurate plan
                      information.
                    </span>
                  </ReactTooltip>
                </tr>
              </thead>
              <tbody style={{ borderBottom: "1px solid black" }}>
                {!loadingTable && tableDetails ? (
                  <h4 style={{ textAlign: "center", width: "100%" }}>
                    No plans found for this location{" "}
                  </h4>
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
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TableContainer;
