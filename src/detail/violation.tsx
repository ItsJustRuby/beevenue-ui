import React, { useContext } from "react";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuickFix } from "api/api";
import { ImmediateUpdateDispatch } from "./detailPageInner";

interface ViolationProps {
  prefix: string;
  fixes: QuickFix[];
  onHasRun: () => void;
  text: string;
}

const Violation = (props: ViolationProps) => {
  const dispatch = useContext(ImmediateUpdateDispatch)!;

  const icon = (f: QuickFix) => {
    return f.kind === "addTag" ? (
      <FontAwesomeIcon icon={faPlus} />
    ) : (
      <FontAwesomeIcon icon={faMinus} />
    );
  };

  const run = (f: QuickFix) => {
    if (f.kind === "addTag") {
      dispatch({ action: "addTag", tag: f.tag });
    } else {
      dispatch({ action: "addAbsentTag", absentTag: f.tag });
    }
    props.onHasRun();
  };

  const getFixButtons = (): JSX.Element[] => {
    return props.fixes.map((fix, idx) => {
      const uniqueIdentifier = `medium-quick-fix-${props.prefix}-${idx}`;
      return (
        <div className="beevenue-missing-tag-column" key={uniqueIdentifier}>
          <button
            aria-label={uniqueIdentifier}
            id={uniqueIdentifier}
            name={uniqueIdentifier}
            className="button beevenue-missing-tag-button"
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
