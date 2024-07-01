const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

// Database configuration
const dbConfig = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    database: 'your_database'
};

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from "public" directory

// Route to handle registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Connect to the database
        await sql.connect(dbConfig);

        // Insert user data into the Users table
        const result = await sql.query`
            INSERT INTO Users (Username, Email, PasswordHash)
            VALUES (${username}, ${email}, HASHBYTES('SHA2_256', ${password}))
        `;

        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Database error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
