import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Modal } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import html2canvas from "html2canvas";
import {
  RiFileDownloadLine,
  RiSaveLine,
  RiScreenshot2Fill,
} from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faBan } from "@fortawesome/free-solid-svg-icons";
import { setUseCase } from "../../../Redux/action";
import OptionsAccordion from "../../../Components/OptionsAccordion";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const checkMark = <FontAwesomeIcon icon={faCheck} size="lg" color="green" />;

const redEx = <FontAwesomeIcon icon={faBan} size="lg" color="red" />;

const VisualizeAOIView = ({
  mapRef,
  visualizationOpacity,
  setVisualizationOpacity,
  zoom,
  instruction,
  setAssessStep,
  setView,
  setShowTableContainer,
  setVisualizedHexagon,
}) => {
  const [show, setShow] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [resizedImageURL, setResizedImageURL] = useState(null);
  const user = useSelector((state) => state.user);
  const useCase = useSelector((state) => state.usecase.useCase);
  const dispatch = useDispatch();
  const aoi = useSelector((state) => state.aoi);
  const aoiList = Object.values(aoi).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const resizeImageURL = (url, newWidth, newHeight) => {
    return new Promise(async function (resolve, reject) {
      var img = document.createElement("img");
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(this, 0, 0, newWidth, newHeight);
        var dataURI = canvas.toDataURL();
        resolve(dataURI);
      };
      img.src = url;
    });
  };

  const getImage = async () => {
    // The map canvas only has webgl context and cannot retrive any 2D context
    var mapCanvas = mapRef.current.getMap().getCanvas();
    var mapCanvasGL = mapCanvas.getContext("webgl");
    var legendCanvas = await html2canvas(document.getElementById("legend"));

    var imageCanvas = document.createElement("canvas");
    imageCanvas.width = mapCanvasGL.drawingBufferWidth;
    imageCanvas.height = mapCanvasGL.drawingBufferHeight;
    var imageCanvas2D = imageCanvas.getContext("2d");
    var legendPositionX = imageCanvas.width - legendCanvas.width;
    var legendPositionY = imageCanvas.height - legendCanvas.height;
    imageCanvas2D.drawImage(mapCanvasGL.canvas, 0, 0);
    imageCanvas2D.drawImage(legendCanvas, legendPositionX, legendPositionY);

    var originalImage = imageCanvas.toDataURL();
    var resizedImage = await resizeImageURL(originalImage, 750, 500);
    setImageURL(originalImage);
    setResizedImageURL(resizedImage);
    handleShow();
  };

  // The length of image URL exceeds the limit of broswer
  // Need to use a blob object to recreate the URL instead
  function imageURLToBlob(url) {
    var binStr = atob(url.split(",")[1]),
      len = binStr.length,
      arr = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr]);
  }

  const DownloadMap = () => {
    var a = document.createElement("a");
    var blob = imageURLToBlob(imageURL);
    a.href = URL.createObjectURL(blob);
    a.download = "Map.png";
    a.click();
  };

  return (
    <Container className="test container">
      <p>
        <em>{instruction}</em>
      </p>
      <p>
        Current Zoom Level : {zoom} {zoom >= 10 ? checkMark : redEx}
      </p>
      <label>Layer Opacity (%) :</label>
      <RangeSlider
        step={1}
        value={visualizationOpacity}
        onChange={(e) => setVisualizationOpacity(e.target.value)}
        variant="secondary"
      />
      <br />
      <Button id="snapshotButton" variant="secondary" onClick={getImage}>
        <RiScreenshot2Fill /> &nbsp; Export Current View
      </Button>

      <div className="button-container container">
        <Button
          style={{ float: "left" }}
          variant="secondary"
          onClick={() => {
            setAssessStep("selectDataMeasures");
            setView("assess");
          }}
        >
          {arrowIcon} Edit Data Measures
        </Button>
      </div>

      <Modal centered show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Current Map View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center">
            <img src={resizedImageURL} alt={"Current Map View"} />
            <br />
            <div
              className={
                user.username
                  ? "d-flex justify-content-between"
                  : "d-flex justify-content-center"
              }
            >
              <Button variant="secondary" onClick={DownloadMap}>
                <RiFileDownloadLine /> &nbsp; Download Map
              </Button>
              {user.username && (
                <Button variant="secondary">
                  <RiSaveLine /> &nbsp; Save to: {user.username}
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Container
        style={{
          marginTop: "60px",
        }}
      >
        <OptionsAccordion
          setVisualizationOpacity={setVisualizationOpacity}
          setView={setView}
          setAssessStep={setAssessStep}
          setShowTableContainer={setShowTableContainer}
          setVisualizedHexagon={setVisualizedHexagon}
        />
      </Container>
    </Container>
  );
};

export default VisualizeAOIView;
