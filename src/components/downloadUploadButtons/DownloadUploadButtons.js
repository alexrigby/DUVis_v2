import React from "react";

export function DownloadUploadButtons({ excelDataset, setUploadVeiw }) {
  console.log("hello");
  const openUploadVeiw = (evt) => {
    setUploadVeiw((prevState) => !prevState);
    // setUserFiles({
    //   config: { fileName: null, errors: null },
    //   dataset: { fileName: null, errors: null },
    // });
  };

  return (
    <div className="zoomButtons">
      <button onClick={openUploadVeiw}>
        Upload new files <i className="fa fa-upload"></i>
      </button>
      <a
        href={URL.createObjectURL(
          new Blob([excelDataset], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        )}
        download="dataset.xlsx"
      >
        <button>
          Download files <i className="fa fa-download"></i>
        </button>
      </a>
    </div>
  );
}

export default DownloadUploadButtons;
