const Tasks = require('../models/Tasks');

const findOne = (where, expand) => {
  if (!expand) {
    return Tasks.findOne(where);
  }

  return Tasks.FindOne(where)
    .populate({
      path: 'user_id',
      select: 'full_name email profile_image',
    })
    .populate({
      path: 'comment',
      select: 'full_name email profile_image',
      populate: {
        path: 'user_id',
      },
    })
    .populate({
      path: 'sub_tasks',
      select: 'title description isCompleted assigned_to due_date order sub_tasks',
    });
};

const insert = (data) => {
  return new Tasks(data).save();
};

const list = (where) => {
  return Tasks.find(where || {}).populate({
    path: 'user_id',
    select: 'full_name email profile_image',
  });
};

const modify = (where, data) => {
  return Tasks.findByIdAndUpdate(where, data, { new: true });
};

const remove = (id) => {
  return Tasks.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
  findOne,
};
