import { ICreateProductDto } from "./create-product-req.dto";

export interface IUpdateProductDto extends Partial<ICreateProductDto> {
  materialIds?: string[];
  collectionIds?: string[];
  saleIds?: string[];
  quantity?: number;
  couponId?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  nameInFrench?: string;
  nameInVietnames?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
