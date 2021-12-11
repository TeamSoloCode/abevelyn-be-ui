import { RootModel } from "./root.model";

export class Size extends RootModel {
  constructor(size: ISize) {
    super();
    const { name } = size;
    this.name = name;
  }

  readonly name: string;

  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
