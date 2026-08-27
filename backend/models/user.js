const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "Travel enthusiast & explorer"
    },
    isSuperhost: {
        type: Boolean,
        default: false
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);