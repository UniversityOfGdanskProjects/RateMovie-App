import driver from "../../db/neo4jDriver.js";
import { config } from "dotenv";
import { checkNodeExistence } from "../../helpers/checkExistence.js";
config();

export const registerUser = async (req, res) => {
  const tokenData = req.tokenData;
  const userId = tokenData.sub;
  const username = tokenData.preferred_username;
  const roles = tokenData.realm_access.roles;
  console.log("User ID:", userId);
  console.log("Username:", username);
  console.log("roles", roles);
  // console.log("Token Data:", tokenData);
  const session = driver.session();

  try {
    const userExists = await checkNodeExistence(
      session,
      "User",
      "userId",
      userId
    );
    if (userExists) {
      // jesli uzytkownik istnieje w bazie to zwracam jego dane
      return res.status(201).json({ userId, username, roles });
    }
    // jesli usera nie ma w bazie to tworze nowy wezel
    const result = await session.run(
      "CREATE (user:User {userId: $userId}) RETURN user",
      { userId }
    );

    return res.status(201).json({ userId, username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  } finally {
    await session.close();
  }
};
