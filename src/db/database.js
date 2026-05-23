import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("tasks.db");

export const initDB = () => {
  try {
    db.execSync("PRAGMA journal_mode = WAL;");

    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        completed INTEGER DEFAULT 0
      );
    `);

    const tableInfo = db.getAllSync("PRAGMA table_info(tasks)");
    
    const hasSyncStatus = tableInfo.some((column) => column.name === "syncStatus");

    if (!hasSyncStatus) {
      console.log("⚠️ syncStatus column is missing! Injecting migration directly...");
      
      db.execSync("ALTER TABLE tasks ADD COLUMN syncStatus TEXT DEFAULT 'pending';");
      
      console.log("🎉 syncStatus migration completed successfully!");
    } else {
      console.log("✅ tasks table already has the syncStatus column.");
    }

  } catch (error) {
    console.error("Failed to run SQLite initialize configurations:", error);
  }
};