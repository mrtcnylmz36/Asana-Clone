const User = require("../models/User");

const insert = (data) => {
  const user = new User(data);
  return user.save();
};

const loginUser = (data) => {
  return User.findOne(data);
};

const list = () => {
  return User.find({});
};

const modify = (where, updateData) => {
  return User.findByIdAndUpdate(where, updateData, { new: true }); //
};

// const modify = (data, updateData) => {
//   // gelen datalar üzerinden bilgileri filtrelemek: Aslında bu filterlemiyi joi yapıyor fakat öğrenmek amaçlı bunu yaptık
//   // console.log(data);
//   // const updateData = Object.keys(data).reduce((obj, key) => {
//   //   if (key !== "password") obj[key] = data[key];
//   //   return obj;
//   // }, {});
//   // if (data?.password) delete data.password;
//   return User.findByIdAndUpdate(id, updateData, { new: true }); // new true update edilmiş veriyi gönderir
//   // return Project.findById(id).then((project) => {
//   //   project.name = data?.name;
//   //   return project.save();
//   // });
// };

const remove = (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  loginUser,
  modify,
  remove,
};
