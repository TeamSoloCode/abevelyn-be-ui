export class ProductStatus {
  constructor(color: IColor) {
    const { uuid, name, code } = color;
    this.uuid = uuid;
    this.name = name;
    this.code = code;
  }

  readonly uuid: string;
  readonly name: string;
  readonly code: string;

  createAt?: Date;
  updateAt?: Date;
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
