/**
 * Resultado de la creación de una orden individual en bulk
 */
export interface BulkOrderCreatedResult {
  id: string;
  tracking_code: string;
  status: string;
  pickup_direction: string;
  delivery_direction: string;
  distance: number;
  price: number;
  packageDetails: {
    name: string;
    weight: number;
    dimensions: string;
    fragile: boolean;
    urgent: boolean;
    dangerous: boolean;
    cooled: boolean;
    image: string;
    category_id: string;
  };
}

/**
 * Error en la creación de una orden individual dentro del bulk
 */
export interface BulkOrderError {
  index: number; // Índice en el array de órdenes
  orderData: Record<string, any>; // Datos que se intentaron crear
  error: string; // Mensaje de error
  code?: string; // Código de error (ej: "CATEGORY_NOT_FOUND", "VALIDATION_ERROR")
}

/**
 * Resultado completo de una operación de creación masiva
 */
export interface BulkOrdersResult {
  companyId: string;
  totalRequested: number;
  successCount: number;
  failureCount: number;
  duration: number; // milisegundos

  successful: BulkOrderCreatedResult[];
  errors: BulkOrderError[];

  // Resumen para auditoría
  summary: {
    status: 'success' | 'partial' | 'failed';
    percentage: number; // % de éxito
    message: string;
  };
}

/**
 * Interfaz para validación granular de órdenes
 */
export interface OrderValidationResult {
  isValid: boolean;
  index: number;
  errors?: string[];
  warnings?: string[];
}
