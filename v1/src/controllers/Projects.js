const httpStatus = require('http-status');
const Service = require('../services/Projects_');
const ProjectService = new Service();
const ApiError = require('../errors/ApiError');

class Project {
  index(req, res) {
    if (!req.params?.projectId)
      return res.status(httpStatus.BAD_REQUEST).send({ error: 'Proje Bilgisi Eksik' });
    ProjectService.list({ project_id: req.params.projectId })
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    res.status(200).send('Project Index');
  }

  create(req, res) {
    req.body.user_id = req.user; // ref
    ProjectService.insert(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  update(req, res, next) {
    if (!req.params?.id)
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'ID Bilgisi Eksik' });
    ProjectService.modify(req.body, req.params?.id)
      .then((updatedProject) => {
        if (!updatedProject) return next(new ApiError('Böyle Bir Kayıt Bulunmamaktadır', 404));

        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((e) => next(new ApiError(e?.message)));
  }

  deleteProject(req, res) {
    if (!req.params?.id)
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'ID Bilgisi Eksik' });

    ProjectService.remove(req.params?.id)
      .then((deletedProject) => {
        if (!deletedProject) {
          return res
            .status(httpStatus.NOT_FOUNDT)
            .send({ message: 'Böyle bir kayıt bulunmamaktadır' });
        }
        res.status(httpStatus.OK).send({ message: 'Proje silinmiştir' });
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }
}

module.exports = new Project();
