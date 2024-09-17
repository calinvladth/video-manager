import fs from 'fs/promises';

export class FileService {
  constructor() {}

  async createFolder(paths) {
    for (const path of Object.values(paths)) {
      try {
        await fs.access(path);
      } catch {
        await fs.mkdir(path);
      }
    }
  }

  async cleanFolder(path) {
    for (const file of await fs.readdir(path)) {
      await fs.unlink(`${path}/${file}`);
    }
  }

  async getAllFromFolder(path) {
    const files = [];
    for (const file of await fs.readdir(path)) {
      console.log(file);
      files.push(file);
    }

    return files;
  }
}

const fileService = new FileService();

export { fileService };
