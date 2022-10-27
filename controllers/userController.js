// import thought and user models
const {Thought, User} = require('../models');

const userController = {
    // GET all users
    getUsers(req, res) {
      User.find({})
    //   next line is used to exclude version field
        .select('-__v')
        .then((userData) => res.json(userData))
        .catch((err) => res.status(500).json(err));
    },

    // GET a single user by ID
    getUserById(req, res) {
        User.findOne({_id: req.params.id})
        // populate lets you reference documents in other collections 
        .populate([
            {path: 'thoughts', select: '-__v'},
            {path: 'friends', select: '-__v'}
        ])
        .select('-__v')
        .then((userData) =>
        //   If the user isn't found there will be a 404 error
        //   If the user is found, their data will be returned
          !userData
            ? res.status(404).json({ message: 'No user was found with that id' })
            : res.json(userData)
        )
        .catch((err) => res.status(500).json(err));
    },

    // POST a new user
    // example data
    // {
    //  "username": "hammer",
    //  "email": "hammer@gmail.com"
    // }
    createUser(req, res) {
        User.create(req.body)
        .then(userData => res.json(userData))
        .catch((err) => res.status(500).json(err));
    },

    // PUT to update a user by ID
    updateUser(req, res) {
        User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true)
        .then(userData => {
            !userData
            ? res.status(404).json({ message: 'No user was found with that id' })
            : res.json(userData)
        })
        .catch((err) => res.status(500).json(err)); 
    },

    // DELETE to remove user by ID
    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.id})
        // if user data is found, a message will confirm
        .then(userData => {
            !userData
            ? res.status(404).json({ message: 'No user was found with that id' })
            : res.status(200).json({ message: 'User was found. Attempting to delete'})
        })
        // if the user is found but unable to be deleted, the following error will be caught
        .catch((err) => res.status(500).json(err));
    },

    // POST to add a friend
    addFriend(req, res) {
        User.findByIdAndUpdate(
            req.params.id,
            {$push: {friends: req.params.friendId}},
            {new: true}
        )
        .then((friendData) => {
            !friendData
            ? res.status(404).json({ message: 'No user was found with that id' })
            : res.status(200).json({ message: 'User was found', user: friendData})
        })
        .catch((err) => res.status(500).json(err));
    },

    // DELETE to remove a friend
    deleteFriend(req, res) {
        User.findByIdAndUpdate(
            req.params.id,
            {$pull: {friends: req.params.friendId}},
            {new: true}
        )
        .then((friendData) => {
            !friendData
            ? res.status(404).json({ message: 'No user was found with that id' })
            : res.status(200).json({ message: 'User was found', user: friendData})
        })
        .catch((err) => res.status(500).json(err));
    }
};

// export user controller
module.exports = userController;