const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "script")));
app.use(express.static(path.join(__dirname, "node_modules")));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  cookieSession({
    name: "MMS Hopper",
    keys: ["Ajinomoto, MMS"],
    maxAge: process.env.SESSION_TIME,
  })
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   res.setHeader("Access-Control-Allow-Credentials", true);
//   console.log(req.cookies);
//   next();
// });

// const io = require("socket.io")(server);
// app.set("socketio", io);

const indexRoute = require("./routes/index");
const authRoute = require("./routes/auth");

const planRoute = require("./routes/plan");
const recordRoute = require("./routes/hopper/record");
const downtimeRoute = require("./routes/hopper/downtime");
const operatorRoute = require("./routes/hopper/operator");

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/plan", planRoute);

app.use("/hopper/record", recordRoute);
app.use("/hopper/downtime", downtimeRoute);
app.use("/hopper/operator", operatorRoute);

// Error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ message: `${err.message}` });
});

// Not Found
app.all("*", (req, res) => {
  res.status(404).send("<h1>resource not found</h1>");
});

module.exports = app;
