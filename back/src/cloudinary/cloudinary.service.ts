import { Inject, Injectable } from "@nestjs/common";
import {
  v2 as Cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject("CLOUDINARY") private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadImage(
    buffer: Buffer,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        options || {},
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  async uploadImageFromUrl(
    imageUrl: string,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return this.cloudinary.uploader.upload(imageUrl, options || {});
  }
}
