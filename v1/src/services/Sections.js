const Sections = require("../models/Sections");

const insert = (data) => {
  return new Sections(data).save();
};

const list = (where) => {
  return Sections.find(where || {})
    .populate({
      path: "user_id",
      select: "full_name email profile_image",
    })
    .populate({
      path: "project_id",
      select: "name",
    }); // doldurma
};

const modify = (where, data) => {
  return Sections.findByIdAndUpdate(where, data, { new: true });
};

const remove = (id) => {
  return Sections.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
};
