const Mongoose = require('mongoose');
const { insert, list, modify, remove, findOne } = require('../services/Tasks');
const httpStatus = require('http-status');

const index = (req, res) => {
  list()
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  res.status(200).send('Project Index');
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
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'ID Bilgisi Eksik' });
  modify(req.body, req.params?.id)
    .then((updatedDocs) => {
      res.status(httpStatus.OK).send(updatedDocs);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const deleteTask = (req, res) => {
  if (!req.params?.id)
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'ID Bilgisi Eksik' });

  remove(req.params?.id)
    .then((deletedDoc) => {
      if (!deletedDoc) {
        return res.status(httpStatus.NOT_FOUND).send({
          message: 'Böyle bir kayıt bulunmamaktadır',
        });
      }
      res.status(httpStatus.OK).send({ message: 'Proje silinmiştir' });
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const makeComment = (req, res) => {
  findOne({ _id: req.params.id })
    .then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          message: 'Böyle Bir Kayıt Bulunamadı',
        });
      const commet = {
        ...req.body,
        commented_at: new Date(),
        user_id: req.user,
      };

      mainTask.comments.push(commet);
      mainTask
        .save()
        .then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const deleteComment = (req, res) => {
  findOne({ _id: req.params.id })
    .then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          message: 'Böyle Bir Kayıt Bulunamadı',
        });

      mainTask.comments = mainTask.comments.filter(
        (c) => c._id?.toString() !== Mongoose.Types.ObjectId(req.params.commentId),
      );

      mainTask
        .save()
        .then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const addSubTask = (req, res) => {
  // main task çekilir
  if (!req.params.id)
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'ID bilgisi gerekli' });
  findOne({ _id: req.params.id })
    .then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          message: 'Böyle Bir Kayıt Bulunamadı',
        });
      // subtask oluşturulur

      // req.body.user_id = req.user; // ref
      insert({ ...req.body, user_id: req.user })
        .then((subTask) => {
          // subtask referansı maintask üzerinde gösterilir ve update edilir.
          mainTask.sub_tasks.push(subTask);
          mainTask
            .save()
            .then((updatedDoc) => {
              return res.status(httpStatus.OK).send(updatedDoc);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
          res.status(httpStatus.CREATED).send(subTask);
        })
        .catch((e) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
        });

      mainTask.comments = mainTask.comments.filter(
        (c) => c._id?.toString() !== Mongoose.Types.ObjectId(req.params.commentId),
      );

      mainTask
        .save()
        .then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));

  // kullanıcıya yeni döküman gönderilir
};

const fetchTask = (req, res) => {
  if (!req.params.id)
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'ID bilgisi gerekli' });
  findOne({ _id: req.params.id }, true)
    .then((task) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          message: 'Böyle Bir Kayıt Bulunamadı',
        });
      return res.status(httpStatus.OK).send(task);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

module.exports = {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  fetchTask,
};
