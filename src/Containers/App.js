import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import axios from "axios";
import Routes from "./Routes";
import NavBar from "../Components/NavBar";
import { getWeightsThunk, loginUserThunk } from "../Redux/thunk"
import { auth, onAuthStateChanged } from "../Auth/firebase";
import "../App.css";

function App(props) {
  const [reportLink, setReportLink] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const logIn = useSelector((state) => (state.user.loggedIn));
  const [finishLoad, setFinishLoad] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const trackUser = async () => {
      if (logIn === true) {
        await dispatch(loginUserThunk);
        dispatch(getWeightsThunk);
      };
    };
    trackUser();
  },[logIn]);
  
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await dispatch(loginUserThunk);
        } catch (error) {
          console.log(error);
        };
      };
      setFinishLoad(false);
    });
  }, []);

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
        {(finishLoad !== true) ?
        <>
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
        </>
        : ""}
      </div>
    </LoadingOverlay>
  );
};

const mapStateToProps = (state) => {
  return {
    isActive: state.loading.isLoading,
  };
};

export default connect(mapStateToProps)(App);
