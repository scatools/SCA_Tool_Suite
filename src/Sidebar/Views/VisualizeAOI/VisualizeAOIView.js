import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Container, Modal } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { RiFileDownloadLine, RiSaveLine, RiScreenshot2Fill } from "react-icons/ri";

const VisualizeAOIView = ({
  mapRef,
  visualizationOpacity,
  setVisualizationOpacity,
  zoom,
  instruction
}) => {
  const [show, setShow] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [resizedImageURL, setResizedImageURL] = useState(null);
  const user = useSelector((state) => state.user);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const resizeImageURL = (url, newWidth, newHeight) => {
    return new Promise(async function(resolve, reject){
      var img = document.createElement('img');
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
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
    var originalImage = mapRef.current.getMap().getCanvas().toDataURL();
    var resizedImage = await resizeImageURL(originalImage, 750, 500);
    setImageURL(originalImage);
    setResizedImageURL(resizedImage);
    handleShow();
  };

  // The length of image URL exceeds the limit of broswer
  // Need to use a blob object to recreate the URL instead
  function imageURLToBlob(url) {
    var binStr = atob(url.split(',')[1]),
      len = binStr.length,
      arr = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    };
    return new Blob([arr]);
  };

  const DownloadMap = () => {
    var a = document.createElement("a");
    var blob = imageURLToBlob(imageURL);
    a.href = URL.createObjectURL(blob);;
    a.download = "Map.png";
    a.click();
  };

  return (
    <Container>
      <p>
        <em>{instruction}</em>
      </p>
      <p>Current Zoom Level : {zoom}</p>
      <label>Layer Opacity (%) :</label>
      <RangeSlider
        step={1}
        value={visualizationOpacity}
        onChange={(e) => setVisualizationOpacity(e.target.value)}
        variant="secondary"
      />
      <br />
      <Button
        id="snapshotButton"
        variant="secondary"
        onClick={getImage}
      >
        <RiScreenshot2Fill /> &nbsp;
        Export Current View
      </Button>
      <Modal centered show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Current Map View
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center">
            <img src={resizedImageURL} alt={"Current Map View"} />
            <br/>
            <div 
              className={
                user.username?
                "d-flex justify-content-between":
                "d-flex justify-content-center"
              }
            >
              <Button variant="secondary" onClick={DownloadMap}>
                <RiFileDownloadLine /> &nbsp;
                Download Map
              </Button>
              {user.username && (
                <Button variant="secondary">
                  <RiSaveLine /> &nbsp;
                  Save to: {user.username}
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default VisualizeAOIView;
