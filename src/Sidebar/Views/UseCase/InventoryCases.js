import React from "react";
import { Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const InventoryCases = ({ setView }) => {
  const history = useHistory();
  return (
    <div>
      <h4>On which scale would you like to search for related conservation plans?</h4>
      <hr /><hr /><hr />
      <Container className="d-flex flex-column justify-content-between" style={{height:"50vh"}}>
        <Button variant="outline-light" onClick={() => history.push("/plans")}>
          I would like to go through the conservation plans in the entire Gulf Coast Region
        </Button>
        <Button variant="outline-light" onClick={() => {setView("add")}}>
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
