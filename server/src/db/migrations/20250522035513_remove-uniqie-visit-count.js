/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Remove uniqueVisitCount column from urls table
  await knex.schema.alterTable("urls", (t) => {
    t.dropColumn("uniqueVisitCount");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Add uniqueVisitCount column back to urls table
  await knex.schema.alterTable("urls", (t) => {
    t.integer("uniqueVisitCount").defaultTo(0);
  });
};
