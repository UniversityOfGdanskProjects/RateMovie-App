import driver from "../../db/neo4jDriver.js";
import { config } from "dotenv";
import { checkNodeExistence } from "../../helpers/checkExistence.js";
config();

export const registerUser = async (req, res) => {
  const tokenData = req.tokenData;
  const userId = tokenData.sub;
  const username = tokenData.preferred_username;
  const roles = tokenData.realm_access.roles;
  const session = driver.session();

  try {
    const userExists = await checkNodeExistence(
      session,
      "User",
      "userId",
      userId
    );
    if (userExists) {
      return res.status(201).json({ userId, username, roles });
    }
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
