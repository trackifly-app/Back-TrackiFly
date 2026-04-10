// DTO para actualizar usuarios. Permite enviar solo los campos a modificar.
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * Hereda de CreateUserDto y hace que todos los campos sean opcionales.
 * Útil para actualizaciones parciales de usuario.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
