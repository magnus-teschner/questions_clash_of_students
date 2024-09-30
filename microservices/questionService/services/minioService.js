const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');

const endPoint = process.env.MINIO;
const port = 9000;
const bucket = "questions";

const minioClient = new Minio.Client({
    endPoint: endPoint,
    port: port,
    useSSL: false,
    accessKey: "IQ8WmkoR6EoyZtWIH4Pc",
    secretKey: 'c7SiP3sIexrTxQH8yTak5zSxBYdIpLTCuxA1qsSk'
});

class MinioService {

    static async uploadImageToMinio(buffer, mimetype) {
        try {
            const fileType = mimetype.split('/')[1];
            const filename = `${uuidv4()}.${fileType}`;

            await minioClient.putObject(bucket, filename, buffer);
            return `http://${endPoint}:${port}/${bucket}/${filename}`;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = MinioService;
