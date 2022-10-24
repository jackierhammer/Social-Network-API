// imports schema and model from mongoose
const {Schema, model} = require('mongoose');
// imports date formatting helpers
const dateFormat = require('../utils/dateFormat');

// first, we make the reaction schema so that the thought schema can reference it
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtValue) => dateFormat(createdAtValue),
        },
    },
    {
        toJSON: {
            // this time we only need getters, not virtuals
            getters: true,
        },
    }
);

// here, we make the thought schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtValue) => dateFormat(createdAtValue),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [
            reactionSchema
        ],
    },
    {
        toJSON: {
            // here, we need virtuals and getters
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// creates a virtual that retrieves a thought's reaction count on query
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// creates thought model using thought schema
const Thought = model("Thought", thoughtSchema);

// exports Thought
module.exports = Thought;