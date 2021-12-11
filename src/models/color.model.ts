import { RootModel } from "./root.model";

export class Color extends RootModel {
  constructor(color: IColor) {
    super();
    const { name, code } = color;
    this.name = name;
    this.code = code;
  }

  readonly name: string;
  readonly code: string;

  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
