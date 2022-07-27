import React from "react";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";

// React-Bootstrap doesn't handle the respnsiveness correctly for this use case for larger screens
const Homepage = ({ setUseCase, setView }) => {
  const navigate = useHistory();
  const routeChange = (useCase) => {
    let path = `/tool`;
    navigate.push(path);
    setUseCase(useCase);
    setView("selectUseCase");
  };
  const homePageCards = [
    {
      title: "Search for Conservation Plans",
      about: `The Inventory of Plans assesses priorities and ongoing efforts involving land conservation 
				throughout the region. Out of 352 plans assessed 293 have a component of land conservation. Discover 
				plans that are organized by geography: State, County, Watershed and Region-wide. Users can also sort 
				these plans by time-frame and by priority interests (Water quality, Habitat, Resources/ Species, 
				Community Resilience, Ecosystem Resilience, and Gulf Economy). Additional details are provided for 
				sorting that include: a Y/N toggle allowing users to identify which land conservation strategies 
				(if any) are identified within the plan (Acquisition, Easement, and/or Stewardship); and Metrics of 
				Success. Each contains a link to the plan on the web.`,
      imgSrc: "/CIT.png",
      useCase: "inventory",
    },
    {
      title: "Evaluate a Set of AOIs",
      about: `Analyzing the most common geographically variable inputs requires geospatial intelligence. 
					This intelligence is stored in spatial data layers that can be accessed through a web browser with 
					little (to no) technical training. The CPT provides the underlying algorithms to support procedures 
					for determining and comparing the relative benefits and co-benefits of different investment scenarios 
					of strategic resources (time, energy and/or money) in conserved land. Telling the story behind a 
					location requires telling the story behind the raw data. Local insight into how to interpret raw 
					data available has been gathered and turned into “measures of benefit”. The measures can be used to 
					identify potential areas for land conservation projects, and serve as a common starting point for all 
					stakeholders in the region looking to expand the network of conservation areas to ensure healthy 
					landscapes that support the environment and culture of the region and the diverse socio-economic 
					services provided by the Gulf of Mexico ecosystem.`,
      imgSrc: "/CPT.png",
      useCase: "prioritization",
    },
    {
      title: "Create Visualization for a Certain Area",
      about: `From this tool, whereas with picking a site or comparing two sites for any number of reasons, 
					a report would be generated after to give some insight to that location. With the visualization tool, 
					this can be reversed. Users can access a library of acquired and managed geospatial data, a series of 
					automated workflows, and rigorous analytical capacity to put that data into proper context to be 
					visualized naturally, on a map. Here with the visualization tool, a user can receive a clear translation 
					of data. An implementer of conservation land projects can first understand where there are possible 
					opportunities located and find the site that maximizes alignment with strategic priorities. Our 
					visualization tool allows the user to compare across a wide geographic area and find the perfect location.`,
      imgSrc: "/CVT.png",
      useCase: "visualization",
    },
  ];
  return (
    <div
      className="home-page-wrapper"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1
        style={{
          marginTop: "2rem",
          textAlign: "center",
          padding: "0px 20px",
          fontSize: "2.5em",
          fontWeight: "400",
        }}
      >
        Welcome to the Strategic Conservation Assessment Tool
      </h1>
      <h3
        style={{
          color: "#7a7a7a",
          fontSize: "1.55em",
          fontWeight: "normal",
          maxWidth: "50em",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Below are the three starting pathways for the SCA Tool. Choose one to
        begin.
      </h3>
      <div
        className="card-home-holder"
        style={{
          display: "flex",
          margin: "auto",
          gap: "4em",
          padding: "0px 20px",
        }}
      >
        {homePageCards.map((card) => {
          return (
            <Card
              key={card.title}
              className="card-home"
              style={{ width: "20em", height: "25em" }}
              onClick={() => routeChange(card.useCase)}
            >
              <div className="card-home-container">
                <img className="card-home-background" src={card.imgSrc} />
                <h2 className="card-home-title">{card.title}</h2>
              </div>
              <div className="card-home-description-container">
                <h5 style={{ fontSize: "1.25em" }}>About This Pathway</h5>
                <p>{card.about}</p>
              </div>
            </Card>
          );
        })}
      </div>
      <hr />
      <h6 style={{ textAlign: "center" }}>BROUGHT TO YOU BY</h6>
      <div className="logo-container-homepage">
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
          <img className="logo" src="/Logo_FWRC.png" alt="fwrc msu logo" />
        </a>
        <a href="https://www.fws.gov/" rel="noreferrer" target="_blank">
          <img className="logo" src="/Logo_USFWS.png" alt="fws logo" />
        </a>
      </div>
    </div>
  );
};

export default Homepage;
