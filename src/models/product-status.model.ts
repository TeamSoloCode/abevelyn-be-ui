export class ProductStatus {
  constructor(name: string) {
    this.name = name;
  }

  readonly name: string;

  uuid: string = "";
  createAt?: Date;
  updateAt?: Date;
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
