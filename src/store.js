// src/store.js
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default is localStorage

// Async thunks for API calls
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
    return response.data.slice(0, 10); // Limit tasks for simplicity
});

export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
    const response = await axios.post('https://jsonplaceholder.typicode.com/todos', task);
    return response.data; // Return new task
});

export const updateTaskStatus = createAsyncThunk('tasks/updateTask', async (task) => {
    await axios.put(`https://jsonplaceholder.typicode.com/todos/${task.id}`, task);
    return task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`);
    return taskId;
});

// Task slice for Redux
const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
                if (index >= 0) {
                    state.tasks[index] = updatedTask;
                }
            });
    },
});

// Redux Persist configuration
const persistConfig = {
    key: 'root',
    storage, // This can be localStorage or sessionStorage
};

// Apply persistence to the tasks reducer
const persistedReducer = persistReducer(persistConfig, tasksSlice.reducer);

const store = configureStore({
    reducer: {
        tasks: persistedReducer, // Apply persistedReducer here
    },
});

export const persistor = persistStore(store);

export default store;
