import React, { useState, useEffect } from "react";
import hash from "object-hash";
import { Api } from "api";
import { Rating } from "../types";
import { BeevenueSpinner } from "../beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { Violation } from "./violation";
import { ViolationViewModel } from "api/api";

interface MissingTagsProps {
  id: number;
  tags: string[];
  rating: Rating;

  isCanonical: boolean;
}

interface ExtendedViolationViewModel extends ViolationViewModel {
  hasRun: boolean;
}

const MissingTags = (props: MissingTagsProps) => {
  const { isCanonical } = props;

  const [violations, setViolations] = useState<
    ExtendedViolationViewModel[] | null
  >(null);

  useEffect(() => {
    if (!isCanonical) return;

    let isMounted = true;

    Api.Tags.getViolations(props.id).then(
      (res) => {
        if (!isMounted) return;
        const extended = res.data.violations.map((v) => {
          return { ...v, hasRun: false };
        });
        setViolations(extended);
      },
      (err) => {
        if (!isMounted) return;
        console.error(err);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [isCanonical, props.id]);

  const onHasRun = (idx: number) => {
    if (violations === null) return;

    const newViolations = violations.slice();
    newViolations[idx].hasRun = true;
    setViolations(newViolations);
  };

  let inner = null;
  if (violations === null) {
    inner = <BeevenueSpinner />;
  } else if (violations.length === 0) {
    inner = (
      <FontAwesomeIcon
        title="Tags are consistent!"
        size="2x"
        icon={faCheck}
        color="green"
      />
    );
  } else {
    inner = violations.map((violation, idx) => {
      if (violation.hasRun) return null;

      return (
        <div className="beevenue-ViolationsContainer" key={`missing-${idx}`}>
          <span className="beevenue-ViolationsContainer-Icon">
            <FontAwesomeIcon
              title={violation.text}
              size="2x"
              icon={faTimes}
              color="red"
            />
          </span>
          <Violation
            prefix={hash(violation).substr(0, 8)}
            text={violation.text}
            fixes={violation.fixes}
            onHasRun={() => onHasRun(idx)}
          />
        </div>
      );
    });

    inner = inner.filter((i) => i !== null);
  }

  return (
    <div className="card beevenue-ShowPage-Card">
      <div className="card-content">
        <div className="content">{inner}</div>
      </div>
    </div>
  );
};

export { MissingTags };
