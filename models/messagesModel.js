const mongoose = require('mongoose');
mongoose.pluralize(null);

const messageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("chatmessage", messageSchema);