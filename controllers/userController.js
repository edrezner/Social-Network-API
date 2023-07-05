const { User, Thought } = require("../models");

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({})
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v")
        .sort({ username: 1 });
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }
      res.json(user);
    } catch {
      (err) => {
        console.log(err);
        res.status(500).json(err);
      };
    }
  },

  async addUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch {
      (err) => res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          ...req.body,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }
      res.json(user);
    } catch {
      (err) => res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    // try {
    const user = await User.findOneAndDelete({ _id: req.params.userId }).catch(
      (err) => {
        res.json(err);
      }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that ID" });
    }
    await Thought.deleteMany({ username: user.username });
    res.json({ message: "User and associated thoughts deleted" });
    // } catch {
    //   (err) => res.status(500).json(err);
    // }
  },

  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
      )
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }
      res.json(user);
    } catch {
      (err) => res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }
      res.json(user);
    } catch {
      (err) => res.status(500).json(err);
    }
  },
};

//    Querying users
//   User.find()
//     .then((users) => {
//       console.log('Users:', users);
//     })
//     .catch((error) => {
//       console.error('Error querying users:', error);
//     });
// })
// .catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });
