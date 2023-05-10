import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

const fileTypes = {
  JSON: "application/json",
  EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const baseStyle = {
  margin: "1em",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export function MyDropzone({ userFiles, setUserFiles }) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      console.log(file.path);
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      reader.onload = () => {
        setUserFiles((prevState) => ({
          ...prevState,
          ...(file.type === fileTypes.JSON && { config: { fileName: file.path, file: JSON.parse(reader.result) } }),
          ...(file.type === fileTypes.EXCEL && { dataset: { fileName: file.path, file: reader.result } }),
        }));
      };
      // return array buffer if excel, or text if json
      file.type === fileTypes.JSON && reader.readAsText(file);
      file.type === fileTypes.EXCEL && reader.readAsArrayBuffer(file);
    });
  }, []);

  console.log(userFiles);
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      [fileTypes.JSON]: [".json"],
      [fileTypes.EXCEL]: [".xlsx", ".xls"],
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <p>drop files here or click to browse</p>

      <div>
        {userFiles.config && <p>Config: {userFiles.config.fileName}</p>}
        {userFiles.dataset && <p>Dataset: {userFiles.dataset.fileName}</p>}
      </div>
    </div>
  );
}

export default MyDropzone;
