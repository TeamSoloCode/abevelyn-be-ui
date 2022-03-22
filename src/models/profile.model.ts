import { RootModel } from "./root.model";

export class Profile extends RootModel {
  firstName?: string;
  lastName?: string;
  picture?: string;
  phone?: string;
}
