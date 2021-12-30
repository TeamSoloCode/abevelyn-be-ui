import { Product } from "./product.model";
import { RootModel } from "./root.model";

export class Material extends RootModel {
  name?: string;

  nameInFrench?: string;

  nameInVietnames?: string;

  description?: string;

  descriptionInFrench?: string;

  descriptionInVietnames?: string;

  products?: Product[];
}
