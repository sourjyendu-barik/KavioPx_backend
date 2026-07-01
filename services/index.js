// function setSecureCookie(res, token) {
//   res.cookie("access_token", token, {
//     httpOnly: true,
//     maxAge: 60 * 1000,
//   });
//   return res;
// }
// module.exports = { setSecureCookie };

function setSecureCookie(res, token) {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true, // Required over HTTPS
    sameSite: "None", // Required for cross-site cookies
    maxAge: 60 * 1000,
  });

  return res;
}
