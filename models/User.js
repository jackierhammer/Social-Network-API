// imports schema and model from mongoose
const { Schema, model } = require('mongoose');

// creates a new schema for user data
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            // match will verify that the input is a valid email
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
        },
        // an arrray of thoughts referencing the thought model
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought",
            },
        ],
        // an array of friends referencing the user model
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
    }
);

// creates a virtual that retrieves a user's friend count on query
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// creates user model using user schema 
const User = model("User", userSchema);

// exports User
module.exports = User;