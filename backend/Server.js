const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware
const { createPool } = require("mysql"); // Import MySQL connection pool

const app = express(); // Initialize Express app
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

const database = createPool({
  host: "localhost", // Hostname of the database server
  user: "root", // Database username
  password: "", // Database password
  database: "triganana_dootha", // Name of the database
});

/***********************************
 * User Registration
 * Fucntionality to register a new user.
 * Features:
 * - Checks if the email is already registered.
 * - Inserts new user data into the database.
 * - Returns success or error messages.
 ***********************************/
app.post("/api/register", async (req, res) => {
  // Handle user registration
  try {
    const { id, firstname, lastname, phone, age, gender, email, password } =
      req.body;
    const [exists] = database.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length > 0)
      return res.status(400).json({ message: "Email already registered." });
    database.query(
      "INSERT INTO users (id, firstname, lastname, phone, age, gender, email, password)",
      [id, firstname, lastname, phone, age, gender, email, password]
    );
    res.json({ message: "Registered successfully!" });
  } catch (error) {
    //
    console.error("Registration form error:", error);
    res.status(500).json({ message: "Server Error." });
  }
});

/***********************************
 * User Login
 * Fucntionality to authenticate a user.
 * Features:
 * - Validates user credentials against the database.
 * - Returns success or error messages.
 ***********************************/
app.post("/api/login", async (req, res) => {
  // Handle user login
  try {
    const { email, password } = req.body;
    const [rows] = database.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "Account not found." });
    const user = rows[0];
    const isMatched = user.password === password;
    if (!isMatched)
      return res.status(400).json({ message: "Invalid credentials" });
    if (isMatched)
      return res.status(200).json({
        message: "Login successful!",
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          email: user.email,
          password: user.password
        }
      });
  }
  // Error handling
  catch (error) {
    console.error("Login form error:", error);
    res.status(500).json({ message: "Server error." });
  }
});
