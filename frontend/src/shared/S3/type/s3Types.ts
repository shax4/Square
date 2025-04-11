export interface S3Request{
    fileName: string;
    contentType: string;
    folder: string;
}

export interface S3Response{
    presignedPutUrl: string;
    s3Key: string;
}