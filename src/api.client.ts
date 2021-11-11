import { ISignInResDto } from "./dto/signin/signin.res.dto";
import Cookie from "cookie-universal";
import { FullApiUrl, PrependRootApi } from "./decorators";
import { Color } from "./models/color.model";
import { ICreateColorReqDto } from "./dto/colors/create-color.req.dto";
import { showError } from "./utils";

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

  @PrependRootApi
  private publicPost(@FullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @PrependRootApi
  private post(@FullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @PrependRootApi
  private get(@FullApiUrl apiUri: string, params?: Object): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "GET",
    });
  }

  async signin(username: string, password: string): Promise<{ username: string } | Response> {
    const res = await this.publicPost(ClientApi.APIs.SIGNIN_URI, { username, password });

    if (res.status == 201 && res.body) {
      const data: ISignInResDto = await res.json();
      this._token = data.accessToken;
      Cookie().set(ClientApi.COOKIE_KEYS.TOKEN, this._token);
      Cookie().set(ClientApi.COOKIE_KEYS.USERNAME, data.username);
      return { username: data.username };
    }

    return res;
  }

  async verify_token(): Promise<boolean> {
    const res = await this.post(ClientApi.APIs.VERIFY_TOKEN);
    if (res?.status != 201) {
      const result = await res.json();
      showError(result?.message || "Your token is expired. Please signin !");
    }
    return res?.status == 201;
  }

  fetchColors(): Promise<Response> {
    return this.get(ClientApi.APIs.COLORS);
  }

  createColor(createColorDto: ICreateColorReqDto): Promise<Response> {
    return this.post(ClientApi.APIs.COLORS, createColorDto);
  }
}

export default new ClientApi();
