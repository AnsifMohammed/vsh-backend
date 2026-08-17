const User = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * @desc User signup
 * @route POST /api/auth/signup
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, dateOfBirth, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !phoneNumber || !dateOfBirth || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        data: {
          required: ["name", "email", "phoneNumber", "dateOfBirth", "password", "confirmPassword"],
          optional: ["role"]
        }
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Validate role if provided (only 'user' or 'admin' allowed)
    let userRole = 'user';
    if (role && role === 'admin') {
      userRole = 'admin';
    }

    // Create new user
    const user = new User({
      name,
      email,
      phoneNumber,
      dateOfBirth,
      password,
      role: userRole,
    });

    await user.save();

    // Create response without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: userRole === 'admin' ? "Admin registered successfully" : "User registered successfully",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

/**
 * @desc User login
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create user response object with explicit role
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/**
 * @desc Request password reset
 * @route POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    
    // Set token expiry (24 hours)
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
    
    await user.save();

    // Create reset URL (you'll use this in your frontend)
    const resetUrl = `${req.protocol}://${req.get("host")}/resetpassword?token=${resetToken}`;

    // Print to console in development
    console.log(`\n🔑 [Password Reset Link] for ${user.email}:\n${resetUrl}\n`);

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent. Link is valid for 24 hours.",
    });

    // TODO: In production, send email with resetUrl instead of returning it
    // Example: await sendEmail({ email: user.email, subject: 'Password Reset', resetUrl });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error.message,
    });
  }
};

/**
 * @desc Reset password
 * @route POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Validation
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now log in with your new password.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

/**
 * @desc Verify reset token
 * @route GET /api/auth/verify-reset-token/:token
 */
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify token",
      error: error.message,
    });
  }
};