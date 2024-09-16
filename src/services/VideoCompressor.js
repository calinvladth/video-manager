import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { PATHS } from '../utils/constants.js';

ffmpeg.setFfmpegPath(ffmpegStatic);

export class VideoCompressor { 
    constructor({ id, extension, inputFile, outputPath = PATHS.MEDIA }) {
        this.id = id
        this.extension = extension
        this.inputFile = inputFile
        this.outputPath = outputPath
        this.fileName = ''
        this.fileSize = 0
        // this.videoCodec = 'libx264'
        // this.videoBitrate = '1000k'
        // this.audioCodec = 'aac'
        // this.audioBitrate = '128k'
        // this.fps = 30
        // this.size = '1920x1080'

    }

    async compress() {
        // TODO: This can be extended with input from user's request
        this.fileName = `${this.id}.${this.extension}`
        await new Promise((resolve, reject) => {
            console.log(this.inputFile ,`${this.outputPath}/${this.fileName}`)
            ffmpeg(this.inputFile)
            // .videoCodec(this.videoCodec)
            // .videoBitrate(this.videoBitrate)
            // .size(this.size)
            // .audioCodec(this.audioCodec)
            // .audioBitrate(this.audioBitrate)
            // .fps(this.fps)
            // .outputOptions('-preset', 'slow')
            .save(`${this.outputPath}/${this.id}.${this.extension}`)
                .on('end', () => {
                    const stats = fs.statSync(`${this.outputPath}/${this.id}.${this.extension}`)
                    this.fileSize = stats.size

                    resolve('Video compressed successfully')
                })
                .on('error', (err) => {
                    reject('Error occurred: ', err.message)
                });
        })
        
    }
}
