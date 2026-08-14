import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  role: text("role").default("student"),
  hscBatch: text("hsc_batch"),
  college: text("college"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const profiles = user;

export const containers = sqliteTable("containers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  containerId: text("container_id")
    .notNull()
    .references(() => containers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code"),
  slug: text("slug").notNull().unique(),
});

export const subitems = sqliteTable("subitems", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  itemId: text("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  paper: text("paper"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  orderNo: integer("order_no").default(0).notNull(),
});

export const topics = sqliteTable("topics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  subitemId: text("subitem_id")
    .notNull()
    .references(() => subitems.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const questions = sqliteTable("questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  subitemId: text("subitem_id")
    .notNull()
    .references(() => subitems.id, { onDelete: "cascade" }),
  topicId: text("topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  type: text("type", { enum: ["mcq", "cq"] }).notNull(),
  source: text("source").notNull(),
  standard: text("standard").default("HSC").notNull(),
  questionText: text("question_text").notNull(),
  explanation: text("explanation"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const mcqOptions = sqliteTable("mcq_options", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  optionText: text("option_text").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" })
    .default(false)
    .notNull(),
  orderNo: integer("order_no").default(0).notNull(),
});

export const cqParts = sqliteTable("cq_parts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  partKey: text("part_key", { enum: ["a", "b", "c", "d"] }).notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text"),
  marks: integer("marks").notNull(),
  orderNo: integer("order_no").notNull(),
});

export const tags = sqliteTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
});

export const questionTags = sqliteTable("question_tags", {
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
});

export const exams = sqliteTable("exams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", {
    enum: ["practice", "chapter_test", "weekly", "model_test"],
  })
    .default("practice")
    .notNull(),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  totalMarks: integer("total_marks").default(25).notNull(),
  negativeMarking: text("negative_marking").default("0.25").notNull(),
  startsAt: text("starts_at"),
  endsAt: text("ends_at"),
  isPublished: integer("is_published", { mode: "boolean" })
    .default(false)
    .notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const examQuestions = sqliteTable("exam_questions", {
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  marks: integer("marks").default(1).notNull(),
  orderNo: integer("order_no").default(0).notNull(),
});

export const batches = sqliteTable("batches", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  hscYear: text("hsc_year").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const batchExams = sqliteTable("batch_exams", {
  batchId: text("batch_id")
    .notNull()
    .references(() => batches.id, { onDelete: "cascade" }),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  assignedAt: text("assigned_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const examRoutines = sqliteTable("exam_routines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  batchId: text("batch_id")
    .notNull()
    .references(() => batches.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  syllabus: text("syllabus"),
  examDate: text("exam_date").notNull(),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  totalMarks: integer("total_marks").default(25).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const pdfSuggestions = sqliteTable("pdf_suggestions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  paper: text("paper").default("1st").notNull(),
  chapter: text("chapter"),
  hscBatch: text("hsc_batch"),
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  downloadCount: integer("download_count").default(0).notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .default(false)
    .notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const polls = sqliteTable("polls", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  questionText: text("question_text").notNull(),
  subject: text("subject"),
  chapter: text("chapter"),
  explanation: text("explanation"),
  expiresAt: text("expires_at"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const pollOptions = sqliteTable("poll_options", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  pollId: text("poll_id")
    .notNull()
    .references(() => polls.id, { onDelete: "cascade" }),
  optionText: text("option_text").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" })
    .default(false)
    .notNull(),
  votesCount: integer("votes_count").default(0).notNull(),
  orderNo: integer("order_no").default(0).notNull(),
});

export const pollVotes = sqliteTable("poll_votes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  pollId: text("poll_id")
    .notNull()
    .references(() => polls.id, { onDelete: "cascade" }),
  pollOptionId: text("poll_option_id")
    .notNull()
    .references(() => pollOptions.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const examSubmissions = sqliteTable("exam_submissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  score: text("score").default("0").notNull(),
  totalMarks: integer("total_marks").notNull(),
  timeTakenSeconds: integer("time_taken_seconds").default(0).notNull(),
  submittedAt: text("submitted_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const examResponses = sqliteTable("exam_responses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  submissionId: text("submission_id")
    .notNull()
    .references(() => examSubmissions.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  selectedOptionId: text("selected_option_id").references(() => mcqOptions.id, {
    onDelete: "set null",
  }),
  isCorrect: integer("is_correct", { mode: "boolean" })
    .default(false)
    .notNull(),
  marksObtained: text("marks_obtained").default("0").notNull(),
});

export const containersRelations = relations(containers, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  container: one(containers, {
    fields: [items.containerId],
    references: [containers.id],
  }),
  subitems: many(subitems),
}));

export const subitemsRelations = relations(subitems, ({ one, many }) => ({
  item: one(items, {
    fields: [subitems.itemId],
    references: [items.id],
  }),
  topics: many(topics),
  questions: many(questions),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subitem: one(subitems, {
    fields: [topics.subitemId],
    references: [subitems.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  subitem: one(subitems, {
    fields: [questions.subitemId],
    references: [subitems.id],
  }),
  topic: one(topics, {
    fields: [questions.topicId],
    references: [topics.id],
  }),
  mcqOptions: many(mcqOptions),
  cqParts: many(cqParts),
}));

export const mcqOptionsRelations = relations(mcqOptions, ({ one }) => ({
  question: one(questions, {
    fields: [mcqOptions.questionId],
    references: [questions.id],
  }),
}));

export const cqPartsRelations = relations(cqParts, ({ one }) => ({
  question: one(questions, {
    fields: [cqParts.questionId],
    references: [questions.id],
  }),
}));

export const pollsRelations = relations(polls, ({ many }) => ({
  options: many(pollOptions),
  votes: many(pollVotes),
}));

export const pollOptionsRelations = relations(pollOptions, ({ one, many }) => ({
  poll: one(polls, {
    fields: [pollOptions.pollId],
    references: [polls.id],
  }),
  votes: many(pollVotes),
}));

export const batchesRelations = relations(batches, ({ many }) => ({
  routines: many(examRoutines),
  batchExams: many(batchExams),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  examQuestions: many(examQuestions),
  submissions: many(examSubmissions),
}));
