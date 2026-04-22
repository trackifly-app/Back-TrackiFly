# Cloudinary Module

Este módulo provee integración con Cloudinary para subir imágenes en tu aplicación NestJS.

## Uso básico

1. Inyecta `CloudinaryService` en tu controlador o servicio:

```typescript
import { CloudinaryService } from '../cloudinary/cloudinary.service';

constructor(private readonly cloudinaryService: CloudinaryService) {}
```

2. Sube una imagen desde un buffer:

```typescript
await this.cloudinaryService.uploadImage(buffer);
```

## Notas
- El módulo es global, no necesitas importarlo en cada módulo.
- Las credenciales se leen de variables de entorno.
- Puedes pasar opciones adicionales de Cloudinary si lo requieres.
