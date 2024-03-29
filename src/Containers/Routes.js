import React, { useState } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import Main from "./Main";
import Homepage from "../Components/Homepage";
import Resources from "../Components/Resources";
import Support from "../Components/Support";
import Contact from "../Components/Contact";
import Report from "../Assessment/Report";
import Assessment from "../Assessment/Assessment";
import PlanTable from "../Plans/PlanTable";
import PlanDetail from "../Plans/PlanDetail";
import Login from "../User/Login";
import Logout from "../User/Logout";
import Register from "../User/Register";
import UserData from "../User/UserData";
import UserReport from "../User/UserReport";
import AssessAOIView from "../Sidebar/Views/AssessAOI/AssessAOIView";
import { useSelector } from "react-redux";

const Routes = ({
  setReportLink,
  setLoggedIn,
  userLoggedIn,
  setUserLoggedIn,
  setLargeAoiProgress,
}) => {
  const [aoiSelected, setAoiSelected] = useState(null);
  const [aoiAssembled, setAoiAssembled] = useState([]);
  const [customizedMeasures, setCustomizedMeasures] = useState({
    hab: [],
    wq: [],
    lcmr: [],
    cl: [],
    eco: [],
  });
  const [view, setView] = useState("add");
  const [reportScript, setReportScript] = useState("");
  const [alertText, setAlertText] = useState(false);
  const [alertType, setAlertType] = useState("danger");
  const [assessStep, setAssessStep] = useState("selectAOI");
  const useCase = useSelector((state) => state.usecase.useCase);
  const url = useLocation();

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Homepage setView={setView} />
        </Route>
        {!!useCase ? (
          <Route exact path="/tool">
            <Main
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              aoiAssembled={aoiAssembled}
              setAoiAssembled={setAoiAssembled}
              setReportLink={setReportLink}
              customizedMeasures={customizedMeasures}
              setCustomizedMeasures={setCustomizedMeasures}
              userLoggedIn={userLoggedIn}
              view={view}
              setView={setView}
              setAlertText={setAlertText}
              setAlertType={setAlertType}
              assessStep={assessStep}
              setAssessStep={setAssessStep}
              setLargeAoiProgress={setLargeAoiProgress}
            />
          </Route>
        ) : (
          !useCase &&
          url.pathname === "/tool" && (
            <Route>
              <Redirect to="/" />
            </Route>
          )
        )}
        <Route exact path="/register">
          <Register
            setLoggedIn={setLoggedIn}
            setUserLoggedIn={setUserLoggedIn}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
          />
        </Route>
        <Route exact path="/login">
          <Login
            setLoggedIn={setLoggedIn}
            setUserLoggedIn={setUserLoggedIn}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
          />
        </Route>
        <Route exact path="/logout">
          <Logout setLoggedIn={setLoggedIn} setUserLoggedIn={setUserLoggedIn} />
        </Route>
        <Route exact path="/user">
          {userLoggedIn !== null ? (
            <UserData
              userLoggedIn={userLoggedIn}
              setReportScript={setReportScript}
              setAlertText={setAlertText}
              setAlertType={setAlertType}
              aoiAssembled={aoiAssembled}
              setAoiAssembled={setAoiAssembled}
              customizedMeasures={customizedMeasures}
              setView={setView}
            />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/user/report">
          <UserReport reportScript={reportScript} />
        </Route>
        <Route exact path="/user/measures">
          <div className="userMeasures">
            <AssessAOIView
              userLoggedIn={userLoggedIn}
              aoiAssembled={aoiAssembled}
              setAoiAssembled={setAoiAssembled}
              customizedMeasures={customizedMeasures}
              visualizationScale={null}
              setVisualizationSource={null}
              setVisualizationLayer={null}
              setVisualizaitonHighlight={null}
              setVisualizationFillColor={null}
              setVisualizationOpacity={0}
              setView={setView}
              setAlertText={setAlertText}
              setAlertType={setAlertType}
              assessStep={assessStep}
              setAssessStep={setAssessStep}
            />
          </div>
        </Route>
        <Route exact path="/resources">
          <Resources />
        </Route>
        <Route exact path="/support">
          <Support />
        </Route>
        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route exact path="/plans">
          <PlanTable setAlertText={setAlertText} setAlertType={setAlertType} />
        </Route>
        <Route path="/plan/:planId" children={<PlanDetail />} />
        <Route exact path="/report">
          <Report
            aoiSelected={aoiSelected}
            userLoggedIn={userLoggedIn}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
          />
        </Route>
        {aoiAssembled && aoiAssembled.length ? (
          <Route exact path="/assessment">
            <Assessment
              setView={setView}
              aoiAssembled={aoiAssembled}
              setAoiSelected={setAoiSelected}
              setReportLink={setReportLink}
              customizedMeasures={customizedMeasures}
              userLoggedIn={userLoggedIn}
              setAlertText={setAlertText}
              setAlertType={setAlertType}
              setAssessStep={setAssessStep}
            />
          </Route>
        ) : (
          <Route>
            <Redirect to="/" />
          </Route>
        )}
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
      {alertText && (
        <Alert
          className="mt-4"
          variant={alertType}
          onClose={() => setAlertText(false)}
          dismissible
        >
          {alertType === "danger" && (
            <>
              <Alert.Heading>An error occurred!</Alert.Heading>
              <p>{alertText}</p>
            </>
          )}
          {alertType === "warning" && (
            <>
              <Alert.Heading>Attention!</Alert.Heading>
              <p>{alertText}</p>
            </>
          )}
          {alertType === "success" && (
            <>
              <Alert.Heading>Successfully processed!</Alert.Heading>
              <p>{alertText}</p>
            </>
          )}
        </Alert>
      )}
    </>
  );
};

export default Routes;
