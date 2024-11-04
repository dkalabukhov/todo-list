export default function AddNewTaskButton({ handleAddingTask, isAdding }) {
  return (
    <button
      onClick={handleAddingTask}
      className="btn btn_add-task"
      disabled={isAdding}
      >
      +
    </button>
  )
}