import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, updateTaskStatus } from "../slices/tasksSlice";

function EditTaskForm() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  });

  // Fetch tasks if not already loaded
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [dispatch, status]);

  // Populate the form with the task details
  useEffect(() => {
    const task = tasks.find((t) => t.id.toString() === taskId);
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        completed: task.completed || false,
      });
    }
  }, [tasks, taskId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = { id: parseInt(taskId), ...formData };
    dispatch(updateTaskStatus(updatedTask));
    navigate("/"); // Redirect to the homepage after saving
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error loading task data.</p>;

  return (
    <div>
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            Completed:
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditTaskForm;
