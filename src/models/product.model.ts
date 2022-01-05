import { Collection } from "./collection.model";
import { Color } from "./color.model";
import { Material } from "./material.models";
import { ProductStatus } from "./product-status.model";
import { RootModel } from "./root.model";
import { Sale } from "./sale.model";
import { Size } from "./size.model";

export class Product extends RootModel {
  constructor(
    name: string,
    image: string,
    description: string,
    price: number,
    color: Color,
    status: ProductStatus,
    size: Size
  ) {
    super();
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
    this.color = color;
    this.productStatus = status;
    this.size = size;
  }

  name: string;

  quantity: number = 1;

  nameInFrench?: string;

  nameInVietnamese?: string;

  description?: string;

  descriptionInFrench?: string;

  descriptionInVietnamese?: string;

  price: number;

  image: string;

  image1?: string;

  image2?: string;

  image3?: string;

  image4?: string;

  image5?: string;

  productStatus: ProductStatus;

  size: Size;

  color: Color;

  collections?: Collection[];

  materials?: Material[];

  sales?: Sale[];

  //   coupon?: Coupon;

  //   reviews: Review[];

  //   cartItems: CartItem[];
}
