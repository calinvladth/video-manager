import { UploadService } from '../services/UploadService.js';
import { VideoManager } from '../services/VideoManager.js';
import { linkToFile } from '../utils/linkToFile.js';
import { fileService } from '../services/FileService.js';
import { formatBytes } from '../utils/formatBytes.js';

import { PATHS } from '../utils/constants.js';

async function view(req, res) {
  try {
    const { file } = req.params;
    const videoManager = new VideoManager({});

    const readStream = videoManager.readFile({
      filePath: PATHS.MEDIA,
      fileType: file,
    });

    readStream.pipe(res);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

async function viewMedia(req, res) {
  const files = await fileService.getAllFromFolder(PATHS.MEDIA);
  res.send({ files: files.map((file) => linkToFile({ req, file })) });
}

async function compress(req, res) {
  try {
    const uploadService = new UploadService({});

    req.on('data', async (chunk) => {
      await uploadService.handleChunks(chunk);
    });

    req.on('end', async () => {
      const isUpload = await uploadService.uploadFile();

      if (!isUpload) {
        throw Error('Upload failed');
      }

      const videoManager = new VideoManager({
        id: uploadService.videoId,
        extension: uploadService.videoExtension,
        inputFile: uploadService.videoFile,
      });

      const isCompressed = await videoManager.compress();
      if (!isCompressed) {
        throw Error('Compression failed');
      }

      await fileService.cleanFolder(uploadService.videoPath);

      res.send({
        initialSize: formatBytes(uploadService.bytesReceived),
        compressedSize: formatBytes(videoManager.fileSize),
        compressedVideo: linkToFile({ req, file: videoManager.fileName }),
      });
    });

    req.on('error', (err) => {
      const message = `Error during upload: ${err}`;
      throw Error(message);
    });
  } catch (err) {
    res.status(400).send(err);
  }
}

async function convert(req, res) {
  try {
    const uploadService = new UploadService({});
    const { fileType } = req.query;

    req.on('data', async (chunk) => {
      await uploadService.handleChunks(chunk);
    });

    req.on('end', async () => {
      const isUploaded = await uploadService.uploadFile();
      if (!isUploaded) {
        throw Error('Upload failed');
      }

      const videoManager = new VideoManager({
        id: uploadService.videoId,
        extension: uploadService.videoExtension,
        inputFile: uploadService.videoFile,
      });

      const isConverted = await videoManager.convert(fileType);
      if (!isConverted) {
        throw Error('Conversion failed');
      }

      await fileService.cleanFolder(uploadService.videoPath);

      res.send({
        initialSize: formatBytes(uploadService.bytesReceived),
        convertedSize: formatBytes(videoManager.fileSize),
        compressedVideo: linkToFile({ req, file: videoManager.fileName }),
      });
    });

    req.on('error', (err) => {
      throw Error({
        status: 500,
        message: ('Error during upload:', err),
      });
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

export const VideoManageController = {
  view,
  viewMedia,
  compress,
  convert,
};
