import { OrderStatus } from "../../constanst";

export interface IUpdateOrderDto {
  cancelReason?: string;

  rejectReason?: string;

  orderStatus: OrderStatus;
}
