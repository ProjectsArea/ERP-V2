const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['STORE', 'ACCOUNTANT', 'USER'],
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 30,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, {
    timestamps: true,
});


const userModel = mongoose.model("franchiseUsers", userSchema);
module.exports = userModel;