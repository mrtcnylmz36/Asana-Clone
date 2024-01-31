const { insert, list, modify, remove } = require("../services/Projects");
const httpStatus = require("http-status");

const index = (req, res) => {
  list()
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  res.status(200).send("Project Index");
};

const create = (req, res) => {
  req.body.user_id = req.user; // ref
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  if (!req.params?.id)
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID Bilgisi Eksik" });
  modify(req.body, req.params?.id)
    .then((updatedDocs) => {
      res.status(httpStatus.OK).send(updatedDocs);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const deleteSection = (req, res) => {
  if (!req.params?.id)
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID Bilgisi Eksik" });

  remove(req.params?.id)
    .then((deletedDoc) => {
      if (!deletedDoc) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "Böyle bir kayıt bulunmamaktadır" });
      }
      res.status(httpStatus.OK).send({ message: "Proje silinmiştir" });
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

module.exports = { create, index, update, deleteSection };
