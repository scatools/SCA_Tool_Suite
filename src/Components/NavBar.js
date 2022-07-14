import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

const NavBar = ({ reportLink, loggedIn, userLoggedIn }) => {
  const assessment = useSelector((state) => state.assessment);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user = useSelector((state) => state.user);
  const [height, setHeight] = useState(0);

  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  })

  return (
    <div>
      <Navbar bg="dark" variant="dark" fixed="top" ref={ref}>
        <Navbar.Brand>
          <NavLink to="/" style={{ color: "white", textDecoration: "None" }}>
            Strategic Conservation Assessment Tool
          </NavLink>
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink to="/" className="ml-3 mt-2" onClick={handleShow}>
              About
            </NavLink>
            <NavLink to="/tool" className="ml-3 mt-2">
              Map
            </NavLink>
            <NavLink to="/plans" className="ml-3 mt-2">
              Plans
            </NavLink>
            {reportLink && (
              <NavLink to="/report" className="ml-3 mt-2">
                Report
              </NavLink>
            )}
            {assessment.hasOwnProperty("aoi") && (
              <NavLink to="/assessment" className="ml-3 mt-2">
                Assessment
              </NavLink>
            )}
            <NavLink to="/help" className="ml-3 mt-2">
              Support
            </NavLink>
            <NavDropdown title="More" className="ml-3">
              <NavDropdown.Item
                href="https://www.quest.fwrc.msstate.edu/sca/about-the-project.php"
                target="_blank"
              >
                Strategic Conservation Assessment (SCA) Project
              </NavDropdown.Item>
            </NavDropdown>
            {user.loggedIn ? (
              <div className="nav-right">
                <NavLink to="/user" className="ml-3 mt-2 login">
                  {user.username}
                </NavLink>
                <NavLink to="/logout" className="ml-3 mt-2 login">
                  Log Out
                </NavLink>
              </div>
            ) : (
              <div className="nav-right">
                <NavLink to="/login" className="ml-3 mt-2 login">
                  Log In
                </NavLink>
                <NavLink to="/register" className="ml-3 mt-2 register">
                  Register
                </NavLink>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
        
      </Navbar>

      <div id="filler" style={{height:height}}></div>

      <div className="content">
        <Modal centered show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Welcome to the Strategic Conservation Assessment Tool
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <b>Introduction</b>
            <br />
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Strategic Conservation Assessment 
              project provides this tool to assist land conservation planners in
              <ul>
                <li>understanding existing priorities of conservation plans</li>
                <li>evaluating ecological and socioeconomic co‐benefits of proposed land conservation projects</li>
                <li>prioritizing areas for land conservation within the U.S. Gulf of Mexico coastal region</li>
              </ul>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Strategic Conservation Assessment
              Tool is a flexible, data‐driven framework that allows users to 
              explore benefits of land conservation under their own priorities.
            </p>
            <b>Intended Use</b>
            <br />
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Strategic Conservation Assessment
              Tool is not intended to be prescriptive. Instead this tool is
              designed to provide data to support conservation planning efforts
              across the Gulf Coast Region. All users should acknowledge that the 
              models and algorithms adopted in this tool are intended to explore 
              ecological and socioeconomic co-benefits of proposed areas of land 
              conservation, and should not be used in a decision-making context. 
              The flexibility of this tool enables a user to evaluate conservation 
              alternatives using either a multi-criteria decision analysis (MCDA) 
              framework, or user-defined values.
            </p>
            <b>Sponsorship</b>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Funding for this project was
              provided by the
              <a
                href="https://www.restorethegulf.gov/"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Gulf Coast Ecosystem Restoration Council{" "}
              </a>
              through an agreement (NO. F17AC00267) with the
              <a href="https://www.fws.gov/" target="_blank" rel="noreferrer">
                {" "}
                U.S. Fish and Wildlife Service{" "}
              </a>
              , and was produced with support from the
              <a
                href="https://www.fwrc.msstate.edu/"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Forest and Wildlife Research Center{" "}
              </a>
              at Mississippi State University. The findings and conclusions in
              this tool are those of the authors and do not necessarily
              represent the views of the U.S. Fish and Wildlife Service or Gulf
              Coast Ecosystem Restoration Council.
            </p>
            <div className="logo-container">
              <a
                href="https://www.restorethegulf.gov/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="logo"
                  src="/Logo_RESTORE.png"
                  alt="restore council logo"
                />
              </a>
              <a
                href="https://www.fwrc.msstate.edu/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="logo"
                  src="/Logo_FWRC.png"
                  alt="fwrc msu logo"
                />
              </a>
              <a
                href="https://www.fws.gov/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="logo"
                  src="/Logo_USFWS.png"
                  alt="fws logo"
                />
              </a>
            </div>
            <br />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default NavBar;
