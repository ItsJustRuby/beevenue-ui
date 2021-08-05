import React, { useState } from "react";
import { ConfirmationModal } from "./confirmationModal";

export interface BaseProps {
  onClick: () => void;
}

type WrappedComponentType = (props: BaseProps) => JSX.Element;

interface WrappingConfirmationModalProps {
  onConfirm: () => void;
  WrappedComponent: WrappedComponentType;
}

const WrappingConfirmationModal = (props: WrappingConfirmationModalProps) => {
  const [isVisible, setVisible] = useState(false);

  const onCloseModal = () => {
    setVisible(false);
  };

  const onConfirm = () => {
    props.onConfirm();
    onCloseModal();
  };

  const { WrappedComponent } = props;
  return (
    <>
      {isVisible ? (
        <ConfirmationModal onCloseModal={onCloseModal} onConfirm={onConfirm} />
      ) : null}
      <WrappedComponent
        onClick={() => {
          setVisible(true);
        }}
      />
    </>
  );
};

export { WrappingConfirmationModal };
