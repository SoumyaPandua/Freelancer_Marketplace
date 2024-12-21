import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js'; // Adjust the path as needed

// JWT Secret and Cookie Options
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// Register Controller
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the role matches
        if (user.role !== role) {
            return res.status(403).json({ message: 'Role does not match' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d',
        });

        // Store token in cookie
        res.cookie('token', token, COOKIE_OPTIONS);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout Controller
export const logout = (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token', COOKIE_OPTIONS);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Profile Update Controller
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming authentication middleware sets req.user
        const { name, password, profileImage, skills, portfolio, hourlyRate, companyName, bio, location, role } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prevent email and role updates
        if (req.body.email || req.body.role) {
            return res.status(400).json({ success: false, message: "Email and role cannot be updated" });
        }

        // Role-based field update logic
        if (user.role === 'admin') {
            if (name) user.name = name;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            if (profileImage) user.profileImage = profileImage;
            if (location) user.location = location;
        } else if (user.role === 'freelancer') {
            if (name) user.name = name;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            if (profileImage) user.profileImage = profileImage;
            if (skills) user.skills = Array.isArray(skills) ? skills : user.skills;
            if (portfolio) user.portfolio = Array.isArray(portfolio) ? portfolio : user.portfolio;
            if (hourlyRate) user.hourlyRate = Math.max(0, hourlyRate);
            if (companyName) user.companyName = companyName;
            if (bio) user.bio = bio;
            if (location) user.location = location;
        } else if (user.role === 'client') {
            if (name) user.name = name;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            if (profileImage) user.profileImage = profileImage;
            if (bio) user.bio = bio;
            if (location) user.location = location;
        }

        // Save updated user
        const updatedUser = await user.save();

        // Prepare response object
        const response = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage,
            skills: updatedUser.skills,
            portfolio: updatedUser.portfolio,
            hourlyRate: updatedUser.hourlyRate,
            companyName: updatedUser.companyName,
            bio: updatedUser.bio,
            location: updatedUser.location,
            isVerified: updatedUser.isVerified,
            updatedAt: updatedUser.updatedAt,
        };

        res.status(200).json({ success: true, message: "Profile updated successfully", data: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete Profile Controller (Admin Only)
export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user ID is provided
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch Profile Controller
export const fetchProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user is set by the isAuthentication middleware

        // Find the user by ID, excluding the password field
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Profile fetched successfully', data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Fetch All Users Controller
export const fetchAllUsers = async (req, res) => {
    try {
        // Fetch all users excluding sensitive fields like passwords
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Delete User Controller
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user ID is provided
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};