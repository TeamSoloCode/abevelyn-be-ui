import { ICreateSizeReqDto } from "./create-size.req.dto";

export interface IUpdateSizeReqDto extends Partial<ICreateSizeReqDto> {
  available?: boolean;
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
