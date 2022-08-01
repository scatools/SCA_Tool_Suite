import React, { useState, useRef, useEffect } from "react";
import MapGL, { Source, Layer, Popup } from "react-map-gl";
import { Editor, EditingMode } from "react-map-gl-draw";
import MultiSwitch from "react-multi-switch-toggle";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FiMap } from "react-icons/fi";
import "mapbox-gl/dist/mapbox-gl.css";
import bbox from "@turf/bbox";
import shp from "shpjs";
import Legend from "../Components/Legend";
import TableContainer from "../Plans/TableContainer";
import { getFeatureStyle, getEditHandleStyle } from "./drawStyle";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Map = ({
  mapRef,
  useCase,
  drawingMode,
  setFeatureList,
  aoiSelected,
  setAoiSelected,
  editAOI,
  hucBoundary,
  hucIDSelected,
  filterList,
  mode,
  setMode,
  interactiveLayerIds,
  setInteractiveLayerIds,
  autoDraw,
  hexGrid,
  hexDeselection,
  hexIDDeselected,
  hexFilterList,
  visualizationSource,
  visualizationLayer,
  visualizationFillColor,
  visualizationOpacity,
  showTableContainer,
  setShowTableContainer,
  zoom,
  setZoom,
  viewport,
  setViewport,
  setInstruction,
}) => {
  const [selectBasemap, setSelectBasemap] = useState(false);
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [selectedSwitch, setSelectedSwitch] = useState(0);
  const [coordinates, setCoordinates] = useState([undefined, undefined]);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const [hucData, setHucData] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [hoveredGeometry, setHoveredGeometry] = useState(null);
  const [clickedProperty, setClickedProperty] = useState(null);
  const [filter, setFilter] = useState(["in", "HUC12", "default"]);
  const [hexFilter, setHexFilter] = useState(["in", "objectid", "default"]);
  const editorRef = useRef(null);

  // Up to 10 colors for 10 different AOIs
  const aoiColors = [
    "#00188f",
    "#00bcf2",
    "#00b294",
    "#009e49",
    "#bad80a",
    "#fff100",
    "#ff8c00",
    "#e81123",
    "#ec008c",
    "#68217a",
  ];

  const aoiFullList = Object.values(useSelector((state) => state.aoi));

  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );

  const getCursor = ({ isHovering, isDragging }) => {
    return isDragging ? "grabbing" : isHovering ? "crosshair" : "default";
  };

  const onHover = (e) => {
    setHovered(true);
    if (e.features) {
      const featureHovered = e.features[0];
      if (featureHovered) {
        setHoveredProperty(featureHovered.properties);
        setHoveredGeometry(featureHovered.geometry);
      }
    }
  };

  const onClick = (e) => {
    if (
      useCase === "inventory" &&
      !aoiSelected &&
      !drawingMode &&
      !hucBoundary &&
      !hexGrid
    ) {
      setInteractiveLayerIds([]);
      setCoordinates(e.lngLat);
      setShowTableContainer(true);
    } else if (useCase === "inventory" && aoiSelected != false) {
      setCoordinates([undefined, undefined]);
    }

    if (e.features) {
      const featureClicked = e.features[0];
      if (featureClicked) {
        setClickedProperty(featureClicked.properties);
      }
    }
  };

  const onDelete = () => {
    const selectedIndex = selectedFeatureIndex;
    if (selectedIndex !== null && selectedIndex >= 0) {
      editorRef.current.deleteFeatures(selectedIndex);
    }
  };

  const onUpdate = ({ editType }) => {
    if (editType === "addFeature") {
      setMode(new EditingMode());
    }
  };

  const onViewStateChange = (e) => {
    setZoom(e.viewState.zoom.toFixed(1));
  };

  const onToggle = (value) => {
    setSelectedSwitch(value);
    if (value === 0) {
      setBasemapStyle("light-v10");
    } else if (value === 1) {
      setBasemapStyle("dark-v10");
    } else if (value === 2) {
      setBasemapStyle("satellite-v9");
    } else if (value === 3) {
      setBasemapStyle("outdoors-v11");
    }
  };

  const onSelect = (options) => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);
  };

  const renderDrawTools = () => {
    // Copy from mapbox
    return (
      <div className="mapboxgl-ctrl-top-right">
        <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
            title="Polygon tool (p)"
            onClick={autoDraw}
          />

          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
            title="Delete"
            onClick={onDelete}
          />
        </div>
      </div>
    );
  };

  const renderPopup = () => {
    var aoiBbox = bbox({
      type: "Feature",
      geometry: hoveredGeometry,
    });
    var popupLongitude = (aoiBbox[0] + aoiBbox[2]) / 2;
    var popupLatitude = (aoiBbox[1] + aoiBbox[3]) / 2;

    // Use HUC12 as the unique property to filter out undesired layer
    if (popupLongitude && popupLatitude && hoveredProperty.HUC12) {
      return (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupLongitude}
          latitude={popupLatitude}
          closeOnClick={false}
        >
          <div>
            <p>
              <span>
                <b>ID:</b>
              </span>
              {hoveredProperty.HUC12 && <span> {hoveredProperty.HUC12} </span>}
            </p>
            <p>
              <span>
                <b>Name:</b>
              </span>
              {hoveredProperty.NAME && <span> {hoveredProperty.NAME} </span>}
            </p>
          </div>
        </Popup>
      );
    }
  };

  const loadHucBoundary = () => {
    fetch("HUC12_SCA.zip")
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        shp(arrayBuffer).then(function (geojson) {
          setHucData(geojson);
        });
      });
  };

  const renderHexGrid = () => {
    const hexFeatureList = aoiList[0].hexagons.map((hex) => {
      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: { gid: hex.gid, objectid: hex.objectid },
      };
    });
    const hexData = {
      type: "FeatureCollection",
      features: hexFeatureList,
    };
    return (
      <Source type="geojson" data={hexData}>
        <Layer
          id="hex"
          type="fill"
          paint={{
            "fill-outline-color": "#484896",
            "fill-color": "#6e599f",
            "fill-opacity": 0.2,
          }}
        />

        {hexFilterList.map((filter) => (
          <Layer
            id={filter[2]}
            type="fill"
            paint={{
              "fill-outline-color": "red",
              "fill-color": "red",
              "fill-opacity": 0.2,
            }}
            filter={filter}
          />
        ))}
      </Source>
    );
  };

  const renderVisualization = () => {
    return (
      <>
        <Source {...visualizationSource}>
          <Layer
            {...visualizationLayer}
            paint={{
              "fill-color": visualizationFillColor,
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                parseInt(visualizationOpacity) / 100,
              ],
            }}
          />
          {/* <Layer {...gcrVisualizationHighlight} filter={filter} /> */}
        </Source>
        <Legend
          aoiList={[]}
          aoiColors={[]}
          useCase={useCase}
          visualizationOpacity={visualizationOpacity}
        ></Legend>
      </>
    );
  };

  useEffect(() => {
    if (editorRef.current) {
      const featureList = editorRef.current.getFeatures();
      setFeatureList(featureList);
    }
  });

  useEffect(() => {
    if (!drawingMode && editorRef.current) {
      const featureList = editorRef.current.getFeatures();
      const featureListIdx = featureList.map((feature, idx) => idx);
      setFeatureList([]);
      if (featureListIdx.length > 0) {
        editorRef.current.deleteFeatures(featureListIdx);
      }
    }
  }, [drawingMode, setFeatureList]);

  useEffect(() => {
    if (
      editAOI &&
      aoiSelected &&
      drawingMode &&
      editorRef.current.getFeatures().length === 0
    ) {
      editorRef.current.addFeatures(aoiList[0].geometry);
    }
  }, [editAOI, aoiList, drawingMode, aoiSelected]);

  useEffect(() => {
    if (hucBoundary) {
      setInteractiveLayerIds(["huc"]);
    } else if (hexGrid && hexDeselection) {
      setInteractiveLayerIds(["hex"]);
    } else if (!drawingMode) {
      setInteractiveLayerIds([]);
    }
  }, [
    drawingMode,
    hexDeselection,
    hexGrid,
    hucBoundary,
    setInteractiveLayerIds,
  ]);

  useEffect(() => {
    if (clickedProperty) {
      // For HUC-12 boundary layer, same watershed area won't be counted twice
      if (
        clickedProperty.HUC12 &&
        !hucIDSelected.includes(clickedProperty.HUC12)
      ) {
        // Array hucIDSelected is stored in a format like [{value: 'xx', label: 'xx'}]
        hucIDSelected.push({
          value: clickedProperty.HUC12,
          label: clickedProperty.HUC12,
        });
        setFilter(["in", "HUC12", clickedProperty.HUC12]);
      }
      // console.log(hucIDSelected);

      // For hex grid layer, same hexagon won't be counted twice
      if (
        clickedProperty.objectid &&
        !hexIDDeselected.includes(clickedProperty.objectid)
      ) {
        // Array hexIDDeselected is stored in a simple array format
        hexIDDeselected.push(clickedProperty.objectid);
        // console.log(hexIDDeselected);
        setHexFilter(["in", "objectid", clickedProperty.objectid]);
      }
    }
  }, [clickedProperty, hexIDDeselected, hucIDSelected]);

  useEffect(() => {
    filterList.push(filter);
    // console.log(filterList);
  }, [filter, filterList]);

  useEffect(() => {
    hexFilterList.push(hexFilter);
    // console.log(hexFilterList);
  }, [hexFilter, hexFilterList]);

  useEffect(() => {
    if (zoom >= 10) {
      setInstruction(
        "Click to explore the details of a single hexagonal area."
      );
    } else {
      setInstruction(
        "Please zoom in to level 10 to explore the details of a single hexagonal area."
      );
    }
  }, [zoom]);

  return (
    <>
      <Button
        className="basemapButton"
        variant="secondary"
        onClick={() => setSelectBasemap(!selectBasemap)}
      >
        <FiMap />
      </Button>
      {selectBasemap && (
        <div className="basemapSwitch">
          <MultiSwitch
            texts={["Light", "Dark", "Satellite", "Terrain", ""]}
            selectedSwitch={selectedSwitch}
            bgColor={"gray"}
            onToggleCallback={onToggle}
            height={"38px"}
            fontSize={"15px"}
            fontColor={"white"}
            selectedFontColor={"#6e599f"}
            selectedSwitchColor={"white"}
            borderWidth={0}
            eachSwitchWidth={80}
          />
        </div>
      )}
      {showTableContainer && (
        <TableContainer
          coordinates={coordinates}
          aoiSelected={aoiSelected}
          setShowTableContainer={setShowTableContainer}
        />
      )}
      <MapGL
        {...viewport}
        ref={mapRef}
        width="100vw"
        height="94.3vh"
        style={{ position: "fixed" }}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/mapbox/" + basemapStyle}
        getCursor={getCursor}
        onLoad={loadHucBoundary}
        onHover={onHover}
        onClick={onClick}
        onViewStateChange={onViewStateChange}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        interactiveLayerIds={interactiveLayerIds}
        preserveDrawingBuffer={true}
      >
        <Editor
          ref={editorRef}
          style={{ width: "100%", height: "100%" }}
          clickRadius={12}
          mode={mode}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editHandleShape={"circle"}
          featureStyle={getFeatureStyle}
          editHandleStyle={getEditHandleStyle}
        />
        {!hucBoundary && (
          <Source
            type="vector"
            url="mapbox://chuck0520.bardd4y7"
            maxzoom={22}
            minzoom={0}
          >
            <Layer
              id="sca-boundary"
              source-layer="SCA_Boundry-13ifc0"
              type="fill"
              paint={{
                "fill-outline-color": "#484896",
                "fill-color": "#6e599f",
                "fill-opacity": 0.2,
              }}
              minzoom={0}
              maxzoom={22}
            />
          </Source>
        )}
        {aoiFullList.length > 0 &&
          !hucBoundary &&
          visualizationOpacity === 0 &&
          aoiFullList.map((aoi, index) => (
            <>
              <Source
                type="geojson"
                data={{
                  type: "FeatureCollection",
                  features: aoi.geometry,
                }}
              >
                {aoi.id && (
                  <Layer
                    key={aoi.id}
                    id={aoi.id}
                    type="fill"
                    paint={{
                      "fill-color": aoiColors[index],
                      "fill-opacity": 0.5,
                    }}
                  />
                )}
              </Source>
              <Legend
                aoiList={aoiFullList}
                aoiColors={aoiColors}
                useCase={null}
                visualizationOpacity={0}
              ></Legend>
            </>
          ))}
        {aoiList.length > 0 && !drawingMode && !hucBoundary && (
          <Source
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: aoiList[0].geometry,
            }}
          >
            <Layer
              id="data"
              type="fill"
              paint={{
                "fill-color": "transparent",
                "fill-outline-color": "white",
              }}
            />
          </Source>
        )}
        {hucBoundary && hucData && (
          <Source type="geojson" data={hucData}>
            <Layer
              id="huc"
              type="fill"
              paint={{
                "fill-outline-color": "#484896",
                "fill-color": "#6e599f",
                "fill-opacity": 0.2,
              }}
            />
            {filterList.map((filter) => (
              <Layer
                id={filter[2]}
                type="fill"
                paint={{
                  "fill-outline-color": "#484896",
                  "fill-color": "#00ffff",
                  "fill-opacity": 0.2,
                }}
                filter={filter}
              />
            ))}
          </Source>
        )}
        {aoiList.length > 0 && hexGrid && renderHexGrid()}
        {drawingMode && renderDrawTools()}
        {hucBoundary && hovered && renderPopup()}
        {useCase === "visualization" &&
          visualizationSource &&
          visualizationLayer &&
          visualizationFillColor &&
          visualizationOpacity > 0 &&
          renderVisualization()}
      </MapGL>
    </>
  );
};

export default Map;
