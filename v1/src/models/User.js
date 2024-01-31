const Moongoose = require('mongoose');
const userLogger = require('../scripts/logger/Users'); // Use the new logger

const UserSchema = new Moongoose.Schema(
  {
    full_name: String,
    password: String,
    email: String,
    profile_image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Model hooks
// Before saving
UserSchema.pre('save', function (next) {
  console.log('Before saving user:', this);
  next();
});

// After saving
UserSchema.post('save', function (doc) {
  console.log('After saving user:', doc);
  userLogger.log({
    level: 'info',
    message: doc,
  });
  // Log the information
});

module.exports = Moongoose.model('user', UserSchema);
