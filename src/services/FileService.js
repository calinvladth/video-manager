import fs from 'fs/promises'

export class FileService {
    constructor() {}
    
    async cleanFolder(path) {
        for (const file of await fs.readdir(path)) {
            await fs.unlink(`${path}/${file}`);
        }
    }
}

const fileService = new FileService()

export {fileService}