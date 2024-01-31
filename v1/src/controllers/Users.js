const {
  insert,
  list,
  loginUser,
  modify,
  remove,
} = require("../services/Users");
const httpStatus = require("http-status");
const projectService = require("../services/Projects");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "User is not found" });

      user = {
        ...user.toObject(),
        tokens: {
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        },
      };
      delete user.password;
      res.status(httpStatus.OK).send(user);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  list()
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  res.status(200).send("Project Index");
};

const projectList = (req, res) => {
  projectService
    .list({ user_id: req.user?._id })
    .then((projects) => {
      res.status(httpStatus.OK).send(projects);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR))
    .send({ error: "Projeleri getirirken beklenmedik bir hata oluştu" });
};

const resetPassword = (req, res) => {
  const new_password =
    uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;

  modify({ email: req.body.email }, { password: passwordToHash(new_password) })
    .then((updatedUser) => {
      if (!updatedUser)
        return res.status().send({ error: "Böyle bir kullanıcı yok" });
      eventEmitter.emit("send_email", {
        to: updatedUser.email,
        subject: "Şifre Sıfırlama ✔",
        html: `Talabeniz üzerine şifre sıfırlama işleminiz gerçekleşmiştir <b>Giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayın</b> Yeniş Şifreniz: <b>${new_password}</b>`,
      });

      res.status(httpStatus.OK).send({
        message:
          "Şifre Sıfırlama işlemi için sisteme kayıtlı e-posta adresinize gerekn bilgileri gönderdik",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Şifre resetleme sırasında problem oluştu" })
    );
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch(() =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Güncellem işlemi sırasında bir problem oluştu",
      })
    );
};

const deleteUser = (req, res) => {
  if (!req.params?.id)
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID Bilgisi Eksik" });

  remove(req.params?.id)
    .then((deleteUser) => {
      if (!deleteUser) {
        return res
          .status(httpStatus.NOT_FOUNDT)
          .send({ message: "Böyle bir kayıt bulunmamaktadır" });
      }
      res.status(httpStatus.OK).send({ message: "Proje silinmiştir" });
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const changePassword = (req, res) => {
  //!.. ui geldikten sonra şifre karşılaştırılması
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch(() =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Güncellem işlemi sırasında bir problem oluştu",
      })
    );
};

const updateProfileImage = (req, res) => {
  // 1-Resim kontrolü
  if (req?.files?.profile_image) {
    return res.status(httpStatus.BAD_REQUEST).send({
      error: "Bu işlemi yapabilmek için yeterli veriye sahip değilsiniz",
    });
  }
  path.extname(req.files.profile_image.name);
  const fileName = `${req.user._id}${extension}`;
  const folderPath = path.join(
    __dirname,
    "../",
    "uploads/users",
    req.files.profile_image.file.name
  );

  // 2- Upload işlemi

  req.files.profile_image.mv(folderPath, function (err) {
    if (err)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: err,
      });
    modify({ _id: req.user._id }, { profile_image: fileName })
      .then((updatedUser) => {
        return res.status(httpStatus.OK).send(updatedUser);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Upload Başarılı Fakata" })
      );
  });

  // 3- DB save işlmei

  // 4-
};

module.exports = {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage,
};
