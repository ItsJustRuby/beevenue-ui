import React from "react";

const renderModalFooter = (onCloseModal: () => void, onConfirm: () => void) => {
  return (
    <footer className="modal-card-foot">
      <button
        aria-label="modal-delete-button"
        className="button is-danger"
        onClick={(e) => onConfirm()}
      >
        Definitely delete forever
      </button>
      <button
        aria-label="modal-cancel-button"
        className="button"
        onClick={(e) => onCloseModal()}
      >
        Cancel
      </button>
    </footer>
  );
};

const renderModal = (onCloseModal: () => void, onConfirm: () => void) => {
  return (
    <div className="modal is-active">
      <div
        className="modal-background"
        data-testid="confirmation-modal-background"
        onClick={(e) => onCloseModal()}
      />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Confirm</p>
          <button
            className="delete"
            aria-label="modal-close-button"
            onClick={(e) => onCloseModal()}
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

interface ConfirmationModalProps {
  onCloseModal: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
  return renderModal(props.onCloseModal, props.onConfirm);
};

export { ConfirmationModal };
