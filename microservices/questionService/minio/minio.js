const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');
const questionRepository = require('../repositories/questionRepository');
const config = require('../config/config');

const minioClient = new Minio.Client({
    endPoint: config.minioHost,
    port: 9000,
    useSSL: false,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey
});

class MinioService {

    static async uploadImageToMinio(buffer, mimetype) {
        try {
            const fileType = mimetype.split('/')[1]; // Extract file type from mimetype
            const filename = `${uuidv4()}.${fileType}`;
            const bucket = 'images-questions-bucket';

            await minioClient.putObject(bucket, filename, buffer);
            return { filename, fileType };
        } catch (error) {
            throw new Error('Error uploading to Minio');
        }
    }
}

module.exports = MinioService;
