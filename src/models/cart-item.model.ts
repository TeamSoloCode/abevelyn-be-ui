import { Order } from "./order.model";
import { Product } from "./product.model";
import { User } from "./user.model";

export class CartItem {
  product?: Product;

  quantity?: number;

  order?: Order;

  owner?: User;

  isSelected?: boolean;

  price?: number;
}
