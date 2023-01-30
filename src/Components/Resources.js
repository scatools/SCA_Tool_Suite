import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import { MdVideoLibrary } from "react-icons/md";
import { AiFillDatabase } from "react-icons/ai";
import { SiGitbook, SiGithub } from "react-icons/si";
import Microlink from '@microlink/react';

const Resources = () => {
  return (
    <div>
      <Container>
        <Jumbotron>
          <h2>Resources</h2>
          <p className="lead">
            Please utilize the following resources to know more about the 
            Strategic Conservation Assessment Tool
          </p>
          <hr />
          <div className="d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between">
              <p className="resources-block text-muted">
                <div>
                  <MdVideoLibrary size={25} /> &nbsp;
                  <b>Video Tutorial</b>
                </div>
                <Microlink
                  url="https://www.quest.fwrc.msstate.edu/sca/help-docs.php"
                  size="large"
                  setData={data => ({
                    ...data,
                    title: "Video Tutorial for Strategic Conservation Assessment Tool",
                    description: "Our tool comes with a tutorial to help the user fully understand the purpose, organization, and details of it."
                  })}
                />
              </p>
              <p className="resources-block text-muted">
                <div>
                  <AiFillDatabase size={25} /> &nbsp;
                  <b>Data Overview</b>
                </div>
                <Microlink
                  url="https://scholarsjunction.msstate.edu/cfr-publications/4/"
                  size="large"
                  setData={data => ({
                    ...data,
                    title: "Conservation Database for the Gulf Coast Region",
                    image: {url: "https://raw.githubusercontent.com/scatools/SCA_Tool_Suite/main/public/Scholars_Junction_Thumbnail.PNG"}
                  })}
                />
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="resources-block text-muted">
                <div>
                  <SiGitbook size={25} /> &nbsp;
                  <b>GitBook Documentation</b>
                </div>
                <Microlink
                  url="https://scatoolsuite.gitbook.io/sca-tool-suite/"
                  size="large"
                  setData={data => ({
                    ...data,
                    title: "Documentation for Strategic Conservation Assessment Tool",
                    description: "This document is a Technical Design Document for the Strategic Conservation Assessment (SCA) Tool.",
                    image: {url: "https://raw.githubusercontent.com/scatools/SCA_Tool_Suite/main/public/Gitbook_Thumbnail.png"},
                  })}
                />
              </p>
              <p className="resources-block text-muted">
                <div>
                  <SiGithub size={25} /> &nbsp;
                  <b>GitHub Repository</b>
                </div>
                <Microlink
                  url="https://github.com/scatools/SCA_Tool_Suite"
                  size="large"
                />  
              </p>
            </div>
          </div>
        </Jumbotron>
      </Container>
    </div>
  );
};

export default Resources;
