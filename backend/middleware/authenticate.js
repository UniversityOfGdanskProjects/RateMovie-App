import jwtmod from "jsonwebtoken";

export default async (req, res, next) => {
  console.log("authtenticate sraka kgwoehif");
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  const token = bearerHeader && bearerHeader.split(" ")[1];
  console.log(token);
  if (token === null) return res.sendStatus(401);

  const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.KEYCLOAK_PUBLICKEY}\n-----END PUBLIC KEY-----`;
  console.log("token durgi", token);
  console.log(public_key);
  const decodedToken = jwtmod.verify(token, public_key, {
    algorithms: ["RS256"],
  });

  const { email } = decodedToken;
  console.log("w authie na backu");
  req.user = email;
  next();
};
