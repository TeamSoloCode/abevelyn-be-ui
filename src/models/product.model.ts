import { Color } from "react-bootstrap/esm/types";
import { ProductStatus } from "./product-status.model";
import { Size } from "./size.model";

export class Product {
  constructor(
    name: string,
    image: string,
    description: string,
    price: number,
    color: Color,
    status: ProductStatus,
    size: Size
  ) {
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
    this.color = color;
    this.productStatus = status;
    this.size = size;
  }

  readonly uuid?: string;

  name: string;

  quantity: number = 1;

  nameInFrench?: string;

  nameInVietnamese?: string;

  description?: string;

  descriptionInFrench?: string;

  descriptionInVietnamese?: string;

  price: number;

  saleOf: number = 0;

  image: string;

  image1?: string;

  image2?: string;

  image3?: string;

  image4?: string;

  image5?: string;

  productStatus: ProductStatus;

  size: Size;

  color: Color;

  //   coupon?: Coupon;

  //   reviews: Review[];

  //   cartItems: CartItem[];
}
