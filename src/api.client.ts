import { ISignInResDto } from "./dto/signin/signin.res.dto";
import Cookie from "cookie-universal";
import { getFullApiUrl, prependRootApi } from "./decorators";
import { Color } from "./models/color.model";

type HttpMethod = "POST" | "GET" | "PATCH" | "DELETE";

export class ClientApi {
  constructor() {
    this._token = Cookie().get(ClientApi.COOKIE_KEYS.TOKEN);
  }

  static COOKIE_KEYS = {
    TOKEN: "token",
    USERNAME: "username",
  };
  static ROOT_API = "http://localhost:3000";
  static APIs = {
    SIGNIN_URI: "/auth/signin",
    VERIFY_TOKEN: "/auth/verify_token",
    COLORS: "/colors",
  };

  private _token: string;

  public get token(): string {
    return this._token;
  }
  @prependRootApi
  private publicPost(@getFullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @prependRootApi
  private post(@getFullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @prependRootApi
  private get(@getFullApiUrl apiUri: string, params?: Object): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "GET",
    });
  }

  async signin(username: string, password: string): Promise<{ username: string } | null> {
    const res = await this.publicPost(ClientApi.APIs.SIGNIN_URI, { username, password });

    if (res.status == 201 && res.body) {
      const data: ISignInResDto = await res.json();
      this._token = data.accessToken;
      Cookie().set(ClientApi.COOKIE_KEYS.TOKEN, this._token);
      Cookie().set(ClientApi.COOKIE_KEYS.USERNAME, data.username);
      return { username: data.username };
    }

    return null;
  }

  async verify_token(): Promise<boolean> {
    const res = await this.post(ClientApi.APIs.VERIFY_TOKEN);
    return res?.status == 201;
  }

  async fetchColors(): Promise<Response> {
    return this.get(ClientApi.APIs.SIGNIN_URI);
  }
}

export default new ClientApi();
