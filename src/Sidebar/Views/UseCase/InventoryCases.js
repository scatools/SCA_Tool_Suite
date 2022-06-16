import React from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";

const InventoryCases = () => {
  return (
    <div>
      <h4>On which scale would you like to search for related conservation plans?</h4>
      <hr /><hr /><hr />
      <Container className="d-flex flex-column justify-content-between" style={{height:"50vh"}}>
        <Button variant="outline-light">
          I would like to go through the conservation plans in the entire Gulf Coast Region
        </Button>
        <Button variant="outline-light">
          I would like to identify the conservation plans within a certain Area of Interest
        </Button>
        <Button variant="outline-light">
          I would like to identify the conservation plans from a certain Point of Interest
        </Button>
      </Container>
    </div>
  );
};

export default InventoryCases;
