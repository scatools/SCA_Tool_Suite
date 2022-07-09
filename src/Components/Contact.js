import React from "react";
import { Container, Jumbotron, Button } from "react-bootstrap";
import "survey-react/modern.css";

const Contact = () => {
  return (
    <div>
      <Container>
        <Jumbotron>
          <h2>Contact Us</h2>
          <p className="lead">
            Please contact our project managers for more information about SCA
            Project
          </p>
          <hr />
          <div className="d-flex">
            <div
              className="d-flex flex-column justify-content-between"
              style={{ width: "50%" }}
            >
              <b>Ione Anderson</b>
              <p className="text-muted my-1">Project Coordinator</p>
              <br />
              <br />
              <br />
              <Button
                className="btn-primary"
                style={{ width: "30%" }}
                href="mailto:ioneanderson@icloud.com"
              >
                Send Email
              </Button>
            </div>
            <div
              className="d-flex flex-column justify-content-between"
              style={{ width: "50%" }}
            >
              <b>Dr. Kristine Evans</b>
              <p className="text-muted my-1">Principal Investigator</p>
              <p className="text-muted my-1">
                Assistant Professor of Conservation Biology, Mississippi State
                University
              </p>
              <p className="text-muted my-1">
                Co-Director of the Quantitative Ecology and Spatial Technologies
                Lab (QuEST) Lab
              </p>
              <Button
                className="btn-primary"
                style={{ width: "30%" }}
                href="mailto:kristine.evans@msstate.edu"
              >
                Send Email
              </Button>
            </div>
          </div>
        </Jumbotron>
      </Container>
    </div>
  );
};

export default Contact;
