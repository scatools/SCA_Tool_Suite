import React from "react";
import { Button, Container } from "react-bootstrap";

const VisualizationByState = () => {
  return (
    <div>
      <h4>Please select one Gulf Coast State to visualize:</h4>
      <hr /><hr /><hr />
      <Container className="d-flex flex-column justify-content-between" style={{height:"50vh"}}>
        <Button variant="outline-light">
          Alabama
        </Button>
        <Button variant="outline-light">
          Florida
        </Button>
        <Button variant="outline-light">
          Louisiana
        </Button>
        <Button variant="outline-light">
          Mississippi
        </Button>
        <Button variant="outline-light">
          Texas
        </Button>
      </Container>
    </div>
  );
};

export default VisualizationByState;
