import React from "react";

interface ConfirmationModalProps {
  children?: any;
  isVisible: boolean;
  setVisible: (b: boolean) => void;
  onConfirm: () => void;
}

const renderModalFooter = (onCloseModal: () => void, onConfirm: () => void) => {
  return (
    <footer className="modal-card-foot">
      <button className="button is-danger" onClick={e => onConfirm()}>
        Definitely delete forever
      </button>
      <button className="button" onClick={e => onCloseModal()}>
        Cancel
      </button>
    </footer>
  );
};

const renderModal = (onCloseModal: () => void, onConfirm: () => void) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={e => onCloseModal()} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Confirm</p>
          <button
            className="delete"
            aria-label="close"
            onClick={e => onCloseModal()}
          />
        </header>
        <section className="modal-card-body">
          Are you sure you want to delete this?
        </section>
        {renderModalFooter(onCloseModal, onConfirm)}
      </div>
    </div>
  );
};


const ConfirmationModal = (props: ConfirmationModalProps) => {
  const onCloseModal = () => {
    props.setVisible(false);
  };

  const onConfirm = () => {
    props.onConfirm();
    onCloseModal();
  };

  return (
    <>
      {props.isVisible ? renderModal(onCloseModal, onConfirm) : null}
      {props.children}
    </>
  );
};

export { ConfirmationModal };
