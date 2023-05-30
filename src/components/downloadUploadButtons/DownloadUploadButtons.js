import React from "react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import cloneDeep from "lodash.clonedeep";

import prepConfigDownload from "./functions/prepConfigDownload";

import "./DownloadUploadButtons.css";

export function DownloadUploadButtons({
  config,
  excelDataset,
  setUploadVeiw,
  userFiles,
  uploadVeiw,
  setUserFiles,
  fatalErrorMessage,
}) {
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
    //reset config errors as config will not update if there is an error
    setUserFiles((prevState) => ({ ...prevState, config: { ...prevState.config, errors: null } }));
    fatalErrorMessage.current = [];
  };

  const clearProjectData = (evt) => {
    const confirmBox = window.confirm(
      "WARNING!! Clicking OK will delete your project data, download your files first if you don’t want your data to be lost"
    );
    if (confirmBox) {
      //clears local storage and refreshes the page to clear states
      window.localStorage.clear();
      window.location.reload();
    }
  };

  const dataButtonStyle = {
    visibility: uploadVeiw ? "visible" : "hidden",
  };

  return (
    <div>
      <div className="dataButtons">
        <button onClick={openUploadVeiw}>
          Manage data <i className="fa fa-floppy-disk"></i>
        </button>

        <button onClick={downloadHandler} style={dataButtonStyle}>
          Download files <i className="fa fa-download"></i>
        </button>
      </div>
      <button onClick={clearProjectData} style={dataButtonStyle} className="clearProjectButton">
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
