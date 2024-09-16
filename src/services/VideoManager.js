import fs from 'fs';

import { PATHS } from '../utils/constants.js';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegStatic);

export class VideoManager {
  constructor({ id, extension, inputFile, outputPath = PATHS.MEDIA }) {
    this.id = id;
    this.extension = extension;
    this.inputFile = inputFile;
    this.outputPath = outputPath;
    this.outputFile = '';
    this.fileName = '';
    this.fileSize = 0;
  }

  async compress() {
    this.fileName = `${this.id}.${this.extension}`;
    this.outputFile = `${this.outputPath}/${this.fileName}`;

    return await new Promise((resolve, reject) => {
      ffmpeg(this.inputFile)
        .save(this.outputFile)
        .on('end', () => {
          const stats = fs.statSync(this.outputFile);
          this.fileSize = stats.size;

          resolve(true);
        })
        .on('error', (err) => {
          reject('Error occurred: ', err.message);
        });
    });
  }

  async convert(formatType) {
    this.fileName = `${this.id}.${formatType}`;
    this.outputFile = `${this.outputPath}/${this.fileName}`;

    return await new Promise((resolve, reject) => {
      ffmpeg(this.inputFile)
        .format(formatType)
        .save(this.outputFile)
        .on('end', () => {
          const stats = fs.statSync(this.outputFile);
          this.fileSize = stats.size;

          resolve(true);
        })
        .on('error', (err) => {
          reject('Error occurred: ', err.message);
        });
    });
  }

  readFile({ filePath, fileType }) {
    return fs.createReadStream(`${filePath}/${fileType}`);
  }
}
