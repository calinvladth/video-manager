import express from 'express'
 
const app = express()
const PORT = 3000

import { UploadService } from './services/UploadService.js' 
import { VideoCompressor } from './services/VideoCompressor.js'
import { PATHS } from './utils/constants.js'; 
import { linkToFile } from './utils/linkToFile.js'
import { fileService } from './services/FileService.js'
import { formatBytes } from './utils/formatBytes.js'
 
app.use(express.static('./media'));
 /**
  * Upload file to temporary folder
  * Use case 1
  * After upload is done, begin conversion based on data
  * The converted file fill be saved to the media folder
  * Use case 2
  * After upload, begin compressing the file based on data
  * The compressed file will be saved to media
  * 
  * The path to the new file will be provided as a response
  */

app.post('/compress', async (req, res) => {
    try {
        const uploadService = new UploadService({})

        req.on('data', async (chunk) => {
            await uploadService.handleChunks(chunk)
        });
    
        req.on('end', async () => {
            console.log('Upload complete, total size:', uploadService.bytesReceived);

            await uploadService.uploadFile()

            console.log('File compression started')

            const videoCompressor = new VideoCompressor({ id: uploadService.videoId, extension: uploadService.videoExtension, inputFile: uploadService.videoFile })
            
            await videoCompressor.compress()

            await fileService.cleanFolder(uploadService.videoPath)
            res.send({initialSize: formatBytes(uploadService.bytesReceived), compressedSize: formatBytes(videoCompressor.fileSize), compressedVideo: linkToFile({req, file: videoCompressor.fileName,})})
        });
        
        req.on('error', (err) => { 
            throw Error({ 
                status: 500,
                message: ('Error during upload:', err)
            })
        });
    } catch (err) {
        res.status(500).send(err)
    }
})

app.get('/download/:file', (req, res) => {
    const readStream = fs.createReadStream(`${PATHS.TMP}/sr1.mov`)
    readStream.pipe(res)
})

app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`)
})