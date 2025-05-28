interface Product {
  id: number;
  disabled_subscribe: boolean;
  capsules: number;
  description: string;
  directions: string;
  discount: number;
  img: string;
  indications: string;
  ingradients: string;
  legal_disclaimer: string;
  name: string;
  price: string;
  satefy_information: string;
  type: string;
  weight_mg: number;
}

interface Item {
  product: Product;
  quantity: number;
  is_discount: boolean;
  total_sum: number;
}

export interface Order {
  date_created: string;
  items: Item[];
  order_number: string;
}

export interface OrdersHistoryData  {
  orders: Order[];
}

export interface CardInfo {
  card_number: string;
  card_cvv: string;
  card_date: string;
}

export interface UserInfo {
  address_one?: string;
  address_two?: string;
  city?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  postal_code?: string;
  role_type: string;
  state_province?: string;
  card_info: CardInfo
}