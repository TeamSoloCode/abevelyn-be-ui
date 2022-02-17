import { RootModel } from "./root.model";
import { Sale } from "./sale.model";

export class Collection extends RootModel {
  constructor(name: string) {
    super();
    this.name = name;
  }

  name: string;
  available: boolean = true;
  deleted: boolean = false;
  nameInFrench?: string;
  nameInVietnames?: string;
  description?: string;
  descriptionInFrench?: string;
  descriptionInVietnames?: string;
  sales?: Sale[];
  image?: string;
}
