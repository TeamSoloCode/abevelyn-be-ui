import { SaleType, SaleUnit } from "../constanst";
import { Collection } from "./collection.model";
import { Product } from "./product.model";
import { RootModel } from "./root.model";

export class Sale extends RootModel {
  name?: string;

  nameInFrench?: string;

  nameInVietnamese?: string;

  description?: string;

  descriptionInFrench?: string;

  descriptionInVietnamese?: string;

  saleOff?: number;

  applyPrice?: number;

  maxOff?: number;

  saleType?: SaleType;

  unit?: SaleUnit;

  startedDate?: Date;

  expiredDate?: Date;

  products?: Product[];

  collections?: Collection[];
}
