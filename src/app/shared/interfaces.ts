export type TRegionalType =
  'regional.address'
  | 'regional.street'
  | 'regional.municipality_part'
  | 'regional.municipality'
  | 'regional.region'
  | 'regional.country';

export interface IRegionalStructure {
  name: string;
  type: TRegionalType;
}

export interface CartItem {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onSetQuantity?: (quantity: number) => void;
}

export interface IResponseItem {
  label: string;
  location: string;
  name: string;
  position: {
    lon: number;
    lat: number;
  };
  regionalStructure: Array<IRegionalStructure>;
  type: TRegionalType;
  zip: string;
}

export interface IFormData {
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  country: string;
}

export interface RegistrationDTO {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}


export interface Address {
  id: number;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface Product {
  id: number;
  name: string;
  imageUrl?: string;
  price: number;
  brandName: string;
  quantityInStock: number;
}

export interface ProductDetailedInfo extends Product {
  description: string;
}

export interface OrderInformation {
  id: number;
  status: string;
  deliveryDate: string;
  totalPrice: number;
  address: string;
  items: OrderItem[];
}

export interface OrderItem {
  productName: string;
  quantity: number;
  priceAtTime: number;
}

export interface Category {
  id: number;
  name: string;
}


export interface CartItem {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface StockCheckResponse {
  productId: number;
  productName: string;
  available: number;
  requested: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}
