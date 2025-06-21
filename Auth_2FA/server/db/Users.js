const mongoose = require("mongoose");


// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    twoFactorSecret: { type: String },
    isTwoFactorEnabled: { type: Boolean, default: false }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;