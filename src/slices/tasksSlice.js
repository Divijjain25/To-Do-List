import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch tasks from the API
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch('/api/tasks'); // Ensure this API call is correct
  return response.json();
});

// Action to update task status
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, completed }) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),  // Sending updated status
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Check if response is successful and return updated task
    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    return response.json(); // Return updated task
  }
);

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
      // Handling fetchTasks async action
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
      // Handling updateTaskStatus async action
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;  // Update task status in state
        }
      });
  },
});

export default tasksSlice.reducer;
