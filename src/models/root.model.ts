import { Color } from "react-bootstrap/esm/types";
import { ProductStatus } from "./product-status.model";
import { Size } from "./size.model";

export class RootModel {
  constructor() {}

  readonly uuid?: string;
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
