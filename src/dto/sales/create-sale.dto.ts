import { SaleType, SaleUnit } from "../../constanst";

export interface ICreateSaleDto {
  name: string;

  saleOff: number;

  startedDate: string;

  expiredDate: string;

  applyPrice: number;

  maxOff: number;

  unit: SaleUnit;

  saleType: SaleType;
}
