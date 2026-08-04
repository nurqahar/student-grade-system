/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("setting_rapor", (table) => {
    table.increments("id");
    table.string("school_year", 20).notNullable();
    table.enu("semester", ["1", "2"]).notNullable();
    table.string("rapor_location").notNullable();
    table.date("rapor_date").notNullable();
    table.string("headmaster_name", 50).notNullable();
    table.string("headmaster_nip", 50).defaultTo("-");
    table.decimal("margin_top", 4, 2);
    table.decimal("margin_bottom", 4, 2);
    table.decimal("margin_left", 4, 2);
    table.decimal("margin_right", 4, 2);
    table.timestamps(true, true);
  });
  await knex.schema.createTable("levels", (table) => {
    table.increments("id");
    table.string("level_name").notNullable();
    table.timestamps(true, true);
  });
  await knex.schema.createTable("teachers", (table) => {
    table.increments("id");
    table.integer("teacher_registration_number").notNullable();
    table.string("teacher_name").notNullable();
    table.string("teacher_title").notNullable();
    table.timestamps(true, true);
  });
  await knex.schema.createTable("students", (table) => {
    table.increments("id");
    table.integer("student_nis").notNullable();
    table.string("student_nisn").notNullable();
    table.string("student_name").notNullable();
    table.timestamps(true, true);
  });
  await knex.schema.createTable("classes", (table) => {
    table.increments("id");
    table.integer("level_id").unsigned();
    table.foreign("level_id").references("levels.id").onDelete("CASCADE");
    table.string("class_name").notNullable();
    table.timestamps(true, true);
  });
  await knex.schema.createTable("subjects", (table) => {
    table.increments("id");
    table.string("subject_name").notNullable();
    table.enu("subject_type",["umum","kejuruan","mulok","pilihan"],{
      useNative:true,
      enumName:"type",
    }).notNullable();
    table.smallint("order").notNullable()
    table.string("competency_achievement", 400);
    table.string("school_year", 255).notNullable();
    table.integer("semester").notNullable();
    table.integer("class_id").unsigned();
    table.foreign("class_id").references("classes.id").onDelete("CASCADE");
    table.timestamps(true, true);
  });
  await knex.schema.createTable("history_student", (table) => {
    table.increments("id");
    table.integer("student_id").unsigned();
    table.foreign("student_id").references("students.id").onDelete("CASCADE");
    table.integer("class_id").unsigned();
    table.foreign("class_id").references("classes.id").onDelete("CASCADE");
    table.string("school_year", 255).notNullable();
    table.integer("semester").notNullable();
    table.integer("class_advisor_id").notNullable();
    table
      .foreign("class_advisor_id")
      .references("teachers.id")
      .onDelete("CASCADE");
    table.string("class_advisor_note", 400).unsigned();
    table.string("status", 255).notNullable();
    table.timestamps(true, true);
  });
  await knex.schema.createTable("absence", (table) => {
    table.increments("id");
    table.integer("history_id").unsigned();
    table
      .foreign("history_id")
      .references("history_student.id")
      .onDelete("CASCADE");
    table.string("sakit").notNullable();
    table.string("izin").notNullable();
    table.string("alpa").notNullable();
    table.timestamps(true, true);
  });
  await knex.schema.createTable("assessment", (table) => {
    table.increments("id");
    table.integer("history_id").unsigned();
    table
      .foreign("history_id")
      .references("history_student.id")
      .onDelete("CASCADE");
    table.integer("subject_id").unsigned();
    table.foreign("subject_id").references("subjects.id").onDelete("CASCADE");
    table.integer("numeric_grade").notNullable();
    table.string("letter_grade");
    table.string("grade_type").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("assessment");
  await knex.schema.dropTable("absence");
  await knex.schema.dropTable("history_student");
  await knex.schema.dropTable("subjects");
  await knex.schema.dropTable("classes");
  await knex.schema.dropTable("students");
  await knex.schema.dropTable("teachers");
  await knex.schema.dropTable("levels");
  await knex.schema.dropTable("setting_rapor");
};
