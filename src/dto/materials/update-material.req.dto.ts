import { ICreateMaterialDto } from "./create-material.req.dto";

export interface IUpdateMaterialDto extends Partial<ICreateMaterialDto> {
  nameInFrench?: string;

  nameInVietnames?: string;

  description?: string;

  descriptionInFrench?: string;

  descriptionInVietnames?: string;
}
