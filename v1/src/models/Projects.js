const Moongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");

const ProjectSchema = new Moongoose.Schema(
  {
    name: String,
    user_id: {
      type: Moongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// model hooks
// öncesi
ProjectSchema.pre("save", (next, doc) => {
  console.log("öncesi", Object);
  next();
});
// sonrası
ProjectSchema.post("save", (doc) => {
  console.log("Sonrası", doc);
  logger.log({
    level: "info",
    message: doc,
  });
  // Loglama Kayıt edilmiştir
});

module.exports = Moongoose.model("project", ProjectSchema);
