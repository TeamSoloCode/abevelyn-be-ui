import { SaleUnit } from "../../constanst";

export interface ICreateSaleDto {
  saleOff: number;

  startedDate: string;

  expiredDate: string;

  maxOff: number;

  unit: SaleUnit;
}
