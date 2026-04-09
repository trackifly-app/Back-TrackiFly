import { User } from './user.entity';
import { Product } from './product.entity';
import { Address } from './address.entity';
export declare class Order {
    id_pedido: string;
    user: User;
    product: Product;
    deliveryAddress: Address;
    direccion_predeterminada: string;
    total: number;
    fecha_entrega: Date | null;
    cantidad: number;
    observaciones: string | null;
}
