import { RootModel } from "./root.model";

export class ProductStatus extends RootModel {
  constructor(name: string) {
    super();
    this.name = name;
  }

  readonly name: string;
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
