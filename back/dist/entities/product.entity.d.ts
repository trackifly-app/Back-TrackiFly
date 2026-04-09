import { Category } from "./category.entity";
export declare class Product {
    id_producto: string;
    nombre: string;
    descripcion: string | null;
    stock: number;
    imagen_url: string | null;
    category: Category;
    volumen: number | null;
    forma_de_empaque: string | null;
    cantidad_productos: number | null;
}
