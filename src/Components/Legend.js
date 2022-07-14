import React from "react";
import { v4 as uuid } from "uuid";

const Legend = ({ aoiList, aoiColors, useCase, visualizationOpacity }) => {
  const legendOpacity = parseInt(visualizationOpacity) / 100;
  return (
    <div className="legend">
      {/* {aoiList.length > 0 && visualizationOpacity === 0 && (
     
      )} */}
      {useCase === "visualization" && visualizationOpacity > 0 ? (
        <>
          <div className="legend-title">Overall Score</div>
          <div className="legend-scale">
            <ul className="legend-labels">
              <li>
                <span
                  style={{ background: "#ffeda0", opacity: legendOpacity }}
                />
                {"< 0.1"}
              </li>
              <li>
                <span
                  style={{ background: "#f8d685", opacity: legendOpacity }}
                />
                0.1 ~ 0.2
              </li>
              <li>
                <span
                  style={{ background: "#f1bf6d", opacity: legendOpacity }}
                />
                0.2 ~ 0.3
              </li>
              <li>
                <span
                  style={{ background: "#eaa757", opacity: legendOpacity }}
                />
                0.3 ~ 0.4
              </li>
              <li>
                <span
                  style={{ background: "#e28e45", opacity: legendOpacity }}
                />
                0.4 ~ 0.5
              </li>
              <li>
                <span
                  style={{ background: "#db7537", opacity: legendOpacity }}
                />
                0.5 ~ 0.6
              </li>
              <li>
                <span
                  style={{ background: "#d2592e", opacity: legendOpacity }}
                />
                0.6 ~ 0.7
              </li>
              <li>
                <span
                  style={{ background: "#c83a28", opacity: legendOpacity }}
                />
                0.7 ~ 0.8
              </li>
              <li>
                <span
                  style={{ background: "#bd0026", opacity: legendOpacity }}
                />
                {"> 0.8"}
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="legend-title">Areas of Interest</div>
          <div className="legend-scale">
            <ul className="legend-labels">
              {aoiList.length > 0 &&
                aoiList.map((aoi, index) => (
                  <li id={uuid()}>
                    <span
                      style={{
                        background: aoiColors[index],
                        opacity: 0.5,
                      }}
                    />
                    {aoi.name}
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
export default Legend;
