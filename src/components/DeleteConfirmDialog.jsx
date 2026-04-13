import './DeleteConfirmDialog.css';

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, assetName }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="dialog-overlay" onClick={onClose}></div>
      <div className="dialog-container">
        <div className="dialog-header">
          <h3>Delete Asset</h3>
        </div>
        <div className="dialog-body">
          <p>Are you sure you want to delete <strong>{assetName}</strong>?</p>
          <p className="dialog-warning">This action cannot be undone.</p>
        </div>
        <div className="dialog-actions">
          <button className="btn-dialog-cancel" onClick={onClose}>
            No
          </button>
          <button className="btn-dialog-confirm" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmDialog;
