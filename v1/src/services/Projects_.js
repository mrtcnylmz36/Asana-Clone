const BaseService = require('./BaseService');
const BaseModel = require('../models/Projects');

class Project extends BaseService {
  constructor() {
    super(BaseModel);
  }

  // override
  list(where) {
    return BaseModel.find(where || {}).populate({
      path: 'user_id',
      select: 'full_name email profile_image',
    }); // doldurma
  }
}

module.exports = Project;
