/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const {
  createOnUpdateTrigger,
  dropOnUpdateTrigger,
  createUpdateAtTriggerFunction,
  dropUpdatedAtTriggerFunction,
} = require("../util/db-util");

exports.up = async function (knex) {
  // Create a new table with UUID as primary key
  await knex.schema.createTable("urls_new", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.string("shortCode").notNullable().unique();
    t.text("originalUrl").notNullable();
    t.integer("visitCount").defaultTo(0);
    t.timestamp("createdAt").defaultTo(knex.fn.now());
    t.timestamp("updatedAt").defaultTo(knex.fn.now());
  });

  // Copy data from old table to new table with UUID
  await knex.raw(`
    INSERT INTO urls_new ("shortCode", "originalUrl", "visitCount", "createdAt", "updatedAt")
    SELECT "shortCode", "originalUrl", "visitCount", "createdAt", "updatedAt" FROM urls
  `);

  // Drop old table
  await knex.schema.dropTable("urls");

  // Rename new table to original name
  await knex.schema.renameTable("urls_new", "urls");

  // Re-apply update trigger
  await createOnUpdateTrigger(knex, "urls");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Create a temporary table with integer ID
  await knex.schema.createTable("urls_old", (t) => {
    t.increments("id").primary();
    t.string("shortCode").notNullable().unique();
    t.text("originalUrl").notNullable();
    t.integer("visitCount").defaultTo(0);
    t.timestamp("createdAt").defaultTo(knex.fn.now());
    t.timestamp("updatedAt").defaultTo(knex.fn.now());
  });

  // Copy data from UUID table to integer ID table
  await knex.raw(`
    INSERT INTO urls_old ("shortCode", "originalUrl", "visitCount", "createdAt", "updatedAt")
    SELECT "shortCode", "originalUrl", "visitCount", "createdAt", "updatedAt" FROM urls
  `);

  // Drop UUID table
  await knex.schema.dropTable("urls");

  // Rename table back to original name
  await knex.schema.renameTable("urls_old", "urls");

  // Re-apply update trigger
  await createOnUpdateTrigger(knex, "urls");
};
