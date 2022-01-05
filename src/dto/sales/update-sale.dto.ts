import { ICreateSaleDto } from "./create-sale.dto";

export interface IUpdateSaleDto extends Partial<ICreateSaleDto> {
  name: string;
  nameInFrench?: string;
  nameInVietnamese?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnamese?: string;
  productIds?: string[];
  collectionIds?: string[];
}
