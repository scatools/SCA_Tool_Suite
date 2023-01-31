import React, { useState, useRef, useEffect } from "react";
import MapGL, { Source, Layer, Popup } from "react-map-gl";
import { Editor, EditingMode } from "react-map-gl-draw";
import MultiSwitch from "react-multi-switch-toggle";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FiMap, FiLayers } from "react-icons/fi";
import "mapbox-gl/dist/mapbox-gl.css";
import bbox from "@turf/bbox";
import shp from "shpjs";
import Legend from "../Components/Legend";
import TableContainer from "../Plans/TableContainer";
import { getFeatureStyle, getEditHandleStyle } from "./drawStyle";
import { feature } from "@turf/turf";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Map = ({
  stopDraw,
  mapRef,
  drawingMode,
  setFeatureList,
  aoiSelected,
  setAoiSelected,
  editAOI,
  hucBoundary,
  hucIDSelected,
  setHucIDSelected,
  hucFilterList,
  setHucFilterList,
  mode,
  setMode,
  interactiveLayerIds,
  setInteractiveLayerIds,
  autoDraw,
  hexGrid,
  hexDeselection,
  setHexIDDeselected,
  setHexFilterList,
  hexIDDeselected,
  hexFilterList,
  visualizationSource,
  visualizationLayer,
  visualizationHighlight,
  visualizationFillColor,
  visualizationOpacity,
  setVisualizedHexagon,
  showTableContainer,
  setShowTableContainer,
  zoom,
  setZoom,
  viewport,
  setViewport,
  setInstruction,
  view,
  clickedProperty,
  setClickedProperty,
}) => {
  const useCase = useSelector((state) => state.usecase.useCase);
  const [selectBasemap, setSelectBasemap] = useState(false);
  const [selectOverlay, setSelectOverlay] = useState(false);
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [overlayList, setOverlayList] = useState([]);
  const [selectedSwitch, setSelectedSwitch] = useState(0);
  const [coordinates, setCoordinates] = useState([undefined, undefined]);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const [hucData, setHucData] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [hoveredGeometry, setHoveredGeometry] = useState(null);
  const [hexFilter, setHexFilter] = useState(["in", "objectid", "default"]);
  const [visualizationFilter, setVisualizationFilter] = useState([
    "in",
    "OBJECTID",
    "default",
  ]);
  const editorRef = useRef(null);

  const [mousePos, setMoustPos] = useState([0, 0]);

  const [hucIDArray, _setHucIDArray] = useState([]);
  const hucIDArrayREF = useRef(hucIDArray);
  const setHucIDArray = (data) => {
    hucIDArrayREF.current = data;
    _setHucIDArray(data);
  };

  const [hexIDArray, _setHexIDArray] = useState([]);
  const hexIDArrayREF = useRef(hexIDArray);
  const setHexIDArray = (data) => {
    hexIDArrayREF.current = data;
    _setHexIDArray(data);
  };

  const overlaySources = {
    secas: "mapbox://chuck0520.dkcwxuvl",
  };

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
    if (e.lngLat) {
      setMoustPos(e.lngLat);
    }
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
      view !== "list" &&
      !drawingMode &&
      !hucBoundary &&
      !hexGrid
    ) {
      setCoordinates(e.lngLat);
      setShowTableContainer(true);
    } else if (useCase === "inventory" && aoiSelected !== false) {
      setCoordinates([undefined, undefined]);
    }

    if (e.features && useCase === "visualization" && zoom >= 10) {
      const featureClicked = e.features[0];
      console.log(featureClicked);
      if (featureClicked) {
        setClickedProperty(featureClicked.properties);
      }
    }

    if (e.features && hucBoundary) {
      const featureClicked = e.features[0].properties;
      if (featureClicked) {
        setClickedProperty(featureClicked);
        if (
          featureClicked.HUC12 &&
          hucIDArrayREF.current.includes(featureClicked.HUC12)
        ) {
          let removeIndex = hucIDArrayREF.current.indexOf(featureClicked.HUC12);
          let newHucIDList = [...hucIDArrayREF.current];
          newHucIDList.splice(removeIndex, 1);
          setHucIDArray(newHucIDList);
          let newFilterList = [];
          let toSetHucIDSelected = [];
          newHucIDList.forEach((hucID) => {
            newFilterList.push(["in", "HUC12", hucID]);
            toSetHucIDSelected.push({ value: hucID, label: hucID });
          });
          setHucFilterList([...newFilterList]);
          setHucIDSelected(toSetHucIDSelected);
        } else {
          let toSetHucIDSelected = [];
          let toSetHucFilter = [];
          setHucIDArray([...hucIDArrayREF.current, featureClicked.HUC12]);
          hucIDArrayREF.current.forEach((hucID) => {
            toSetHucFilter.push(["in", "HUC12", hucID]);
            toSetHucIDSelected.push({ value: hucID, label: hucID });
          });
          // toSetHucIDSelected.push({
          //   value: featureClicked.HUC12,
          //   label: featureClicked.HUC12,
          // });
          // toSetHucFilter.push(["in", "HUC12", featureClicked.HUC12]);
          setHucIDSelected(toSetHucIDSelected);
          setHucFilterList(toSetHucFilter);
        }
      }
    }

    //hexIDDeselcted is goal
    if (e.features && hexGrid && hexDeselection) {
      const featureClicked = e.features[0].properties;
      if (featureClicked) {
        console.log("test");
        console.log(hexFilterList);
      }
    }
  };

  useEffect(() => {
    setHucIDArray([]);
    setHexIDArray([]);
    stopDraw();
  }, [view]);

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
    // Use HUC12 as the unique property to filter out undesired layer
    if (mousePos[0] && mousePos[1] && hoveredProperty.HUC12) {
      return (
        <Popup
          tipSize={5}
          anchor="bottom"
          longitude={mousePos[0]}
          latitude={mousePos[1]}
          closeOnClick={false}
          closeButton={false}
          offsetTop={-12}
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
            key={filter[2]}
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
            id="visualization-layer"
            type="fill"
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
          <Layer
            {...visualizationHighlight}
            id="visualization-highlight"
            type="fill"
            filter={visualizationFilter}
          />
        </Source>
        <Legend
          aoiList={[]}
          aoiColors={[]}
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
    if (hexGrid && hexDeselection) {
      setInteractiveLayerIds(["hex"]);
    } else if (hucBoundary) {
      setInteractiveLayerIds(["huc"]);
    } else if (
      useCase === "visualization" &&
      !drawingMode &&
      visualizationSource &&
      visualizationLayer &&
      visualizationFillColor &&
      visualizationOpacity > 0 &&
      viewport.zoom >= 10
    ) {
      setInteractiveLayerIds(["visualization-layer"]);
    } else if (!drawingMode && useCase !== "visualization") {
      setInteractiveLayerIds([]);
    }
  }, [
    drawingMode,
    hexGrid,
    hexDeselection,
    hucBoundary,
    useCase,
    viewport,
    visualizationSource,
    visualizationLayer,
    visualizationFillColor,
    visualizationOpacity,
    setInteractiveLayerIds,
  ]);

  useEffect(() => {
    if (clickedProperty) {
      // console.log(clickedProperty.HUC12);
      // // For HUC-12 boundary layer, same watershed area won't be counted twice
      // if (
      //   clickedProperty.HUC12 &&
      //   hucIDSelected.includes(clickedProperty.HUC12)
      // ) {
      //   const indexToRemove = hucIDSelected.indexOf(clickedProperty.HUC12);
      //   console.log(clickedProperty.HUC12);
      // } else if (
      //   clickedProperty.HUC12 &&
      //   !hucIDSelected.includes(clickedProperty.HUC12)
      // ) {
      //   // Array hucIDSelected is stored in a format like [{value: 'xx', label: 'xx'}]
      //   hucIDSelected.push({
      //     value: clickedProperty.HUC12,
      //     label: clickedProperty.HUC12,
      //   });
      //   setHucFilter(["in", "HUC12", clickedProperty.HUC12]);
      // }

      // For hex grid layer, same hexagon won't be counted twice
      if (
        clickedProperty.objectid &&
        !hexIDDeselected.includes(clickedProperty.objectid)
      ) {
        // Array hexIDDeselected is stored in a simple array format
        hexIDDeselected.push(clickedProperty.objectid);
        setHexFilter(["in", "objectid", clickedProperty.objectid]);
      }

      // For visualization layer

      if (
        //ANTHONY VERSION
        // interactiveLayerIds[0] === "visualization-layer" &&
        // clickedProperty.objectid

        useCase === "visualization" &&
        clickedProperty.gid
      ) {
        console.log("clicked");
        setVisualizedHexagon(clickedProperty);
        setVisualizationFilter(["in", "OBJECTID", clickedProperty.objectid]);
      }
    }
  }, [clickedProperty, hexIDDeselected, hucIDSelected]);

  // useEffect(() => {
  //   setHucFilterList((hucFilterList) => [...hucFilterList, hucFilter]);
  // }, [hucFilter]);

  // useEffect(() => {
  //   hexFilterList.push(hexFilter);
  // }, [hexFilter, hexFilterList]);

  useEffect(() => {
    if (zoom >= 10) {
      setInstruction(
        "Click individual hexagon to explore the details of a single hexagonal area."
      );
    } else {
      setInstruction(
        "Please zoom in to level 10 to explore the details of a single hexagonal area."
      );
    }
  }, [zoom]);

  console.log(hucFilterList);

  return (
    <>
      <Button
        className="basemapButton"
        variant="secondary"
        title="Base Map"
        onClick={() => setSelectBasemap(!selectBasemap)}
      >
        <FiMap />
      </Button>
      <Button
        className="overlayButton"
        variant="secondary"
        title="Overlay Layers"
        onClick={() => setSelectOverlay(!selectOverlay)}
      >
        <FiLayers />
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
      {selectOverlay && (
        <div className="overlaySelect">
          <div>
            <input
              type="checkbox"
              value="secas"
              checked={overlayList.includes("secas")}
              onChange={() => {
                if (overlayList.includes("secas")) {
                  setOverlayList((list) =>
                    list.filter((element) => element !== "secas")
                  );
                } else {
                  setOverlayList((list) => [...list, "secas"]);
                }
              }}
            />
            <span>&nbsp; Southeast Blueprint</span>
          </div>
        </div>
      )}
      {showTableContainer && (
        <TableContainer
          coordinates={coordinates}
          aoiSelected={aoiSelected}
          setShowTableContainer={setShowTableContainer}
          showTableContainer={showTableContainer}
          view={view}
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
        {overlayList.map((overlay) => (
          <Source
            type="raster"
            url={overlaySources[overlay]}
            maxzoom={22}
            minzoom={0}
          >
            <Layer
              type="raster"
              id={overlay}
              key={overlay}
              value={overlay}
              paint={{ "raster-opacity": 0.5 }}
            />
          </Source>
        ))}
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
            {hucFilterList.map((filter) => (
              <Layer
                id={filter[2]}
                key={filter[2]}
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
