export class Collection {
  constructor(uuid: string, name: string) {
    this.uuid = uuid;
    this.name = name;
  }

  uuid: string;
  name: string;
  available: boolean = true;
  deleted: boolean = false;
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
}
