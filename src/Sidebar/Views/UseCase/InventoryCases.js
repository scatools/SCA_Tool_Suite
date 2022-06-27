import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { MdAdsClick } from "react-icons/md";

const InventoryCases = ({ setView }) => {
  const history = useHistory();
  return (
    <div>
      <h4>Please click on the map to find related conservation plans to a specific Point of Interest</h4>
      <hr />
      <div className="d-flex justify-content-center">
        <MdAdsClick color="white" size={40} />
      </div>
      <hr />
      <h4>Or</h4>
      <hr />
      <Container className="d-flex flex-column justify-content-between" style={{height:"15vh"}}>
        <Button variant="outline-light" onClick={() => history.push("/plans")}>
          Browse the conservation plans in the entire Gulf Coast Region
        </Button>
        <Button variant="outline-light" onClick={() => {setView("add")}}>
          Identify the conservation plans within a certain Area of Interest
        </Button>
      </Container>
    </div>
  );
};

export default InventoryCases;
