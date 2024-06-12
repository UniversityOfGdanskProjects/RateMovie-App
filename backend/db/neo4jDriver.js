import neo4j from "neo4j-driver";

import { config } from "dotenv";

config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
  { disableLosslessIntegers: true }
);

export default driver;

// docker run --restart always \
// --publish=7474:7474 --publish=7687:7687 --env NEO4J_AUTH=neo4j/password
// --volume ./neo4jdata:/data --name dbneo4j neo4j:latest
