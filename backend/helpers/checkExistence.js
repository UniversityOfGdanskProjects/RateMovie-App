export const checkRelationshipExistence = async (
  session,
  startLabel,
  startProperty,
  startValue,
  relType,
  endLabel,
  endProperty,
  endValue
) => {
  const query = `
        MATCH (start:${startLabel} {${startProperty}: $startValue})
        MATCH (end:${endLabel} {${endProperty}: $endValue})
        RETURN EXISTS((start)-[:${relType}]->(end)) as exists
    `;

  const result = await session.readTransaction((tx) =>
    tx.run(query, {
      startValue,
      endValue,
    })
  );

  return result.records[0].get("exists");
};

export const checkNodeExistence = async (session, label, property, value) => {
  const query = `MATCH (n:${label} {${property}: $value}) RETURN n`;
  const result = await session.readTransaction((tx) =>
    tx.run(query, { value })
  );

  return result.records.length > 0;
};
