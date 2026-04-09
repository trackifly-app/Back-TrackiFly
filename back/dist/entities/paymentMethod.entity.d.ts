import { User } from "./user.entity";
export declare class PaymentMethod {
    id_forma_de_pago: string;
    nombre: string;
    descripcion: string | null;
    imagen_referencia: string | null;
    users: User[];
}
