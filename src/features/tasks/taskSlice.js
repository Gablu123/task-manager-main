import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../db/database";

export const loadTasks = createAsyncThunk("tasks/load", async () => {
  const result = await db.getAllAsync("SELECT * FROM tasks");

  return result.map((t) => ({
    ...t,
    completed: !!t.completed,
    syncStatus: t.syncStatus || "pending",
  }));
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },

  reducers: {

    addTask: (state, action) => {
      const task = {
        ...action.payload,
        syncStatus: "pending",
      };

      db.runAsync(
        "INSERT INTO tasks (id, title, completed, syncStatus) VALUES (?, ?, ?, ?)",
        [task.id, task.title, task.completed ? 1 : 0, task.syncStatus]
      );

      state.tasks.push(task);
    },

    deleteTask: (state, action) => {
      const id = action.payload;
      const task = state.tasks.find((t) => t.id === id);

      if (task) {
        task.syncStatus = "deleted";

        db.runAsync(
          "UPDATE tasks SET syncStatus = ? WHERE id = ?",
          ["deleted", id]
        );
      }
    },

    toggleTask: (state, action) => {
      const id = action.payload;
      const task = state.tasks.find((t) => t.id === id);

      if (task) {
        task.completed = !task.completed;
        task.syncStatus = "pending";

        db.runAsync(
          "UPDATE tasks SET completed = ?, syncStatus = ? WHERE id = ?",
          [task.completed ? 1 : 0, "pending", id]
        );
      }
    },

    editTask: (state, action) => {
      const { id, title } = action.payload;
      const task = state.tasks.find((t) => t.id === id);

      if (task) {
        task.title = title;
        task.syncStatus = "pending";

        db.runAsync(
          "UPDATE tasks SET title = ?, syncStatus = ? WHERE id = ?",
          [title, "pending", id]
        );
      }
    },

    markTaskSynced: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);

      if (task) {
        task.syncStatus = "synced";

        db.runAsync(
          "UPDATE tasks SET syncStatus = ? WHERE id = ?",
          ["synced", action.payload]
        );
      }
    },

    removeTaskLocally: (state, action) => {
      const id = action.payload;

      db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);

      state.tasks = state.tasks.filter((t) => t.id !== id);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export const {
  addTask,
  deleteTask,
  toggleTask,
  editTask,
  markTaskSynced,
  removeTaskLocally,
} = taskSlice.actions;

export default taskSlice.reducer;