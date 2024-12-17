import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, updateTaskStatus } from "../store";
import { useParams, useNavigate } from "react-router-dom";

const EditTaskPage = () => {
  const { id } = useParams(); // Get task ID from URL parameters
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get tasks state from Redux store
  const { tasks, status, error } = useSelector((state) => state.tasks);
  
  // Debugging: Check if tasks are being fetched correctly
  console.log("Fetched tasks:", tasks);

  // Find the task by ID
  const task = tasks.find((task) => task.id === parseInt(id));

  // Debugging: Check if task is found correctly
  console.log("Found task:", task);

  // Initialize form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  });

  // Fetch tasks if idle (not loaded yet)
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [dispatch, status]);

  // Update formData when task is found
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        completed: task.completed,
      });
    }
  }, [task]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data before dispatch:", formData); // Debugging: Check form data before submitting
    dispatch(updateTaskStatus({ id: parseInt(id), ...formData }));
    navigate("/"); // Redirect back to home
  };

  // Loading or error states
  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  // If task is not found
  if (!task) return <p>Task not found</p>;

  return (
    <div>
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Completed:
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditTaskPage;
