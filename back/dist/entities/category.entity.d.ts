import { Product } from './product.entity';
export declare class Category {
    id_categoria: string;
    nombre: string;
    descripcion: string | null;
    products: Product[];
}
