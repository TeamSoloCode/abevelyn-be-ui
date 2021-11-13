import { ICreateCollectionDto } from "./create-collection.req.dto";

export interface IUpdateCollectionDto extends ICreateCollectionDto {
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
