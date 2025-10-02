export interface Product {
  id: string;
  _id?: string;
  name: string;
  descriptions: string;
  version: string;
  features: string[];
  price: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreateRequest {
  name: string;
  descriptions: string;
  version: string;
  features: string[];
  price: number;
  image: string;
}

export interface ProductUpdateRequest {
  name?: string;
  descriptions?: string;
  version?: string;
  features?: string[];
  price?: number;
  image?: string;
}
