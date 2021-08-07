import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { Api } from "api";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/actions";
import { forceRedirect } from "../redirect";
import { useHistory } from "react-router-dom";
import { BrowserHistory } from "history";
import { WrappingConfirmationModal } from "modals/wrappingConfirmationModal";

interface MediumDeleteButtonProps {
  id: number;
}

const doConfirm = (
  history: BrowserHistory,
  dispatch: (x: any) => void,
  mediumId: number
) => {
  Api.Medium.delete(mediumId)
    .then(
      (res) => {
        dispatch(
          addNotification({
            level: "info",
            contents: ["Successfully deleted medium."],
          })
        );
      },
      (err) => {
        dispatch(
          addNotification({
            level: "error",
            contents: ["Could not delete medium!"],
          })
        );
      }
    )
    .finally(() => {
      forceRedirect(history, "/");
    });
};

interface WrappedButtonProps {
  onClick: () => void;
}

const WrappedButton = (props: WrappedButtonProps) => {
  return (
    <button
      className="button is-danger beevenue-Button"
      title="Delete"
      aria-label="medium-delete-button"
      onClick={props.onClick}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
};

const MediumDeleteButton = (props: MediumDeleteButtonProps) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <>
      <WrappingConfirmationModal
        onConfirm={() => doConfirm(history, dispatch, props.id)}
        WrappedComponent={WrappedButton}
      />
    </>
  );
};

export { MediumDeleteButton };
