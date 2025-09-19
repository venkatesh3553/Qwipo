
// =================== SQLITE SETUP =================== //
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// =================== DATABASE =================== //
const db = new sqlite3.Database("./customers.db", (err) => {
  if (err) {
    console.error(" Database connection error:", err.message);
  } else {
    console.log(" Connected to SQLite database");
  }
});

// =================== TABLES =================== //
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      address_details TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);
});

// =================== CUSTOMER ROUTES =================== //

// Create a new customer
app.post("/api/customers", (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  db.run(
    `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`,
    [first_name, last_name, phone_number],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, first_name, last_name, phone_number });
    }
  );
});

// Get all customers with their addresses
app.get("/api/customers", (req, res) => {
  db.all(
    `
    SELECT c.id AS customer_id, c.first_name, c.last_name, c.phone_number,
           a.id AS address_id, a.address_details, a.city, a.state, a.pin_code
    FROM customers c
    LEFT JOIN addresses a ON c.id = a.customer_id
    `,
    [],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });

      const customers = {};

      rows.forEach((row) => {
        if (!customers[row.customer_id]) {
          customers[row.customer_id] = {
            id: row.customer_id,
            first_name: row.first_name,
            last_name: row.last_name,
            phone_number: row.phone_number,
            addresses: [],
          };
        }

        if (row.address_id) {
          customers[row.customer_id].addresses.push({
            id: row.address_id,
            address_details: row.address_details,
            city: row.city,
            state: row.state,
            pin_code: row.pin_code,
          });
        }
      });

      res.json(Object.values(customers));
    }
  );
});

// Get single customer with addresses
app.get("/api/customers/:id", (req, res) => {
  const { id } = req.params;

  db.all(
    `
    SELECT c.id AS customer_id, c.first_name, c.last_name, c.phone_number,
           a.id AS address_id, a.address_details, a.city, a.state, a.pin_code
    FROM customers c
    LEFT JOIN addresses a ON c.id = a.customer_id
    WHERE c.id = ?
    `,
    [id],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      if (rows.length === 0)
        return res.status(404).json({ error: "Customer not found" });

      const customer = {
        id: rows[0].customer_id,
        first_name: rows[0].first_name,
        last_name: rows[0].last_name,
        phone_number: rows[0].phone_number,
        addresses: [],
      };

      rows.forEach((row) => {
        if (row.address_id) {
          customer.addresses.push({
            id: row.address_id,
            address_details: row.address_details,
            city: row.city,
            state: row.state,
            pin_code: row.pin_code,
          });
        }
      });

      res.json(customer);
    }
  );
});

// Update customer
app.put("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number } = req.body;

  db.run(
    `UPDATE customers SET first_name=?, last_name=?, phone_number=? WHERE id=?`,
    [first_name, last_name, phone_number, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Delete customer
app.delete("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM customers WHERE id=?`, [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Delete address
app.delete("/api/addresses/:addressId", (req, res) => {
  const { addressId } = req.params;
  db.run(`DELETE FROM addresses WHERE id=?`, [addressId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});


// =================== ADDRESS ROUTES =================== //

// Add new address
app.post("/api/customers/:id/addresses", (req, res) => {
  const { id } = req.params;
  const { address_details, city, state, pin_code } = req.body;

  db.run(
    `INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
     VALUES (?, ?, ?, ?, ?)`,
    [id, address_details, city, state, pin_code],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({
        id: this.lastID,
        customer_id: id,
        address_details,
        city,
        state,
        pin_code,
      });
    }
  );
});

// Get all addresses for a customer
app.get("/api/customers/:id/addresses", (req, res) => {
  const { id } = req.params;
  db.all(`SELECT * FROM addresses WHERE customer_id=?`, [id], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Update address
app.put("/api/addresses/:addressId", (req, res) => {
  const { addressId } = req.params;
  const { address_details, city, state, pin_code } = req.body;

  db.run(
    `UPDATE addresses SET address_details=?, city=?, state=?, pin_code=? WHERE id=?`,
    [address_details, city, state, pin_code, addressId],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Delete address
app.delete("/api/addresses/:addressId", (req, res) => {
  const { addressId } = req.params;
  db.run(`DELETE FROM addresses WHERE id=?`, [addressId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// =================== START SERVER =================== //
app.listen(3001, () => {
  console.log(" Server running at http://localhost:3001");
});


// git remote add origin https://github.com/venkatesh3553/Qwipo_Assignment.git