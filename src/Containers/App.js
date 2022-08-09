import React, { useState, useEffect } from "react";
import "../App.css";
import NavBar from "../Components/NavBar";
import Routes from "./Routes";
import LoadingOverlay from "react-loading-overlay";
import { connect, useDispatch, useSelector } from "react-redux";
import { getWeightsThunk } from "../Redux/thunk";

function App(props) {
  const [reportLink, setReportLink] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const logIn = useSelector((state) => state.user.loggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (logIn === true) {
      dispatch(getWeightsThunk);
    }
  }, [logIn]);
  return (
    <LoadingOverlay
      className="myLoading"
      active={props.isActive}
      styles={{
        overlay: (base) => ({
          ...base,
          position: "fixed",
        }),
      }}
      spinner
      text="Loading..."
    >
      <div
        className="App"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <NavBar
          reportLink={reportLink}
          loggedIn={loggedIn}
          userLoggedIn={userLoggedIn}
        />
        <Routes
          setReportLink={setReportLink}
          setLoggedIn={setLoggedIn}
          userLoggedIn={userLoggedIn}
          setUserLoggedIn={setUserLoggedIn}
        />
      </div>
    </LoadingOverlay>
  );
}

const mapStateToProps = (state) => {
  return {
    isActive: state.loading.isLoading,
  };
};

export default connect(mapStateToProps)(App);
