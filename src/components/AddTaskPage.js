// src/components/AddTaskPage.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../store"; // import addTask action

function AddTaskPage() {
  const dispatch = useDispatch();
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "", // new state for description
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({
      ...taskDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch addTask action with title and description
    dispatch(addTask(taskDetails));
    setTaskDetails({
      title: "",
      description: "",
    }); // Reset the form after submission
  };

  return (
    <div>
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={taskDetails.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={taskDetails.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default AddTaskPage;
