import express from 'express';

import { PORT, PATHS } from './utils/constants.js';
import { fileService } from './services/FileService.js';
import { VideoManageController } from './controllers/VideoManager.js';

const app = express();

// Routes
app.get('/view/media', VideoManageController.viewMedia);
app.get('/view/:file', VideoManageController.view);
app.post('/compress', VideoManageController.compress);
app.post('/convert', VideoManageController.convert);

// Server
app.listen(PORT, () => {
  fileService.createFolder(PATHS);
  console.log(`App started on port ${PORT}`);
});
