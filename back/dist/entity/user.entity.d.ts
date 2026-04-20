import { Role } from "./roles.entity";
import { PaymentMethod } from "./paymentMethod.entity";
import { Order } from "./order.entity";
export declare class User {
    id_usuario: string;
    nombre: string;
    role: Role;
    paymentMethod: PaymentMethod;
    correo: string;
    password: string;
    telefono: string | null;
    imagen: string | null;
    fecha_de_nacimiento: string | null;
    estado: string;
    notificaciones: boolean;
    activo: boolean;
    ultima_sesion: Date | null;
    ultimo_login: Date | null;
    ultimo_login_fecha: Date | null;
    estado_de_la_cuenta: string;
    verificacion_email: boolean;
    orders: Order[];
}
