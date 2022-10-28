// import thought and user models
const { Thought, User } = require('../models');

const thoughtController = {
    // GET all thoughts
    getThoughts(req, res) {
        Thought.find({})
            //   references the reactions collection
            .populate({ path: 'reactions', select: '-__v' })
            //   next line is used to exclude version field
            .select('-__v')
            .then((thoughtData) => res.json(thoughtData))
            .catch((err) => res.status(500).json(err));
    },

    // GET a single thought by ID
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.id })
            // populate lets you reference documents in other collections 
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then((thoughtData) =>
                //   If the user isn't found there will be a 404 error
                //   If the user is found, their data will be returned
                !thoughtData
                    ? res.status(404).json({ message: 'No thought was found with that id' })
                    : res.json(thoughtData)
            )
            .catch((err) => res.status(500).json(err));
    },

    // POST a new thought
    // example data
    // {
    //  "thoughtText": "Here's a thought",
    //  "username": "hammer",
    //  "userId": "5edff358a0fcb779aa7b118b"
    // }
    createThought(req, res) {
        Thought.create(req.body)
            .then(thoughtData => {
                // adds the thought to the user's thought array
                User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: thougthData._id } },
                    { new: true }
                )
                    .then(userData => {
                        !userData
                            ? res.status(404).json({ message: 'No thought was found with that id' })
                            : res.json(userData)
                    })
                    .catch(err => res.json(err));
            })
            .catch((err) => res.status(500).json(err));
    },

    // PUT to update a thought by ID
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true)
            .then(thoughtData => {
                !thoughtData
                    ? res.status(404).json({ message: 'No thought was found with that id' })
                    : res.json(thoughtData)
            })
            .catch((err) => res.status(500).json(err));
    },

    // DELETE to remove thought by ID
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            // if thought data is found, a message will confirm
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought was found with that id' });
                    return;
                }
                User.findOneAndUpdate(
                    { username: thoughtData.username },
                    { $pull: { thoughts: req.params.id } }
                )
                    .then(() => { res.json({ message: 'deleted thought successfully' }); })
                    .catch(err => res.json(err));
            })
            // if the thought is found but unable to be deleted, the following error will be caught
            .catch((err) => res.status(500).json(err));
    },

    // POST to add a reaction
    addReaction(req, res) {
        // finds the thought by id and adds the reaction to its reaction array
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
            .then((thoughtData) => {
                !thoughtData
                    ? res.status(404).json({ message: 'No thought was found with that id' })
                    : res.json(thoughtData)
            })
            .catch((err) => res.status(500).json(err));
    },

    // DELETE to remove a friend
    deleteReaction(req, res) {
        // finds the thought by its id and takes the reaction out
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.body.reactionId } } },
            { new: true }
        )
            .then((thoughtData) => {
                !thoughtData
                    ? res.status(404).json({ message: 'No thought was found with that id' })
                    : res.status(200).json({ message: 'Thought was found' })
            })
            .catch((err) => res.status(500).json(err));
    }
};

// exports thought controller
module.exports = thoughtController;