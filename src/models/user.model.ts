import { SignInType, UserRoles } from "../constanst";
import { Profile } from "./profile.model";
import { RootModel } from "./root.model";

export class User extends RootModel {
  profile?: Profile;
  signupType?: SignInType;
  username?: string;
  role?: UserRoles;
  email?: string;
}
