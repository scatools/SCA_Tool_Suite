import React, { useState } from "react";
import "./App.css";
import NavBar from "./NavBar";
import Routes from "./Routes";
import LoadingOverlay from "react-loading-overlay";
import { connect } from "react-redux";
import Homepage from "./Homepage";

function App(props) {
  const [reportLink, setReportLink] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);

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
      <div className="App" style={{minHeight:"100vh", display:"flex", flexDirection:"column"}}>
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
