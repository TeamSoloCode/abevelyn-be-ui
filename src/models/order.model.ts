import { OrderStatus } from "../constanst";
import { CalculatePriceInfo } from "../utils";
import { CartItem } from "./cart-item.model";
import { RootModel } from "./root.model";
import { Sale } from "./sale.model";
import { User } from "./user.model";

export class Order extends RootModel {
  cancelReason?: string;

  rejectReason?: string;

  status?: OrderStatus;

  cartItems?: CartItem[];

  owner?: User;

  sale?: Sale;

  priceInfo?: CalculatePriceInfo;

  orderHist?: Order;
}
