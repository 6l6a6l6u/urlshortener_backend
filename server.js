const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const { User } = require('./models');

app.post('/api/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create a new user
    const newUser = new User({
      email,
      firstName,
      lastName,
      password, // Encrypt the password before storing it in the database
      activationToken: generateToken(), // Generate activation token
    });

    // Save the user to the database
    await newUser.save();

    // Send activation email to the user's email address

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/activate/:token', async (req, res) => {
    try {
      const { token } = req.params;
  
      // Find the user with the given activation token
      const user = await User.findOne({ activationToken: token });
      if (!user) {
        return res.status(404).json({ error: 'Invalid token' });
      }
  
      // Activate the user account
      user.isActive = true;
      user.activationToken = '';
  
      // Save the updated user to the database
      await user.save();
  
      res.status(200).json({ message: 'Account activated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  