import { useContext } from "react";

import MyDropzone from "./MyDropzone/MyDropzone";
import ConfigContext from "../../context/ConfigContext";
import "./Upload.css";

import GitHub from "../../assets/GitHub_Logo.png";

export function Upload({ userFiles, setUserFiles, setExcelDataset, fatalErrorState, excelDataset, fatalErrorMessage }) {
  const { config } = useContext(ConfigContext);

  const configError =
    userFiles.config.errors &&
    userFiles.config.errors.map((err, i) => {
      return (
        <li key={i}>
          {err.instancePath} {err.message}
        </li>
      );
    });

  const fatalErrorsText = fatalErrorMessage.current.length > 0 && (
    <div>
      <p>FATAL ERROR! Cound not find dataset worksheets: {fatalErrorMessage.current.map((err) => `"${err}", `)}</p>
      <p>Check that config and dataset spellings match (case sensative)</p>
      <p>DATASET FILE NOT UPDATED!</p>
    </div>
  );

  const landingText = (
    <div className="landingText">
      <h1>Welcome to ReActiVis!</h1>
      <p>
        Start visualising your research project by uploading your excel (.xlsx) dataset and config (.json) files{" "}
        <i className="fa-regular fa-hand-point-down"></i>
      </p>
    </div>
  );

  const style = (expression) => ({
    color: expression ? "red" : "green",
  });

  return (
    <div className="dropzoneContainer">
      {(!config || !excelDataset) && landingText}
      <p className="linkText">
        Find documentation and useful guides on our GitHub
        {/* <img src={GitHub} alt="GitHub logo"></img> */}
      </p>
      <MyDropzone
        userFiles={userFiles}
        setUserFiles={setUserFiles}
        setExcelDataset={setExcelDataset}
        fatalErrorMessage={fatalErrorMessage}
      />

      <div className="uploadedFile">
        <div style={style(userFiles.config.errors || !config)}>
          <p>Config: {userFiles.config.fileName}</p>
          {userFiles.config.errors && (
            <>
              <p>Config error: {configError}</p> <p>CONFIG FILE NOT UPDATED!</p>
            </>
          )}
        </div>
        {/* {userFiles.dataset.fileName && ( */}
        <div style={style(userFiles.dataset.errors || fatalErrorMessage.current.length > 0 || !excelDataset)}>
          <p>Dataset: {userFiles.dataset.fileName}</p>
          {userFiles.dataset.errors && <p>Dataset Error: {userFiles.dataset.errors} </p>}
          {fatalErrorMessage.current.length > 0 && config && fatalErrorsText}
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default Upload;
