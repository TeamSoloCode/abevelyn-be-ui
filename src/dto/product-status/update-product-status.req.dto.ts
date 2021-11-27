import { ICreateProductStatusDto } from "./create-product-status.req.dto";

export interface IUpdateProductStatusDto extends ICreateProductStatusDto {
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
