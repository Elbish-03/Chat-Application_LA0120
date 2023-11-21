
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;
app.listen(port, () => console.log(`API ist live on http://localhost:${port}`));


//LOGIN || REGISTER

app.get("/", async(req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get("/To")

mongoose.connect(
    "mongodb+srv://admin:kali@chat-application.1tsxyfg.mongodb.net/Chat_Users",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  
  const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
  
  const User = mongoose.model("User", userSchema);
  

  app.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      res.status(201).send("User created successfully");
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send("Cannot find user");
      }
  
      if (await bcrypt.compare(password, user.password)) {
        const loginMessage = `Hello ${username}`;
        res.render("home", {
          title: "Login",
          loginMessage: loginMessage,
        });
      } else {
        res.status(401).send("Wrong username or password");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });