const mongoose = require("mongoose");
const db = require("../config/connection");
const { User, Thought, reactionSchema } = require("../models");
//...

async function exec() {
  await User.deleteMany({});
  await Thought.deleteMany({});

  await User.create({ username: "John Bob", email: "jb@gmail.com" });
  await User.create({ username: "Mary Lames", email: "ml@gmail.com" });

  const johnThought = await Thought.create({
    thoughtText: "This is a thought",
    username: "John Bob",
  });

  await User.findOneAndUpdate(
    { username: "John Bob" },
    { $push: { thoughts: johnThought._id } },
    { new: true }
  );
  const maryThought = await Thought.create({
    thoughtText: "This is another thought",
    username: "Mary Lames",
  });

  await User.findOneAndUpdate(
    { username: "Mary Lames" },
    { $push: { thoughts: maryThought._id } },
    { new: true }
  );

  console.log("Seeded!");
  mongoose.disconnect();
}

db.once("open", () => {
  exec();
});
