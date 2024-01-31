const Moongoose = require("mongoose");
const sectionLogger = require("../scripts/logger/sectionLoggerLogger"); // Use the new logger

const SectionSchema = new Moongoose.Schema(
  {
    name: String,
    user_id: {
      type: Moongoose.Types.ObjectId,
      ref: "user",
    },
    project_id: {
      type: Moongoose.Types.ObjectId,
      ref: "project",
    },
    order: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

SectionSchema.pre("save", function (next) {
  console.log("Before saving user:", this);
  next();
});

SectionSchema.post("save", function (doc) {
  console.log("After saving user:", doc);
  sectionLogger.log({
    level: "info",
    message: doc,
  });
});

module.exports = Moongoose.model("section", SectionSchema);
