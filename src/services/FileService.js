import fs from 'fs';

export class FileService {
  constructor() {}

  async createFolder(paths) {
    for (const path of Object.values(paths)) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    }
  }

  async cleanFolder(path) {
    for (const file of await fs.readdir(path)) {
      await fs.unlink(`${path}/${file}`);
    }
  }
}

const fileService = new FileService();

export { fileService };
