import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
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
import ForgotPassword from "../User/ForgotPassword";

const Routes = ({
  setReportLink,
  setLoggedIn,
  setUserLoggedIn
}) => {
  const [aoiSelected, setAoiSelected] = useState(null);
  const [aoiAssembled, setAoiAssembled] = useState([]);
  const [customizedMeasures] = useState({
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
  const [useCase, setUseCase] = useState(null);
  const [assessStep, setAssessStep] = useState("selectAOI");
  const userLoggedIn = useSelector((state) => state.user.loggedIn);

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Homepage setUseCase={setUseCase} setView={setView} />
        </Route>
        <Route exact path="/forgotPassword">
          <ForgotPassword
              setAlertText={setAlertText}
              setAlertType={setAlertType}
            />
        </Route>
        <Route exact path="/tool">
          <Main
            useCase={useCase}
            setUseCase={setUseCase}
            aoiSelected={aoiSelected}
            setAoiSelected={setAoiSelected}
            aoiAssembled={aoiAssembled}
            setAoiAssembled={setAoiAssembled}
            setReportLink={setReportLink}
            customizedMeasures={customizedMeasures}
            userLoggedIn={userLoggedIn}
            view={view}
            setView={setView}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            assessStep={assessStep}
            setAssessStep={setAssessStep}
          />
        </Route>
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
          {(userLoggedIn !== false && userLoggedIn !== null) ? (
            <UserData
              userLoggedIn={userLoggedIn}
              setReportScript={setReportScript}
              setAlertText={setAlertText}
              setAlertType={setAlertType}
              useCase={useCase}
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
              useCase={useCase}
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
              aoiAssembled={aoiAssembled}
              setAoiSelected={setAoiSelected}
              setReportLink={setReportLink}
              customizedMeasures={customizedMeasures}
              userLoggedIn={userLoggedIn}
              setAlertText={setAlertText}
              setAlertType={setAlertType}
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
