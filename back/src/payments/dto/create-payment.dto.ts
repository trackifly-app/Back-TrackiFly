import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'El ID de la orden es requerido' })
  @IsUUID('4', { message: 'El ID de la orden debe ser un UUID válido' })
  orderId: string;
}