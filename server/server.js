const express = require("express");
const mysql = require("mysql2");
var cors = require("cors");
const bodyParser = require("body-parser");

// Create the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const mysqlConfig = {
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "pass123",
  database: process.env.DB_NAME || "appdb",
};

let con = null;
const databaseInit = () => {
  con = mysql.createConnection(mysqlConfig);
  con.connect((err) => {
    if (err) {
      console.error("Error connecting to the database: ", err);
      return;
    }
    console.log("Connected to the database");
  });
};
// Get all pages
app.get('/api/pages', (req, res) => {
  const sql = 'SELECT id, name, reference, count, create_date, update_date FROM pages';
  databaseInit();
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new page
app.post('/api/pages', (req, res) => {
  const { name, reference } = req.body;
  if (!name || !reference) return res.status(400).json({ error: 'Missing fields' });

  const sql = 'INSERT INTO pages (name, reference, count, create_date, update_date, user_id) VALUES (?, ?, 0, NOW(), NOW(), 1)';
  databaseInit();
  con.query(sql, [name, reference], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Page added', id: result.insertId });
  });
});

// Delete a page by ID
app.delete('/api/pages/:id', (req, res) => {
  const sql = 'DELETE FROM pages WHERE id = ?';
  databaseInit();
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Page deleted' });
  });
});

// Increment count by reference and return new count
app.post('/api/pages/increment/:reference', (req, res) => {
  const { reference } = req.params;

  const updateQuery = `
    UPDATE pages
    SET count = count + 1, update_date = NOW()
    WHERE reference = ?
  `;

  databaseInit();
  con.query(updateQuery, [reference], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Fetch the new count after increment
    const selectQuery = `SELECT count FROM pages WHERE reference = ?`;
    con.query(selectQuery, [reference], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const newCount = rows[0]?.count;
      res.json({ message: `Count incremented to ${newCount}`, count: newCount });
    });
  });
});


// GET request
app.get("/user", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM apptb", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});