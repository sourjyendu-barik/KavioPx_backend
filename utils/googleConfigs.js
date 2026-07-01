const { google } = require("googleapis");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENTSECRET = process.env.GOOGLE_CLIENTSECRET;

// console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENTSECRET);
exports.oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENTSECRET,
  "postmessage",
);
