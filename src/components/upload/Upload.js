import MyDropzone from "./MyDropzone/MyDropzone";
import "./Upload.css";

export function Upload({ userFiles, setUserFiles, setExcelDataset, fatalErrorState }) {
  const configError =
    userFiles.config.errors &&
    userFiles.config.errors.map((err, i) => {
      return (
        <li key={i}>
          {err.instancePath} {err.message}
        </li>
      );
    });

  const fatalErrors = fatalErrorState && (
    <div>
      <p>FATAL ERROR! Cound not find dataset worksheets: {fatalErrorState.map((err) => `"${err}", `)}</p>
      <p>Check config and dataset spellings match (case sensative)</p>
    </div>
  );

  const style = (expression) => ({
    color: expression ? "red" : "green",
  });

  return (
    <div className="dropzoneContainer">
      <MyDropzone userFiles={userFiles} setUserFiles={setUserFiles} setExcelDataset={setExcelDataset} />

      <div className="uploadedFile">
        {userFiles.config.fileName && (
          <div style={style(userFiles.config.errors)}>
            <p>Config: {userFiles.config.fileName}</p>
            {userFiles.config.errors && (
              <>
                <p>Config error: {configError}</p> <p>FILE NOT UPDATED!</p>
              </>
            )}
          </div>
        )}
        {userFiles.dataset.fileName && (
          <div style={style(userFiles.dataset.errors || fatalErrorState)}>
            <p>Dataset: {userFiles.dataset.fileName}</p>
            {userFiles.dataset.errors && <p>Dataset Error: {userFiles.dataset.errors} </p>}
            {fatalErrorState && fatalErrors}
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
