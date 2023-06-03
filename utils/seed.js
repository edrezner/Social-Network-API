const mongoose = require("mongoose");
const db = require("../config/connection");
const { User, Thought, reactionSchema } = require("../models");
//...

async function exec() {
  await User.deleteMany({});

  await User.create({ username: "John Bob", email: "jb@gmail.com" });
  await User.create({ username: "Mary Lames", email: "ml@gmail.com" });

  console.log("Seeded!");
  mongoose.disconnect();
}

db.once("open", () => {
  exec();
});
