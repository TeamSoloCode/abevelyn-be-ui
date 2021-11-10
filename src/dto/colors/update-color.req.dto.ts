import { ICreateColorReqDto } from "./create-color.req.dto";

export interface IUpdateColorReqDto extends Partial<ICreateColorReqDto> {
  nameInFrench?: string;
  nameInVietnames?: string;
}
