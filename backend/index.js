const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
let connection;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM todos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new todo
app.post("/add", async (req, res) => {
  try {
    const { description } = req.body;
    const [result] = await connection.query(
      "INSERT INTO todos (description) VALUES (?)",
      [description]
    );
    res.json({ id: result.insertId, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a todo
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await connection.query("DELETE FROM todos WHERE id = ?", [id]);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a todo
app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await connection.query("UPDATE todos SET description = ? WHERE id = ?", [
      description,
      id,
    ]);
    res.json({ id, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get("/test", (req, res) => {
  res.send("This is working");
});

// Root route
app.get("/", (req, res) => {
  res.send("App is running");
});

const PORT = process.env.PORT || 3001;

// Function to create database connection
const createDbConnection = () => {
  const dbConfig = {
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "password",
    database: process.env.MYSQL_DATABASE || "todo_app",
  };

  // If the CLOUD_SQL_CONNECTION_NAME variable is set, we're in a GCP environment
  // and should use the Cloud SQL socket for a secure connection.
  if (process.env.CLOUD_SQL_CONNECTION_NAME) {
    dbConfig.socketPath = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
  } else {
    // Otherwise, we're likely local, so use the standard host.
    dbConfig.host = process.env.MYSQL_HOST || "localhost";
  }
  return mysql.createConnection(dbConfig);
};


// Main function to start the server
const startServer = async () => {
  try {
    connection = await createDbConnection();
    console.log("Database connection successful!");
    
    // The setupDb function is not needed in production, as the database and table
    // should already exist. It can cause permission issues. We'll skip it for now.
    // await setupDb(connection); 

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit if we can't connect to the DB
  }
};

startServer();
