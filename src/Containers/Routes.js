import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
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
import AssessAOIView from "../Sidebar/Views/AssessAOI/AssessAOIView"

const Routes = ({
  setReportLink,
  setLoggedIn,
  userLoggedIn,
  setUserLoggedIn,
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

  const [visualizationSource, setVisualizationSource] = useState(null);
  const [visualizationLayer, setVisualizationLayer] = useState(null);
  const [visualizationFillColor, setVisualizationFillColor] = useState(null);
  const [visualizationOpacity, setVisualizationOpacity] = useState(0);
  const [visualizationScale, setVisualizationScale] = useState(null);

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Homepage setUseCase={setUseCase} setView={setView}/>
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
          {(userLoggedIn !== null)
          ?
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
          :
            <Redirect to="/login" />
          }
        </Route>
        <Route exact path="/user/report">
          <UserReport reportScript={reportScript} />
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
        <Route exact path="/user/measures">
          <div className="userMeasures">
           <AssessAOIView
              useCase={useCase}
              userLoggedIn={userLoggedIn}
              aoiAssembled={aoiAssembled}
              setAoiAssembled={setAoiAssembled}
              customizedMeasures={customizedMeasures}
              visualizationScale={visualizationScale}
              setVisualizationSource={setVisualizationSource}
              setVisualizationLayer={setVisualizationLayer}
              setVisualizationFillColor={setVisualizationFillColor}
              setVisualizationOpacity={setVisualizationOpacity}
              setView={setView}
              setAlertText={setAlertText}
              setAlertType={setAlertType}
              
        />
        </div>
        </Route>
        <Route exact path="/help">
          <Help />
        </Route>
        <Route exact path="/plans">
          <PlanTable />
        </Route>
        <Route path="/plan/:planId" children={<PlanDetail />}/>
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
