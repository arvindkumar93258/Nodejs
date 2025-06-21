
const express = require("express");
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require("../db/Users");


// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

// Helper functions
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// 1. Register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //Create user
        const user = new User({
            email,
            hashedPassword,
            isTwoFactorEnabled: true
        });
        await user.save();
        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
})

// 2. Generate 2FA secret and QR code
router.post("/generate-2fa", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate a secret
        const secret = speakeasy.generateSecret({
            name: `MyApp (${email})`,
            issuer: 'MyApp',
            length: 20  // This is in bytes, not characters
        });

        console.log('Generated Secret:', {
            ascii: secret.ascii,
            hex: secret.hex,
            base32: secret.base32,
            otpauth_url: secret.otpauth_url
        });

        const otpUrl = `otpauth://totp/MyApp:${encodeURIComponent(email)}?secret=${secret.base32}&issuer=MyApp`;

        //Generate QR Code URL
        QRCode.toDataURL(otpUrl, (err, data_url) => {
            if (err) {
                return res.status(500).json({ message: 'Error generating QR code' });
            }
            console.log('OTP Auth URL:', secret.otpauth_url);
            console.log('Base32 Secret:', secret.base32);
            // Save the secret temporarily (you might want to save it to the user after verification)
            res.json({
                secret: secret.base32,
                qrCodeUrl: data_url
            });
        });
    } catch (error) {
        console.log("Erorr: ", error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
})

// 3. Verify 2FA setup and enable it
router.post('/verify-2fa-setup', async (req, res) => {
  try {
    const { email, token, secret } = req.body;
    
    // Basic validation
    if (!token.match(/^\d{6}$/)) {
      return res.status(400).json({ message: 'Token must be 6 digits' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Clean inputs
    const cleanSecret = secret.trim().toUpperCase();
    const cleanToken = token.trim();
    
    // Debug logging
    const currentTimeStep = Math.floor(Date.now() / 1000 / 30);
    console.log('Verification attempt:', {
      email,
      timeStep: currentTimeStep,
      serverTime: new Date()
    });
    
    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: cleanSecret,
      encoding: 'base32',
      token: cleanToken,
      window: 2,
      step: 30,
      algorithm: 'sha1'
    });
    
    // Generate expected token for debugging
    const expectedToken = speakeasy.totp({
      secret: cleanSecret,
      encoding: 'base32',
      step: 30,
      algorithm: 'sha1'
    });
    
    if (verified) {
      user.twoFactorSecret = cleanSecret;
      user.isTwoFactorEnabled = true;
      await user.save();
      
      return res.json({ 
        message: '2FA setup verified and enabled successfully',
        secret: cleanSecret
      });
    } else {
      return res.status(400).json({ 
        message: 'Invalid 2FA token',
        details: {
          receivedToken: cleanToken,
          expectedToken: expectedToken,
          timeStep: currentTimeStep,
          secret: cleanSecret
        }
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      message: 'Error verifying 2FA setup',
      error: error.message 
    });
  }
});

// 4. Login (first step - email/password)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If 2FA is enabled, return a partial token and require 2FA
        if (user.isTwoFactorEnabled) {
            const partialToken = jwt.sign(
                { userId: user._id, needs2FA: true },
                JWT_SECRET,
                { expiresIn: '5m' }
            );

            return res.json({
                message: '2FA required',
                partialToken,
                requires2FA: true
            });
        }

        // If 2FA is not enabled, return full token
        const token = generateToken(user._id);
        res.json({ token, requires2FA: false });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// 5. Verify 2FA token (second step of login)
router.post('/verify-2fa', async (req, res) => {
    try {
        const { partialToken, token } = req.body;

        // Verify the partial token
        let decoded;
        try {
            decoded = jwt.verify(partialToken, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        if (!decoded.needs2FA) {
            return res.status(400).json({ message: '2FA not required for this user' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the 2FA token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (verified) {
            // Generate full token
            const fullToken = generateToken(user._id);
            res.json({ token: fullToken });
        } else {
            res.status(401).json({ message: 'Invalid 2FA token' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying 2FA', error: error.message });
    }
});

// 6. Disable 2FA (requires password verification)
router.post('/disable-2fa', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Disable 2FA
        user.twoFactorSecret = null;
        user.isTwoFactorEnabled = false;
        await user.save();

        res.json({ message: '2FA disabled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error disabling 2FA', error: error.message });
    }
});

module.exports = router;
