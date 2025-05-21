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
  if (!(await knex.schema.hasTable("urls"))) {
    await knex.schema.createTable("urls", (t) => {
      t.increments("id").primary();
      t.string("shortCode").notNullable().unique();
      t.text("originalUrl").notNullable();
      t.integer("visitCount").defaultTo(0);
      t.timestamp("createdAt").defaultTo(knex.fn.now());
      t.timestamp("updatedAt").defaultTo(knex.fn.now());
    });

    await createUpdateAtTriggerFunction(knex);
    // needed to auto update the updated_at column
    await createOnUpdateTrigger(knex, "urls");
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  if (await knex.schema.hasTable("urls")) {
    await knex.schema.dropTable("urls");
    await dropOnUpdateTrigger(knex, "urls");
    await dropUpdatedAtTriggerFunction(knex);
  }
};
