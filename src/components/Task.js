import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import axios from 'axios';

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
  const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${task.id}`, task);
  return response.data; // Returning updated task from API
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
  await axios.delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`);
  return taskId; // Return taskId to delete it from the state
});

// Task slice for Redux
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {}, // You don't have custom reducers in this example
  extraReducers: (builder) => {
    builder
      // Handling fetch tasks
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
      
      // Handling adding a task
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      
      // Handling task deletion
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      
      // Handling updating task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask; // Update the task in state
        }
      });
  },
});

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create and configure the store
const store = configureStore({
  reducer: {
    tasks: persistReducer(persistConfig, tasksSlice.reducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['REGISTER', 'TASK_ADD'], // Add action types to ignore if necessary
      },
    }),
});

export const persistor = persistStore(store);
export default store;
