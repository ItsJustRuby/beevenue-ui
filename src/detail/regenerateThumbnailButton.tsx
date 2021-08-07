import React from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Api } from "api";
import { addNotification } from "../redux/actions";
import { useDispatch } from "react-redux";

interface RegenerateThumbnailButtonProps {
  id: number;
}

const RegenerateThumbnailButton = (props: RegenerateThumbnailButtonProps) => {
  const dispatch = useDispatch();

  const onClick = () => {
    Api.Medium.regenerateThumbnail(props.id).then((res: any) => {
      dispatch(
        addNotification({
          level: "info",
          contents: ["Successfully created new thumbnails."],
        })
      );
    });
  };

  return (
    <button
      aria-label="medium-regenerate-thumbnail-button"
      className="button is-primary beevenue-medium-action-button"
      title="Regenerate thumbnail"
      onClick={(e) => onClick()}
    >
      <FontAwesomeIcon icon={faSync} />
    </button>
  );
};

export { RegenerateThumbnailButton };
