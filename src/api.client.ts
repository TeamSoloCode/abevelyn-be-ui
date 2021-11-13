import { ISignInResDto } from "./dto/signin/signin.res.dto";
import Cookie from "cookie-universal";
import { FullApiUrl, PrependRootApi } from "./decorators";
import { Color } from "./models/color.model";
import { ICreateColorReqDto } from "./dto/colors/create-color.req.dto";
import { showError } from "./utils";
import { IUpdateColorReqDto } from "./dto/colors/update-color.req.dto";
import { ICreateCollectionDto } from "./dto/collections/create-collection.req.dto";
import { IUpdateCollectionDto } from "./dto/collections/update-collection.req.dto";

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
    COLLECTIONS: "/collections",
  };

  private _token: string;

  public get token(): string {
    return this._token;
  }

  @PrependRootApi
  protected publicPost(@FullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @PrependRootApi
  protected post(@FullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @PrependRootApi
  protected patch(@FullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  @PrependRootApi
  protected delete(@FullApiUrl apiUri: string, params: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "DELETE",
    });
  }

  @PrependRootApi
  get(@FullApiUrl apiUri: string, params?: Object): Promise<Response> {
    return fetch(apiUri, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        // pragma: "no-cache",
        // "Cache-Control": "no-cache",
      },
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
}

class ColorApi extends ClientApi {
  constructor() {
    super();
  }

  fetchColors(): Promise<Response> {
    return this.get(ClientApi.APIs.COLORS);
  }

  fetchColorById(id: string): Promise<Response> {
    return this.get(ClientApi.APIs.COLORS + `/${id}`);
  }

  createColor(createColorDto: ICreateColorReqDto): Promise<Response> {
    return this.post(ClientApi.APIs.COLORS, createColorDto);
  }

  updateColor(id: string, updateColorDto: IUpdateColorReqDto): Promise<Response> {
    return this.patch(ClientApi.APIs.COLORS + `/${id}`, updateColorDto);
  }

  deleteColor(id: string): Promise<Response> {
    return this.delete(ClientApi.APIs.COLORS + `/${id}`);
  }
}

export class CollectionApi extends ClientApi {
  constructor() {
    super();
  }

  fetchCollections(): Promise<Response> {
    return this.get(ClientApi.APIs.COLLECTIONS);
  }

  fetchCollectionById(id: string): Promise<Response> {
    return this.get(ClientApi.APIs.COLLECTIONS + `/${id}`);
  }

  createCollection(createColorDto: ICreateCollectionDto): Promise<Response> {
    return this.post(ClientApi.APIs.COLLECTIONS, createColorDto);
  }

  updateCollection(id: string, updateColorDto: IUpdateCollectionDto): Promise<Response> {
    return this.patch(ClientApi.APIs.COLLECTIONS + `/${id}`, updateColorDto);
  }

  deleteCollection(id: string): Promise<Response> {
    return this.delete(ClientApi.APIs.COLLECTIONS + `/${id}`);
  }
}

export const clientApi = new ClientApi();
export const colorApi = new ColorApi();
export const collectionApi = new CollectionApi();
