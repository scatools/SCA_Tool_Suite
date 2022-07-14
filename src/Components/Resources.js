import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import { MdVideoLibrary } from "react-icons/md";
import { AiFillDatabase } from "react-icons/ai";
import { SiGitbook, SiGithub } from "react-icons/si";
import { LinkPreview } from '@dhaiwat10/react-link-preview';

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
                <LinkPreview 
                  url="https://www.quest.fwrc.msstate.edu/sca/help-docs.php"
                  descriptionLength={300}
                />
              </p>
              <p className="resources-block text-muted">
                <div>
                  <AiFillDatabase size={25} /> &nbsp;
                  <b>Data Overview</b>
                </div>
                <LinkPreview
                  url="https://scholarsjunction.msstate.edu/cfr-publications/4/"
                  descriptionLength={300}
                />
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="resources-block text-muted">
                <div>
                  <SiGitbook size={25} /> &nbsp;
                  <b>GitBook Documentation</b>
                </div>
                <LinkPreview
                  url="https://scatoolsuite.gitbook.io/sca-tool-suite/"
                  descriptionLength={300}
                />
              </p>
              <p className="resources-block text-muted">
                <div>
                  <SiGithub size={25} /> &nbsp;
                  <b>GitHub Repository</b>
                </div>
                <LinkPreview
                  url="https://github.com/scatools/SCA_Tool_Suite"
                  descriptionLength={300}
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
