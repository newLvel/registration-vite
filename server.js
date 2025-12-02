import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const port = 3001;
const saltRounds = 10; // For bcrypt hashing

app.use(express.json());
app.use(cors());

// Create a new database or open an existing one
const db = new sqlite3.Database('./students.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create the students table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      dateOfBirth TEXT,
      faculty TEXT,
      department TEXT,
      password TEXT NOT NULL,
      matricule TEXT NOT NULL UNIQUE
    )`);
  }
});

// Endpoint to handle student registration
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, dateOfBirth, faculty, department, password } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'First name, last name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const matricule = `IUG-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const sql = `INSERT INTO students (firstName, lastName, email, dateOfBirth, faculty, department, password, matricule) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [firstName, lastName, email, dateOfBirth, faculty, department, hashedPassword, matricule];

    db.run(sql, params, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed: students.email')) {
          return res.status(409).json({ error: 'This email address is already registered.' });
        }
        console.error('Database insertion error:', err.message);
        return res.status(500).json({ error: 'An unexpected error occurred during registration.' });
      }
      
      res.status(201).json({
        id: this.lastID,
        firstName,
        lastName,
        email,
        dateOfBirth,
        faculty,
        department,
        matricule
      });
    });
  } catch (hashError) {
    console.error('Password hashing error:', hashError);
    res.status(500).json({ error: 'An error occurred during password processing.' });
  }
});

// Endpoint to handle student login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required for login.' });
  }

  const sql = `SELECT * FROM students WHERE email = ?`;
  
  db.get(sql, [email], async (err, row) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'An unexpected error occurred during login.' });
    }
    
    if (row) {
      // User found, now compare passwords
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        // Passwords match, return user data (exclude password hash)
        const { password, ...studentData } = row;
        res.status(200).json(studentData);
      } else {
        // Passwords do not match
        res.status(401).json({ message: 'Invalid credentials.' });
      }
    } else {
      // User not found
      res.status(404).json({ message: 'User not found. Please register.' });
    }
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
});
