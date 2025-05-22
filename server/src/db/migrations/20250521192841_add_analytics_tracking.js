/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create URL clicks table to track analytics
  await knex.schema.createTable("url_clicks", (t) => {
    t.increments("id").primary();
    t.string("shortCode").notNullable().index();
    t.string("visitorId").notNullable().index();
    t.string("deviceType").nullable();
    t.string("browser").nullable();
    t.string("os").nullable();
    t.string("ipAddress").nullable();
    t.timestamp("clickedAt").defaultTo(knex.fn.now());

    t.foreign("shortCode").references("urls.shortCode").onDelete("CASCADE");
  });

  // Add uniqueVisitCount column to urls table
  await knex.schema.alterTable("urls", (t) => {
    t.integer("uniqueVisitCount").defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("url_clicks");

  await knex.schema.alterTable("urls", (t) => {
    t.dropColumn("uniqueVisitCount");
  });
};
