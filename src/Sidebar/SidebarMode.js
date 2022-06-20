import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useSelector } from "react-redux";

const SidebarMode = ({ view, setView }) => {
  const aoi = useSelector((state) => state.aoi);

  return (
    <>
      {view != "selectUseCase" && (
        <ButtonGroup toggle className="d-flex justify-content-center">
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            name="add"
            value="add"
            checked={view === "add"}
            onChange={(e) => setView(e.currentTarget.value)}
          >
            Add New AOIs
          </ToggleButton>

          {Object.keys(aoi).length > 0 ? (
            <ToggleButton
              type="radio"
              variant="outline-secondary"
              name="list"
              value="list"
              checked={view === "list"}
              onChange={(e) => setView(e.currentTarget.value)}
            >
              Review/Edit Current AOIs
            </ToggleButton>
          ) : (
            <ToggleButton
              disabled
              type="radio"
              variant="outline-secondary"
              name="list"
              value="list"
              checked={view === "list"}
              onChange={(e) => setView(e.currentTarget.value)}
            >
              Review/Edit Current AOIs
            </ToggleButton>
          )}

          {Object.keys(aoi).length > 1 ? (
            <ToggleButton
              type="radio"
              variant="outline-secondary"
              name="assess"
              value="assess"
              checked={view === "assess"}
              onChange={(e) => setView(e.currentTarget.value)}
            >
              Evaluate AOIs
            </ToggleButton>
          ) : (
            <ToggleButton
              disabled
              type="radio"
              variant="outline-secondary"
              name="assess"
              value="assess"
              checked={view === "assess"}
              onChange={(e) => setView(e.currentTarget.value)}
            >
              Evaluate AOIs
            </ToggleButton>
          )}
        </ButtonGroup>
      )}
    </>
  );
};

export default SidebarMode;
