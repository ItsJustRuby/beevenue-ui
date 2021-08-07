import React from "react";
import { backendUrl } from "../config.json";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons/faFileDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RuleFileDownloadCard = () => {
  return (
    <>
      <div className="card beevenue-Card">
        <header className="card-header">
          <p className="card-header-title">Download rules file</p>
        </header>
        <div className="card-content">
          <div className="content">
            <a
              className="button"
              download
              arial-label="rule-download-button"
              href={`${backendUrl}/rules/rules.json`}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faFileDownload} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export { RuleFileDownloadCard };
