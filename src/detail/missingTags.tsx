import React, { useState, useEffect } from "react";
import { Api } from "api";
import { Rating } from "../api/show";
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
}

const MissingTags = (props: MissingTagsProps) => {
  const [violations, setViolations] = useState<ViolationViewModel[] | null>(
    null
  );

  useEffect(() => {
    Api.Tags.getViolations(props.id).then(
      (res) => {
        setViolations(res.data.violations);
      },
      (err) => {
        console.error(err);
      }
    );
  }, [props.id, props.tags, props.rating]);

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
    inner = violations.map((violation, idx) => (
      <div className="beevenue-missing-tag" key={`missing-${idx}`}>
        <span className="beevenue-missing-tag-icon">
          <FontAwesomeIcon
            title={violation.text}
            size="2x"
            icon={faTimes}
            color="red"
          />
        </span>
        <Violation {...violation} />
      </div>
    ));
  }

  return (
    <div className="card">
      <div className="card-content">
        <div className="content beevenue-missing-tags">{inner}</div>
      </div>
    </div>
  );
};

export { MissingTags };
