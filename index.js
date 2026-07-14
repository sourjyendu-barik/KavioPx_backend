const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cookiParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDb } = require("./db/connectDb");
const authRouter = require("./routes/authRouters");
const app = express();
app.use(cookiParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://kavios-pix-nine.vercel.app"],
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(express.json());
app.get("/", async (req, res) => {
  try {
    res.status(200).send("Api is running");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error api is not running");
  }
});

app.use("/auth", authRouter);

//auth middlewire
const authMiddleware = require("./middlewire/authinticate");
app.use(authMiddleware);
app.get("/me", (req, res) => {
  res.send("Me is running");
});
//logout and mydata
app.use("/user", require("./routes/userRoutes"));
//userdetails
app.use("/details", require("./routes/userDetailsRoutes"));
//album routes
app.use("/albums", require("./routes/albumRouters"));
//image routes
app.use("/albums", require("./routes/imageRouter"));
const PORT = 4000;
const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log("Server is started with port ", PORT);
    });
  } catch (error) {
    console.log("Srver is failed to start.");
    console.error(error);
  }
};
startServer();
