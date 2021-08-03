import React, { useContext } from "react";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuickFix } from "api/api";
import { ViolationsDispatch } from "./detailPage";

interface ViolationProps {
  fixes: QuickFix[];
  text: string;
}

const Violation = (props: ViolationProps) => {
  const dispatch = useContext(ViolationsDispatch);

  const icon = (f: QuickFix) => {
    return f.kind === "addTag" ? (
      <FontAwesomeIcon icon={faPlus} />
    ) : (
      <FontAwesomeIcon icon={faMinus} />
    );
  };

  const run = (f: QuickFix) => {
    dispatch({ type: f.kind, tag: f.tag });
  };

  const getFixButtons = (): JSX.Element[] => {
    return props.fixes.map((fix, idx) => {
      return (
        <div className="beevenue-missing-tag-column">
          <button
            className="button beevenue-missing-tag-button"
            key={`violation-fix-${idx}`}
            onClick={(_) => run(fix)}
          >
            <span className="icon">{icon(fix)}</span>
            <span>{fix.tag}</span>
          </button>
        </div>
      );
    });
  };

  if (props.fixes.length > 0) {
    return <>{getFixButtons()}</>;
  } else {
    return <>{props.text}</>;
  }
};

export { Violation };
