export class NewBeautyProduct {
  id: string;
  type: string;
  productName: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  images: File[];

  constructor(
    id: string,
    type: string,
    productName: string,
    brand: string,
    category: string,
    description: string,
    price: number,
    quantity: number,
    images: File[]
  ) {
    this.id = id;
    this.type = type;
    this.productName = productName;
    this.brand = brand;
    this.category = category;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.images = images;
  }
}

export default NewBeautyProduct;

export class BeautyProduct {
  id: string;
  type: string;
  productName: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];

  constructor(
    id: string,
    type: string,
    productName: string,
    brand: string,
    category: string,
    description: string,
    price: number,
    quantity: number,
    images: string[]
  ) {
    this.id = id;
    this.type = type;
    this.productName = productName;
    this.brand = brand;
    this.category = category;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.images = images;
  }
}






