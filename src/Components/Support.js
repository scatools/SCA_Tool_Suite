import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import * as Survey from "survey-react";
import "survey-react/modern.css";

const Support = () => {
  Survey.StylesManager.applyTheme("modern");

  const json = {
    elements: [
      {
        type: "text",
        name: "name",
        title: "Please enter your name",
        isRequired: true,
      },
      {
        type: "text",
        name: "institution",
        title: "Please enter your institution",
        isRequired: false,
      },
      {
        type: "text",
        name: "email",
        title: "Please enter your Email",
        isRequired: true,
      },
      {
        type: "text",
        name: "feedback",
        title: "Please tell us any support you need or any feedback you have",
        isRequired: true,
      },
    ],
  };

  const onComplete = (survey, options) => {
    console.log("Survey results: " + JSON.stringify(survey.data));
    emailjs
      .send(
        "service_scagulf",
        "template_scagulf",
        survey.data,
        process.env.EMAILJS_USERID
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const model = new Survey.Model(json);

  return (
    <div>
      <Container>
        <Jumbotron>
          <h2>Support Ticket</h2>
          <p className="lead">
            Please open a support ticket or leave your feedback here
          </p>
          <hr />
          <Survey.Survey model={model} onComplete={onComplete} />
        </Jumbotron>
      </Container>
    </div>
  );
};

export default Support;
