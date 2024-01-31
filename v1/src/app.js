const express = require('express');
const fileupload = require('express-fileupload');
const helmet = require('helmet');
const config = require('./config');
const loaders = require('./loaders');
const events = require('./scripts/events');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const { ProjectRoutes, UserRoutes, SectionRoutes, TaskRoutes } = require('./routes');

config();
loaders();
events();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, './', 'uploads')));
app.use(express.json());
app.use(helmet());
app.use(fileupload());

app.listen(process.env.PORT, () => {
  console.log('Sunucu çalışıyor...');
  app.use('/projects', ProjectRoutes);
  app.use('/users', UserRoutes);
  app.use('/sections', SectionRoutes);
  app.use('/sections', TaskRoutes);

  // tanımlı olmayan route
  app.use((req, res, next) => {
    const error = new Error('Aradığınız Sayfa Bulunmamaktadır...');
    error.status = 404;
    next(error);
  });

  // Error Handler
  app.use(errorHandler);
});
