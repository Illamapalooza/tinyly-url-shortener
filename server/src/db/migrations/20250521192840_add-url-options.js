/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("urls", (t) => {
    t.timestamp("expiresAt").nullable();
    t.jsonb("utmParams").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("urls", (t) => {
    t.dropColumn("expiresAt");
    t.dropColumn("utmParams");
  });
};
