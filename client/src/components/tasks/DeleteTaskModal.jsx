import Button from "../common/Button";

const DeleteTaskModal = ({ task, deleting, onClose, onDelete }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-slate-950">Delete Task</h2>
      <p className="mt-2 text-sm text-slate-600">
        Are you sure you want to delete "{task.title}"? This action cannot be
        undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" disabled={deleting} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" disabled={deleting} onClick={onDelete}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  </div>
);

export default DeleteTaskModal;
