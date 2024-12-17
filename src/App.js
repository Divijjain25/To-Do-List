// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import AddTaskPage from './components/AddTaskPage';
import EditTaskPage from './components/EditTaskPage'; // Ensure to import EditTaskPage
import EditTaskForm from "./components/EditTaskForm";
import './style.css';

function App() {
    return (
        <div>
            <header className="navbar">
                <div className="container">
                    <h1 className="logo">To-Do List</h1>
                    <nav>
                        <ul className="nav-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/add">Add Task</a></li>
                            <li><a href="/edit">Edit Task</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main>
            
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add" element={<AddTaskPage />} />
                    <Route path="/edit" element={<EditTaskPage />} /> {/* Route for listing tasks */}
                    <Route path="/edit/:id" element={<EditTaskPage />} /> {/* Edit task route */}
                    <Route path="/edit/:taskId" element={<EditTaskForm />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
