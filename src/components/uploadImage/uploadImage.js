import "../../components/uploadImage/uploadImage.css";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Footer from "../../common/component/footer.js";
import { ProgressBar, Button } from "react-bootstrap";
import React, { useState, useRef } from "react";
import { FaCopy } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

function UploadImage() {
  const isMobileDevice = useMediaQuery({ query: "(max-width: 450px)" });
  const isTabletDevice = useMediaQuery({
    query: "(min-width: 451px) and (max-width: 1200px)",
  });
  const isLaptop = useMediaQuery({
    query: "(min-width: 1201px) and (max-width: 1600px)",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1601px)" });

  const filesRef = useRef([]);
  const [uploadStatus, setUploadStatus] = useState("Upload");
  const uploadCompletedRef = useRef(false);
  const [, setForceRender] = useState(false);

  const uploadFiles = () => {
    let allFilesUploaded = true;
    setForceRender((prev) => !prev);
    setForceRender((prev) => !prev);

    filesRef.current.forEach((file) => {
      for (let i = 0; i < 10; i++) {
        if (file.progress < 100) {
          const newProgress = Math.min(file.progress + 10, 100);
          file.progress = newProgress;
        }
      }
    });

    filesRef.current.forEach((file) => {
      if (file.progress < 100) {
        allFilesUploaded = false;
      }
    });

    if (allFilesUploaded) {
      setTimeout(() => {
        uploadCompletedRef.current = true;
        setUploadStatus("Uploaded");
        setForceRender((prev) => !prev);
      }, 500);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({ file, progress: 0 }));
      setUploadStatus("Uploading");
      filesRef.current.push(...filesRef.current, ...newFiles);
      uploadFiles();
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
  };

  const handleFileInputChange = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({ file, progress: 0 }));
      setUploadStatus("Uploading");
      filesRef.current.push(...filesRef.current, ...newFiles);
      uploadFiles();
    }
  };

  return (
    <div
      className={` ${isMobileDevice ? "mobile" : ""} ${
        isTabletDevice ? "tablet" : ""
      } ${isLaptop ? "laptop" : ""} ${isDesktop ? "desktop" : ""} `}
    >
      {uploadStatus === "Upload" && (
        <div id="div1" className="display">
          <h1 className="heading">Upload your Image</h1>
          <h2 className="subHeading">File should be Jpeg,Png,...</h2>
          <div
            className="dragBody"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p
              className="dragText"
              draggable="true"
              onDragStart={handleDragStart}
            >
              Drag & Drop your image here
            </p>
          </div>
          <div>
            <p className="textName">Or</p>
            <label htmlFor="fileInput" className="btn btn-primary button">
              Choose a file
              <input
                id="fileInput"
                style={{
                  display: "none",
                }}
                type="file"
                multiple
                className="fileInput"
                onChange={handleFileInputChange}
              />
            </label>
          </div>
        </div>
      )}

      {uploadStatus === "Uploading" && !uploadCompletedRef.current && (
        <div id="div2" className="display">
          <h1 className="heading">Uploading ...</h1>
          <br />
          <ProgressBar>
            {filesRef.current.map((file, index) => (
              <ProgressBar
                key={index}
                striped
                animated
                variant={"success"}
                now={Math.min(file.progress, 100) || 0}
              />
            ))}
          </ProgressBar>
        </div>
      )}

      {uploadCompletedRef.current && (
        <div id="div3" className="display">
          <CheckCircleRoundedIcon
            className="heading"
            style={{ left: "175px" }}
            color="success"
          />
          <h1 className="heading">Uploaded Successfully</h1>
          <ul>
            {filesRef.current.map((file, index) => (
              <div key={index}>
                <br />
                <img
                  src={URL.createObjectURL(file.file)}
                  alt=""
                  height="200px"
                  width="300px"
                  style={{
                    borderRadius: "8px",
                  }}
                />
                <br />
                <br />
                <p className="clipboard">
                  <Button style={{ height: "32px", display: "none" }}>
                    Copy Link
                  </Button>
                  <FaCopy
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  {URL.createObjectURL(file.file).replace("blob:", "")}
                </p>
              </div>
            ))}
          </ul>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default UploadImage;
