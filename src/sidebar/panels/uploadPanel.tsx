import React, { FormEvent, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";

import { setFileUploaded } from "../../redux/actions";
import { Api } from "api";
import { useDispatch } from "react-redux";
import prettyBytes from "pretty-bytes";
import pluralize from "pluralize";

const getOnChangeHandler = (
  setFiles: (f: FileList | null) => void,
  setDoneCount: (d: number) => void
) => {
  const onChange = (files: FileList | null) => {
    setFiles(files);
    setDoneCount(0);
  };

  return onChange;
};

const useSubmitHandler = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const doneCount = useRef(0);
  const [visibleDoneCount, setVisibleDoneCount] = useState(0);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (files === null) return;

    for (let i = 0; i < files.length; ++i) {
      await uploadFile(files[i]);
    }
  }

  const dispatch = useDispatch();
  async function uploadFile(f: File) {
    await Api.Medium.upload(f).finally(() => {
      doneCount.current = doneCount.current + 1;
      setVisibleDoneCount((c) => c + 1);

      if (files && doneCount.current === files.length) {
        dispatch(setFileUploaded());

        setTimeout(() => {
          setFiles(null);
          doneCount.current = 0;
          setVisibleDoneCount(0);
        }, 5000);
      }
    });
  }

  const setDoneCount = (i: number) => {
    doneCount.current = i;
  };

  const onChange = getOnChangeHandler(setFiles, setDoneCount);
  return { files, onChange, doneCount: visibleDoneCount, onSubmit };
};

const getProgressBarClasses = (doneCount: number, files: FileList | null) => {
  let result = "beevenue-BatchUpload progress";
  if (!files) {
    return result;
  }

  if (doneCount === files.length) {
    return result + " is-success";
  }

  return result + " is-warning";
};

const getStatusText = (files: FileList | null): JSX.Element | null => {
  if (files === null || files.length === 0) {
    return null;
  }

  let totalFileSize = 0;
  for (let i = 0; i < files.length; ++i) {
    totalFileSize += files[i].size;
  }
  const fileSizeString = prettyBytes(totalFileSize).replace(" ", "\u00A0"); // nbsp

  return (
    <div className="field">
      <p>
        {files.length} {pluralize("file", files.length)} selected (
        {fileSizeString})
      </p>
    </div>
  );
};

const dragOverNop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

const renderBox = (
  doneCount: number,
  files: FileList | null,
  onChange: (f: FileList | null) => void
) => {
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onChange(event.dataTransfer.files);
    }
  };

  return (
    <>
      <div className="file is-boxed" onDrop={onDrop} onDragOver={dragOverNop}>
        <label className="file-label">
          <input
            className="file-input"
            multiple={true}
            type="file"
            aria-label="medium-upload-input"
            name="medium"
            onChange={(e) => onChange(e.target.files)}
          />
          <span className="file-cta">
            <FontAwesomeIcon icon={faUpload} />
            <span className="file-label">Select files</span>
          </span>

          {files === null || files.length === 0 ? null : (
            <progress
              aria-label="upload-panel-progress-bar"
              className={getProgressBarClasses(doneCount, files)}
              value={doneCount}
              max={files.length}
            />
          )}
        </label>
      </div>
      {getStatusText(files)}
    </>
  );
};

const UploadPanel = () => {
  const { files, onChange, doneCount, onSubmit } = useSubmitHandler();

  return (
    <div className="card beevenue-Sidebar-Card">
      <div className="card-header">
        <p className="card-header-title">Upload</p>
      </div>
      <div className="card-content">
        <form method="POST" onSubmit={(e) => onSubmit(e)}>
          <div className="field">{renderBox(doneCount, files, onChange)}</div>
          <div className="field">
            <input
              type="submit"
              aria-label="medium-upload-submit-button"
              className="button"
              disabled={files === null || files.length === 0}
              value="Go"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export { UploadPanel };
