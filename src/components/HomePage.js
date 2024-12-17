import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTaskStatus } from "../store"; // Fetch tasks and update status action
import { Link } from "react-router-dom"; // Link to edit task page

const HomePage = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Get tasks from Redux state
  const status = useSelector((state) => state.tasks.status); // Get loading status

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks()); // Fetch tasks if idle
    }
  }, [dispatch, status]);

  const handleToggleStatus = (taskId, currentStatus) => {
    dispatch(updateTaskStatus({ id: taskId, completed: !currentStatus }));
  };

  return (
    <div>
      <h2>Task List</h2>
      {status === "loading" ? (
        <p>Loading tasks...</p> // Show loading text while fetching tasks
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{task.title}</h3>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Status:</strong> {task.completed ? "Completed" : "Incomplete"}
              </p>
              <div style={{ marginTop: "10px" }}>
                <Link
                  to={`/edit/${task.id}`}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    marginRight: "10px",
                  }}
                >
                  Edit Task
                </Link>
                <button
                  onClick={() => handleToggleStatus(task.id, task.completed)} // Toggle task status
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "none",
                  }}
                >
                  {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
