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
      return res.status(201).json({ userId, username });
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

// export const registerUser = async (req, res) => {
//   const { username, email, password } = req.body;
//   const session = driver.session();

//   if (
//     !isValidEmail(email) ||
//     !isValidUsername(username) ||
//     !isValidPassword(password)
//   ) {
//     res.status(400).json({ error: "Invalid input format" });
//     return;
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const checkEmailResult = await session.run(
//       "MATCH (user:User {email: $email}) RETURN user",
//       { email }
//     );

//     if (checkEmailResult.records.length > 0) {
//       res.status(400).json({ error: "Email is already registered" });
//       return;
//     }

//     const checkUsernameResult = await session.run(
//       "MATCH (user:User {username: $username}) RETURN user",
//       { username }
//     );

//     if (checkUsernameResult.records.length > 0) {
//       res.status(400).json({ error: "Username is already taken" });
//       return;
//     }

//     const result = await session.run(
//       "CREATE (user:User {userId: $userId, username: $username, email: $email, password: $password, isAdmin: false}) RETURN user",
//       { userId: uuidv4(), username, email, password: hashedPassword }
//     );

//     const newUser = result.records[0].get("user").properties;
//     res
//       .status(201)
//       .json({ message: "User registered successfully", user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     await session.close();
//   }
// };

// export const loginUser = async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password);
//   console.log(process.env.KEYCLOAK_CLIENT);
//   try {
//     const response = await axios.post(
//       `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
//       qs.stringify({
//         client_id: process.env.KEYCLOAK_CLIENT,
//         grant_type: "password",
//         username,
//         password,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const { access_token, refresh_token } = response.data;

//     res.status(200).json({
//       message: "Login successful",
//       token: access_token,
//       refreshToken: refresh_token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: "Invalid username or password" });
//   }
// };

// export const loginUser = async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password);
//   const session = driver.session();

//   try {
//     const userResult = await session.run(
//       "MATCH (user:User {username: $username}) RETURN user",
//       { username }
//     );

//     if (userResult.records.length === 0) {
//       res.status(401).json({ error: "Invalid username or password" });
//       return;
//     }

//     const storedHashedPassword =
//       userResult.records[0].get("user").properties.password;

//     const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

//     if (!passwordMatch) {
//       res.status(401).json({ error: "Invalid username or password" });
//       return;
//     }

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         username: userResult.records[0].get("user").properties.username,
//         id: userResult.records[0].get("user").properties.userId,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     await session.close();
//   }
// };
