import MyDropzone from "./MyDropzone/MyDropzone";
import "./Upload.css";

export function Upload({ userFiles, setUserFiles }) {
  return (
    <div className="dropzoneContainer">
      <MyDropzone userFiles={userFiles} setUserFiles={setUserFiles} />

      <div>
        {userFiles.config && <p>Config: {userFiles.config.fileName}</p>}
        {userFiles.dataset && <p>Dataset: {userFiles.dataset.fileName}</p>}
      </div>
    </div>
  );
}

export default Upload;
