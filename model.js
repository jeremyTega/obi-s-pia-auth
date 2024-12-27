const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    passphrase: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '20d'  // Document will be deleted after 20 days
    }
}, {timestamps: true});

const userModel = mongoose.model("piaUser", userSchema);
module.exports = userModel;