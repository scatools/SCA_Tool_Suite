import React, { useState, useEffect } from "react";
import { Button, Container, Jumbotron, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import axios from "axios";
import {
  loadUser,
  loadUserShapeList,
  loadUserReportList,
} from "../Redux/action";
import { calculateArea, aggregate, getStatus } from "../Helper/aggregateHex";
import {
  input_aoi,
  setLoader,
  mutipleSavedWeightsDelete,
  setCurrentWeight,
} from "../Redux/action";
import "../App.css";

const UserData = ({ setReportScript, setAlertText, setAlertType }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newFirstName, setNewFirstName] = useState(null);
  const [newLastName, setNewLastName] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [userReportList, setUserReportList] = useState([]);
  const [fileDeleted, setFileDeleted] = useState(null);
  const [reportDeleted, setReportDeleted] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const user = useSelector((state) => state.user);

  const showUpdateInfo = () => setUpdateInfo(true);

  const closeUpdateInfo = () => {
    setUpdateInfo(false);
    getUserData();
  };

  const showUpdatePassword = () => setUpdatePassword(true);

  const closeUpdatePassword = () => {
    setUpdatePassword(false);
    setPassword(null);
    setNewPassword(null);
  };

  const lst = useSelector((state) => state.multipleWeights);

  const getUserData = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user",
      { username: user.username }
    );

    setNewFirstName(result.data.rows[0].first_name);
    setNewLastName(result.data.rows[0].last_name);
    setNewEmail(result.data.rows[0].email);

    dispatch(loadUser(result.data.rows[0]));
  };

  const updateUserInfo = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/update/information',
    //   {
    //     username: userLoggedIn,
    //     email: newEmail,
    //     first_name: newFirstName,
    //     last_name: newLastName
    //   }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/update/information",
      {
        username: user.username,
        email: newEmail,
        first_name: newFirstName,
        last_name: newLastName,
      }
    );
    if (result) {
      setAlertType("success");
      setAlertText("You have updated your profile!");
      window.setTimeout(() => setAlertText(false), 4000);
      closeUpdateInfo();
    }
  };

  const updateUserPassword = async () => {
    // For development on local server
    // const verification = await axios.post(
    //   'http://localhost:5000/login',
    //   { username: userLoggedIn, password: password }
    // );

    // For production on Heroku
    const verification = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/login",
      { username: user.username, password: password }
    );

    if (!verification.data.validLogin) {
      setAlertType("danger");
      setAlertText("Incorrect password! Please enter again.");
      window.setTimeout(() => setAlertText(false), 4000);
    } else {
      // For development on local server
      // const result = await axios.post(
      //   'http://localhost:5000/update/password',
      //   {
      //     username: userLoggedIn,
      //     password: newPassword
      //   }
      // );

      // For production on Heroku
      const result = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/update/password",
        {
          username: user.username,
          password: newPassword,
        }
      );
      if (result) {
        setAlertType("success");
        setAlertText("You have updated your password!");
        window.setTimeout(() => setAlertText(false), 4000);
        closeUpdatePassword();
      }
    }
  };

  const getUserFile = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/shapefile',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const response = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user/shapefile",
      { username: user.username }
    );

    const shapeListArr = [];

    dispatch(loadUserShapeList(shapeListArr));
    if (response) {
      response.data.rows.map((row) => shapeListArr.push(row.file_name));
      response.data.rows.map((row) =>
        dispatch(loadUserShapeList(shapeListArr))
      );
    }
  };

  const getUserReport = async () => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/report',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user/report",
      { username: user.username }
    );
    if (result) {
      const reportListArr = [];
      result.data.rows.map((row) => reportListArr.push(row.report_name));
      dispatch(loadUserReportList(reportListArr));
    }
  };

  const deleteUserFile = async (file) => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/delete/shapefile',
    //   { file_name: file }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/delete/shapefile",
      { file_name: file }
    );
    if (result) {
      setAlertType("warning");
      setAlertText("You have deleted the AOI named " + file);
      window.setTimeout(() => setAlertText(false), 4000);
    }
    getUserFile();
  };

  const deleteUserReport = async (report) => {
    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/delete/report',
    //   { report_name: report }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/delete/report",
      { report_name: report }
    );
    if (result) {
      setAlertType("warning");
      setAlertText("You have deleted the report named " + report);
      window.setTimeout(() => setAlertText(false), 4000);
    }
    getUserReport();
  };

  const viewUserFile = async (file) => {
    dispatch(setLoader(true));
    // let loadTimer = setTimeout(() => timeoutHandler(), 30000);

    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/shapefile',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user/shapefile",
      { username: user.username }
    );
    const fileList = result.data.rows.filter((row) => row.file_name === file);
    const fileFeature = JSON.parse(
      JSON.parse(fileList[0].geometry.slice(1, -1))
    );
    // console.log(fileFeature);
    const newList = [fileFeature];
    const data = fileFeature.geometry;

    // For development on local server
    // const res = await axios.post('http://localhost:5000/data', { data });

    // For production on Heroku
    const res = await axios.post("https://sca-cpt-backend.herokuapp.com/data", {
      data,
    });
    const planArea = calculateArea(newList);
    dispatch(
      input_aoi({
        name: file,
        geometry: newList,
        hexagons: res.data.data,
        rawScore: aggregate(res.data.data, planArea),
        scaleScore: getStatus(aggregate(res.data.data, planArea)),
        speciesName: res.data.speciesName,
        id: uuid(),
      })
    );
    history.push("/map");
    dispatch(setLoader(false));
    // clearTimeout(loadTimer);
  };

  const viewUserReport = async (report) => {
    dispatch(setLoader(true));
    // let loadTimer = setTimeout(() => timeoutHandler(), 30000);

    // For development on local server
    // const result = await axios.post(
    //   'http://localhost:5000/user/report',
    //   { username: userLoggedIn }
    // );

    // For production on Heroku
    const result = await axios.post(
      "https://sca-cpt-backend.herokuapp.com/user/report",
      { username: user.username }
    );
    const reportList = result.data.rows.filter(
      (row) => row.report_name === report
    );
    const reportScript = reportList[0].script;
    setReportScript(reportScript);
    history.push("/user/report");
    dispatch(setLoader(false));
    // clearTimeout(loadTimer);
  };

  useEffect(() => {
    getUserData();
    getUserFile();
    getUserReport();
  }, [user.loggedIn]);

  useEffect(() => {
    getUserFile();
  }, [fileDeleted]);

  useEffect(() => {
    getUserReport();
  }, [reportDeleted]);

  if (user.loggedIn) {
    return (
      <Container>
        <Jumbotron>
          <h1 className="display-4">
            Welcome back, {user.firstName} {user.lastName}
          </h1>
          <p className="lead">
            Please review or modify your personal information here
          </p>
          <hr className="my-4" />
          <p className="h3">User Profile</p>
          <p>Your username: {user.username}</p>
          <p>Your email: {user.email}</p>
          <div className="d-flex justify-content-between btn-container">
            {user.admin && (
              <Button className="btn btn-success">Admin Module</Button>
            )}
            <Button className="btn btn-success" onClick={showUpdateInfo}>
              Update Information
            </Button>
            <Button className="btn btn-success" onClick={showUpdatePassword}>
              Change Password
            </Button>
            <Button className="btn btn-danger">Delete Account</Button>
          </div>

          <hr className="my-4" />
          <p className="h3">Saved Shapefiles</p>
          <br />
          {user.shapefileList.length > 0 ? (
            user.shapefileList.map((file) => (
              <div className="d-flex mb-2" key={uuid()}>
                <span className="mr-auto">{file}</span>
                <Button
                  className="btn btn-primary ml-2"
                  onClick={() => viewUserFile(file)}
                >
                  Add AOI to Map
                </Button>
                <Button
                  className="btn btn-danger ml-2"
                  onClick={() => {
                    deleteUserFile(file);
                    setFileDeleted(file);
                  }}
                >
                  Delete AOI
                </Button>
              </div>
            ))
          ) : (
            <p className="lead">No shapefile saved yet!</p>
          )}

          <hr className="my-4" />
          <p className="h3">Saved Reports</p>

          <br />
          {user.reportList.length > 0 ? (
            user.reportList.map((report) => (
              <div className="d-flex mb-2" key={uuid()}>
                <span className="mr-auto">{report}</span>
                <Button
                  className="btn btn-primary ml-2"
                  onClick={() => viewUserReport(report)}
                >
                  View Report
                </Button>
                <Button
                  className="btn btn-danger ml-2"
                  onClick={() => {
                    deleteUserReport(report);
                    setReportDeleted(report);
                  }}
                >
                  Delete Report
                </Button>
              </div>
            ))
          ) : (
            <p className="lead">No report saved yet!</p>
          )}

          <hr className="my-4" />
          <p className="h3">Saved Measures</p>
          <br />
          {lst.names.length > 1 ? (
            lst.names.map((value, indx) =>
              indx > 0 ? (
                <div className="d-flex mb-2" key={uuid()}>
                  <span className="mr-auto">{value.title}</span>
                  <Button
                    className="btn btn-primary ml-2"
                    onClick={(e) => {
                      dispatch(setCurrentWeight(value.title));
                      history.push("/user/measures");
                    }}
                  >
                    View Measure
                  </Button>
                  <Button
                    className="btn btn-danger ml-2"
                    onClick={() => {
                      dispatch(mutipleSavedWeightsDelete(indx));
                    }}
                  >
                    Delete Measure
                  </Button>
                </div>
              ) : (
                ""
              )
            )
          ) : (
            <p className="lead">No measures saved yet!</p>
          )}
        </Jumbotron>
        <Modal centered show={updateInfo} onHide={closeUpdateInfo} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Please enter your profile information here
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              Your Username:
              <input type="text" value={user.username} disabled></input>
              Your Email:
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              ></input>
              Your First Name:
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                required
              ></input>
              Your Last Name:
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                required
              ></input>
              <br />
              <div className="d-flex justify-content-between">
                <Button className="btn btn-warning" onClick={closeUpdateInfo}>
                  Cancel
                </Button>
                <Button className="btn btn-primary" onClick={updateUserInfo}>
                  Confirm
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          centered
          show={updatePassword}
          onHide={closeUpdatePassword}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Please enter your current and new passwords here
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              Your Username:
              <input type="text" value={user.username} disabled></input>
              Your Current Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
              Your New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              ></input>
              {/* Confirm Your New Password: 
              <input
                type="password"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                required>
              </input> */}
              <br />
              <div className="d-flex justify-content-between">
                <Button
                  className="btn btn-warning"
                  onClick={closeUpdatePassword}
                >
                  Cancel
                </Button>
                <Button
                  className="btn btn-primary"
                  onClick={updateUserPassword}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
};

export default UserData;
