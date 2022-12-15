import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoFilter } from "react-icons/io5";
import { FcQuestions } from "react-icons/fc";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import axios from "axios";
import emailjs from "@emailjs/browser";
import FilterPane from "./FilterPane";
import CustomPagination from "./CustomPagination";
import ReactTooltip from "react-tooltip";
import { GoInfo } from "react-icons/go";

const PlanTable = ({ setAlertText, setAlertType }) => {
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
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState(null);
  const [newPlanAgency, setNewPlanAgency] = useState(null);
  const [newPlanLink, setNewPlanLink] = useState(null);
  const [userLikedPlans, setUserLikedPlans] = useState([]);
  const user = useSelector((state) => state.user);

  const handleBack = () => {
    history.push("/tool");
  };

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

  const fileMissingPlan = () => {
    if (user.loggedIn) {
      setShowNewPlanForm(true);
    } else {
      setAlertType("danger");
      setAlertText("Please login in to file a missing plan!");
      window.setTimeout(() => setAlertText(false), 4000);
    }
  };

  const submitNewPlanForm = () => {
    const formData = {
      name: newPlanName,
      agency: newPlanAgency,
      link: newPlanLink,
      user: user.firstName + " " + user.lastName,
      email: user.email,
    };

    emailjs
      .send(
        "service_scagulf",
        "template_sca_plan",
        formData,
        process.env.EMAILJS_USERID
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    setShowNewPlanForm(false);
    setAlertType("success");
    setAlertText("You have successfully submitted a new plan!");
    window.setTimeout(() => setAlertText(false), 4000);
  };

  const getPlans = async () => {
    const response = await axios.get(
      `https://sca-cpt-backend.herokuapp.com/plan`,
      {
        params: {
          start: 10 * (currentPage - 1),
          end: 10 * currentPage,
          state: filterConfig.state,
          time: filterConfig.time,
          priority: filterConfig.priority,
        },
      }
    );
    setTableDetails(response.data.data);
    setTotalCount(response.data.totalRowCount);
  };

  const getUserLikedPlans = async () => {
    const result = await axios.post(
      `https://sca-cpt-backend.herokuapp.com/user/plan`,
      {
        username: user.username,
      }
    );
    const likedPlanList = result.data.rows.map((row) => {
      return row.plan_id;
    });
    setUserLikedPlans(likedPlanList);
  };

  useEffect(() => {
    getPlans();
  }, [currentPage, filterConfig]);

  useEffect(() => {
    if (user.loggedIn) {
      getUserLikedPlans();
    }
  }, [user]);

  return (
    <div className="plan-table-wrapper">
      {showFilterPane && (
        <FilterPane
          currentFilterConfig={filterConfig}
          onFilterConfigChange={onFilterConfigChange}
          size="large"
        />
      )}
      {user.loggedIn && showNewPlanForm && (
        <Modal
          centered
          show={showNewPlanForm}
          onHide={() => {
            setShowNewPlanForm(false);
          }}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Please fill in the details of the missing conservation plan
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              Plan Name:
              <input
                type="text"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                required
              ></input>
              Agency Lead:
              <input
                type="text"
                value={newPlanAgency}
                onChange={(e) => setNewPlanAgency(e.target.value)}
                required
              ></input>
              Document Link (URL):
              <input
                type="text"
                value={newPlanLink}
                onChange={(e) => setNewPlanLink(e.target.value)}
                required
              ></input>
              <br />
              <div className="d-flex justify-content-between">
                <Button
                  className="btn btn-warning"
                  onClick={() => {
                    setShowNewPlanForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="btn btn-primary" onClick={submitNewPlanForm}>
                  Confirm
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <Container
        style={{
          width: "50%",
          padding: "10px",
          margin: "0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          variant="secondary"
          className="filter-button"
          onClick={toggleFilterPane}
        >
          <IoFilter /> &nbsp; Filter
        </Button>
        <Button
          variant="secondary"
          className="filter-button"
          style={{ marginLeft: "auto" }}
          onClick={handleBack}
        >
          Back
        </Button>
        <a className="plan-submission-entry" onClick={fileMissingPlan}>
          <FcQuestions size={"1.5em"} />
          File A Missing Plan
        </a>
      </Container>
      <div className="plan-table">
        <Table hover borderless striped>
          <thead>
            <tr style={{ borderBottom: "1px solid black" }}>
              {user.loggedIn && <th>Liked</th>}
              <th>Plan Name</th>
              <th>Primary Planning Method</th>
              <th>Plan Time Frame</th>
              <th>Agency Lead</th>
              <th>
                Plan Details
                <GoInfo
                  style={{ marginLeft: "5px" }}
                  data-tip
                  data-for="plan-disclaimer"
                />
              </th>
              <th>Original Document</th>
            </tr>
          </thead>
          <ReactTooltip
            id="plan-disclaimer"
            delayHide={500}
            delayUpdate={500}
            clickable="true"
            type="dark"
            place="right"
          >
            <span>
              Every effort was made to ensure plan overviews are correct but we
              cannot guarantee the summaries to be accurate. Please view the raw
              document for the most accurate plan information.
            </span>
          </ReactTooltip>
          <tbody style={{ borderBottom: "1px solid black" }}>
            {!!tableDetails ? (
              tableDetails.map((row) => (
                <tr key={row.id}>
                  {user.loggedIn && (
                    <td>
                      <UseAnimations
                        animation={heart}
                        fillColor="red"
                        reverse={userLikedPlans.includes(row.id) ? true : false}
                        onClick={async () => {
                          if (userLikedPlans.includes(row.id)) {
                            const result = await axios.post(
                              `https://sca-cpt-backend.herokuapp.com/delete/plan`,
                              {
                                username: user.username,
                                plan_id: row.id,
                              }
                            );
                            if (result) {
                              setAlertType("warning");
                              setAlertText(
                                "You have removed a plan from your favorite list!"
                              );
                              window.setTimeout(
                                () => setAlertText(false),
                                4000
                              );
                            }
                            getUserLikedPlans();
                          } else {
                            const result = await axios.post(
                              `https://sca-cpt-backend.herokuapp.com/save/plan`,
                              {
                                username: user.username,
                                plan_id: row.id,
                              }
                            );
                            if (result) {
                              setAlertType("success");
                              setAlertText(
                                "You have added a plan to your favorite list!"
                              );
                              window.setTimeout(
                                () => setAlertText(false),
                                4000
                              );
                            }
                            getUserLikedPlans();
                          }
                        }}
                      />
                    </td>
                  )}
                  <td>{row.plan_name}</td>
                  <td>{row.planning_method}</td>
                  <td>{row.plan_timeframe}</td>
                  <td style={{ width: "15%" }}>
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
                      {row.agency_lead}
                    </div>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        history.push(`/plan/${row.id}`);
                      }}
                    >
                      Learn more
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        window.open(
                          row.plan_url.includes("static/assets/")
                            ? `https://s3.amazonaws.com/planinventory/${row.plan_url}`
                            : row.plan_url,
                          "_blank"
                        );
                      }}
                    >
                      Raw document
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Loading table...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {!!tableDetails && (
        <CustomPagination
          totalCount={totalCount}
          onPageChange={onPageChange}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default PlanTable;
