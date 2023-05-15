import { useCallback, useMemo, useContext } from "react";
import { useDropzone } from "react-dropzone";
import ConfigContext from "../../../context/ConfigContext";

import configHandler from "../../../grammar/configHandler";

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

export function MyDropzone({ userFiles, setUserFiles, setExcelDataset }) {
  const { config, setConfig } = useContext(ConfigContext);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      reader.onload = () => {
        if (file.type === fileTypes.JSON) {
          const { configObj, errors } = configHandler(JSON.parse(reader.result)); // returns undefined if error with JSON schema
          if (!errors) {
            configObj && setConfig(configObj); //parses and sets config from user uploaded JSON file
            configObj &&
              setUserFiles((prevState) => ({
                ...prevState,
                config: {
                  errors: null,
                  fileName: file.path,
                },
              }));
            window.localStorage.setItem("config", reader.result);
          } else {
            setUserFiles((prevState) => ({
              ...prevState,
              config: {
                fileName: file.path,
                errors: errors,
              },
            }));
          }
        } else if (file.type === fileTypes.EXCEL) {
          try {
            setExcelDataset(reader.result);
            //sets local storage to string representation of excel file array buffer
            window.localStorage.setItem("excelDataset", new Uint8Array(reader.result).toString());
            setUserFiles((prevState) => ({
              ...prevState,
              dataset: {
                fileName: file.path,
                errors: null,
              },
            }));
          } catch (error) {
            setUserFiles((prevState) => ({
              ...prevState,
              dataset: {
                fileName: file.path,
                errors: error,
              },
            }));
            console.error(error);
          }
        }
      };
      // return array buffer if excel, or text if json
      file.type === fileTypes.JSON && reader.readAsText(file);
      file.type === fileTypes.EXCEL && reader.readAsArrayBuffer(file);
    });
  }, []);

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
    </div>
  );
}

export default MyDropzone;
