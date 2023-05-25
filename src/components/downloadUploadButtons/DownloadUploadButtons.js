import React from "react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import cloneDeep from "lodash.clonedeep";

import prepConfigDownload from "./functions/prepConfigDownload";

import "./DownloadUploadButtons.css";

export function DownloadUploadButtons({ config, excelDataset, setUploadVeiw, userFiles, uploadVeiw }) {
  const downloadHandler = (evt) => {
    const configClone = cloneDeep(config);
    const configForDownlaod = prepConfigDownload(configClone);

    const zip = new JSZip();
    zip.file(`${userFiles.config.fileName}`, JSON.stringify(configForDownlaod));
    zip.file(`${userFiles.dataset.fileName}`, excelDataset);
    zip.generateAsync({ type: "blob" }).then((content) => {
      FileSaver.saveAs(content, `${config.NAME} datset and config ${new Date().toISOString().split("T")[0]}`);
    });
  };

  const openUploadVeiw = (evt) => {
    setUploadVeiw((prevState) => !prevState);
  };

  const clearProjectButtonStyle = {
    display: uploadVeiw ? "block" : "none",
  };

  return (
    <div>
      <div className="dataButtons">
        <button onClick={openUploadVeiw}>
          Upload new files <i className="fa fa-upload"></i>
        </button>

        <button onClick={downloadHandler}>
          Download files <i className="fa fa-download"></i>
        </button>
      </div>
      <button style={clearProjectButtonStyle} className="clearProjectButton">
        Clear project data <i className="fa fa-eraser"></i>
      </button>
    </div>
  );
}

export default DownloadUploadButtons;

// const excelDatasetDownload = URL.createObjectURL(
//   new Blob([excelDataset], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   })
// );

// const configDownload = URL.createObjectURL(
//   new Blob([JSON.stringify(config)], {
//     type: "text/json;charset=utf-8",
//   })
// );
