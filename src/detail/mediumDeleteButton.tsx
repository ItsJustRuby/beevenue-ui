import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { Api } from "api";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/actions";
import { forceRedirect } from "../redirect";
import { ConfirmationModal } from "confirmationModal";
import { useHistory } from "react-router-dom";
import { BrowserHistory } from "history";

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

const MediumDeleteButton = (props: MediumDeleteButtonProps) => {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <>
      <ConfirmationModal
        isVisible={isShowingModal}
        setVisible={setIsShowingModal}
        onConfirm={() => doConfirm(history, dispatch, props.id)}
      >
        <button
          className="button is-danger beevenue-medium-action-button"
          title="Delete"
          onClick={(e) => {
            setIsShowingModal(true);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </ConfirmationModal>
    </>
  );
};

export { MediumDeleteButton };
