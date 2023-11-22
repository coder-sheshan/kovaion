const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const PORT = 5000;
const dataFilePath = 'data.json';
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

// Get all users
app.get('/users', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const users = JSON.parse(data);
    const user = users.find(u => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const newUser = req.body;
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const users = JSON.parse(data);
    newUser.id = Date.now().toString();
    users.push(newUser);
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    let users = JSON.parse(data);
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      const deletedUser = users.splice(index, 1)[0];
      await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
      res.json(deletedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
