const User = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/notifications");

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

    // Compute frontend base URL (supporting localhost:5173 / production)
    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : "");
    const frontendBase = process.env.FRONTEND_URL || origin || "http://localhost:5173";
    const resetUrl = `${frontendBase}/resetpassword?token=${resetToken}`;

    // Log to console for debugging/development
    console.log(`\n🔑 [Password Reset Link] for ${user.email}:\n${resetUrl}\n`);

    // Send email via Brevo
    try {
      const emailSent = await sendEmail({
        toEmail: user.email,
        toName: user.name || user.email,
        subject: "Password Reset Request - Vayushri Hospital",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e9d5ff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #6B3FA0 0%, #4A247A 100%); padding: 30px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Vayushri Hospital</h2>
              <p style="color: #e9d5ff; margin: 8px 0 0 0; font-size: 14px;">Password Reset Request</p>
            </div>
            
            <div style="padding: 30px 25px;">
              <p style="color: #333333; font-size: 16px; margin-top: 0;">Hello <strong>${user.name || "there"}</strong>,</p>
              <p style="color: #555555; font-size: 14px; line-height: 1.6;">We received a request to reset your password for your Vayushri Hospital portal account. Click the button below to create a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #6B3FA0 0%, #7C3AED 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(107, 63, 160, 0.4);">Reset My Password</a>
              </div>
              
              <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 12px; margin: 20px 0;">
                <p style="margin: 0; color: #6b21a8; font-size: 12px;"><strong>Note:</strong> This reset link is valid for <strong>24 hours</strong>. If you did not make this request, you can safely ignore this email.</p>
              </div>
              
              <p style="color: #777777; font-size: 12px; margin-top: 25px; border-top: 1px solid #eeeeee; padding-top: 15px;">
                Need assistance? Call our 24/7 help desk at <strong>+91 77085 55635</strong> or email <strong>vyushriivfhospital@gmail.com</strong>.
              </p>
            </div>
          </div>
        `,
      });

      if (!emailSent) {
        console.warn(`⚠️ [Brevo] Email dispatch returned false for ${user.email}`);
      }
    } catch (emailErr) {
      console.error("❌ Password reset email dispatch error:", emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email. Link is valid for 24 hours.",
    });

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