import MyDropzone from "./MyDropzone/MyDropzone";
import "./Upload.css";

export function Upload({ userFiles, setUserFiles }) {
  console.log(userFiles);

  const configError =
    userFiles.config.errors &&
    userFiles.config.errors.map((err, i) => {
      return (
        <li key={i}>
          {err.instancePath} {err.message}
        </li>
      );
    });

  return (
    <div className="dropzoneContainer">
      <MyDropzone userFiles={userFiles} setUserFiles={setUserFiles} />

      <div>
        {userFiles.config.fileName && (
          <div>
            <p>Config: {userFiles.config.fileName}</p>
            {userFiles.config.errors && <p>Errors: {configError}</p>}
          </div>
        )}
        {userFiles.dataset.fileName && <p>Dataset: {userFiles.dataset.fileName}</p>}
      </div>
    </div>
  );
}

export default Upload;
