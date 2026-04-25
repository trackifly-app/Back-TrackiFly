export interface CreatedOrderResult {
  id: string;
  tracking_code: string;
  status: string;
  pickup_direction: string;
  delivery_direction: string;
  distance: number;
  price: number;
  userId: string;
  packageDetails: {
    name: string;
    weight: number;
    dimensions: string;
    fragile: boolean;
    urgent: boolean;
    dangerous: boolean;
    cooled: boolean;
    image: string;
    category_id: string | undefined;
  };
}
