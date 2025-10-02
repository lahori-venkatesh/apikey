const express = require('express');
const bcrypt = require('bcryptjs');
const jwtService = require('../services/jwtService');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const tempStorage = require('../temp-storage');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let user;
    
    try {
      // Try MongoDB first
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create user in MongoDB (password will be hashed automatically)
      user = await User.createUser({
        name,
        email: email.toLowerCase(),
        password,
        emailVerified: false
      });

      console.log('✅ User stored in MongoDB:', user.email);
    } catch (mongoError) {
      console.log('⚠️  MongoDB not available, using temporary storage');
      
      // Fallback to temp storage
      const existingUser = tempStorage.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password manually for temp storage
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = tempStorage.createUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: false
      });
    }

    // Also store in temp storage for consistency
    if (user._id) {
      const tempUser = tempStorage.findUserByEmail(email);
      if (!tempUser) {
        tempStorage.createUser({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt || new Date(),
          lastLogin: user.lastLogin || new Date()
        });
      }
    }

    // Generate JWT token
    const token = jwtService.generateToken(user._id);

    console.log('✅ User registered successfully:', user.email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let user;
    
    try {
      // Try MongoDB authentication first
      const authResult = await User.authenticate(email, password);
      
      if (!authResult.success) {
        return res.status(400).json({ message: authResult.message });
      }

      user = authResult.user;
      console.log('✅ User authenticated via MongoDB:', user.email);
    } catch (mongoError) {
      console.log('⚠️  MongoDB not available, using temporary storage');
      
      // Fallback to temp storage authentication
      const tempUser = tempStorage.findUserByEmail(email);
      if (!tempUser) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, tempUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      user = tempUser;
      console.log('✅ User authenticated via temporary storage:', user.email);
    }

    // Update temp storage for backward compatibility
    const tempUser = tempStorage.findUserByEmail(email);
    if (tempUser) {
      tempStorage.updateUser(tempUser._id, { lastLogin: new Date() });
    } else {
      tempStorage.createUser({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      });
    }

    // Generate JWT token
    const token = jwtService.generateToken(user._id);

    console.log('✅ User logged in successfully:', user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token
router.get('/verify', authenticate, async (req, res) => {
  try {
    // Try to find user in MongoDB first
    let user = await User.findById(req.userId);
    
    if (!user) {
      // Fallback to temp storage
      user = tempStorage.findUserById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    // Try to find user in MongoDB first
    let user = await User.findById(req.userId);
    
    if (!user) {
      // Fallback to temp storage
      user = tempStorage.findUserById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        jobTitle: user.jobTitle,
        phone: user.phone,
        timezone: user.timezone,
        language: user.language,
        plan: user.plan,
        emailNotifications: user.emailNotifications,
        securityAlerts: user.securityAlerts,
        marketingEmails: user.marketingEmails,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updateData = req.body;
    
    // Update in MongoDB
    const user = await User.findByIdAndUpdate(
      req.userId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update temp storage for backward compatibility
    const tempUser = tempStorage.findUserById(req.userId);
    if (tempUser) {
      tempStorage.updateUser(req.userId, updateData);
    }

    console.log('✅ User profile updated:', user.email);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        jobTitle: user.jobTitle,
        phone: user.phone,
        timezone: user.timezone,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Decode the Google JWT token (in production, verify with Google)
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const googleUser = JSON.parse(jsonPayload);
    
    // Check if user exists in MongoDB
    let user = await User.findByEmail(googleUser.email);
    
    if (!user) {
      // Create new user in MongoDB
      user = await User.createUser({
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        googleId: googleUser.sub,
        avatar: googleUser.picture,
        emailVerified: googleUser.email_verified
      });

      // Also create in temp storage
      tempStorage.createUser({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      });
    } else {
      // Update existing user with Google info
      user.googleId = googleUser.sub;
      user.avatar = googleUser.picture;
      user.lastLogin = new Date();
      await user.save();

      // Update temp storage
      const tempUser = tempStorage.findUserByEmail(googleUser.email);
      if (tempUser) {
        tempStorage.updateUser(tempUser._id, {
          googleId: googleUser.sub,
          avatar: googleUser.picture,
          lastLogin: new Date()
        });
      }
    }

    // Generate JWT token
    const token = jwtService.generateToken(user._id);

    console.log('✅ Google OAuth login successful:', user.email);

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;