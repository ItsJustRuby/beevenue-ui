import React from "react";
import { ConfirmationModal } from "./confirmationModal";

export interface BaseProps {
  onClick: () => void;
}

interface IntrusiveConfirmationModalProps {
  onConfirm: () => void;
  isVisible: boolean;
  setIsVisible: (b: boolean) => void;
}

const IntrusiveConfirmationModal = (props: IntrusiveConfirmationModalProps) => {
  const onCloseModal = () => {
    props.setIsVisible(false);
  };

  const onConfirm = () => {
    props.onConfirm();
    onCloseModal();
  };
  return (
    <>
      {props.isVisible ? (
        <ConfirmationModal onCloseModal={onCloseModal} onConfirm={onConfirm} />
      ) : null}
    </>
  );
};

export { IntrusiveConfirmationModal };
