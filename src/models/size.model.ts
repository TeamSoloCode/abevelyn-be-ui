export class Size {
  constructor(size: ISize) {
    const { uuid, name } = size;
    this.uuid = uuid;
    this.name = name;
  }

  readonly uuid: string;
  readonly name: string;

  createAt?: Date;
  updateAt?: Date;
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
