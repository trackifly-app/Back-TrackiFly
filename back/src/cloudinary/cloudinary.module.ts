import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryConfig } from '../config/cloudinary';

@Global()
@Module({
  providers: [CloudinaryService, {
    provide: 'CLOUDINARY',
    useFactory: CloudinaryConfig,
  }],
  exports: [CloudinaryService, 'CLOUDINARY'],
})
export class CloudinaryModule {}
