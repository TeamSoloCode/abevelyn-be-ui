import { ISignInResDto } from "../dto/signin/signin.res.dto";
import Cookie from "cookie-universal";
import { fullApiUrl, prependRootApi } from "../decorators";
import { Color } from "../models/color.model";
import { ICreateColorReqDto } from "../dto/colors/create-color.req.dto";
import { showError } from "../utils";
import { IUpdateColorReqDto } from "../dto/colors/update-color.req.dto";
import { ICreateCollectionDto } from "../dto/collections/create-collection.req.dto";
import { IUpdateCollectionDto } from "../dto/collections/update-collection.req.dto";
import { ICreateProductStatusDto } from "../dto/product-status/create-product-status.req.dto";
import { IUpdateProductStatusDto } from "../dto/product-status/update-product-status.req.dto";
import { ICreateSizeReqDto } from "../dto/size/create-size.req.dto";
import { IUpdateSizeReqDto } from "../dto/size/update-size.req.dto";
import { Option } from "../components/FieldSelect";
import { ProductStatus } from "../models/product-status.model";

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
    PRODUCT_STATUS: "/product_status",
    SIZE: "/sizes",
    PRODUCTS: "/products",
    UPLOAD_IMAGE: "/file/upload",
  };

  private _token: string;

  public get token(): string {
    return this._token;
  }

  @prependRootApi
  protected publicPost(@fullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @prependRootApi
  protected post(@fullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  @prependRootApi
  protected patch(@fullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  @prependRootApi
  protected delete(@fullApiUrl apiUri: string, params: Object = {}): Promise<Response> {
    return fetch(apiUri, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "DELETE",
    });
  }

  @prependRootApi
  get(@fullApiUrl apiUri: string, params?: Object): Promise<Response> {
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

  @prependRootApi
  protected postMultipart(@fullApiUrl apiUri: string, body: Object = {}): Promise<Response> {
    const formData = new FormData();
    const bodyEntries = Object.entries(body);

    if (bodyEntries.length == 0) {
      throw "Can send empty body";
    }

    bodyEntries.map(([key, value]) => {
      if (value instanceof FileList) {
        formData.append(key, value?.[0]);
      } else {
        formData.append(key, value);
      }
    });

    return fetch(apiUri, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
      method: "POST",
    });
  }

  @prependRootApi
  uploadImage(@fullApiUrl apiUri: string, file: File): Promise<Response> {
    const formData = new FormData();
    formData.append("image", file);

    return fetch(apiUri, {
      headers: {
        // "Content-Type": "image/jpeg",
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
      method: "POST",
    });
  }

  protected fetchAvailable(api: string): Promise<Response> {
    return this.get(api + "/fetch_available");
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

  protected async loadDataAsOption(api: string): Promise<Option[]> {
    const res = await this.fetchAvailable(api);
    if (res.status == 200) {
      const result = await res.json();
      const data: ProductStatus[] = result?.data || [];
      const options: Option[] = data.map((color) => {
        return {
          label: color.name,
          value: color.uuid,
        };
      });

      return options;
    }

    return [];
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

  async loadColorAsOption(): Promise<Option[]> {
    const res = await this.fetchAvailable(ClientApi.APIs.COLORS);
    if (res.status == 200) {
      const result = await res.json();
      const data: Color[] = result?.data || [];
      const options: Option[] = data.map((color) => {
        return {
          label: `${color.name} (${color.code})`,
          value: color.uuid,
        };
      });

      return options;
    }

    return [];
  }
}

export class CollectionApi extends ClientApi {
  constructor() {
    super();
  }

  fetch(): Promise<Response> {
    return this.get(ClientApi.APIs.COLLECTIONS);
  }

  fetchById(id: string): Promise<Response> {
    return this.get(ClientApi.APIs.COLLECTIONS + `/${id}`);
  }

  create(createColorDto: ICreateCollectionDto): Promise<Response> {
    return this.post(ClientApi.APIs.COLLECTIONS, createColorDto);
  }

  update(id: string, updateColorDto: IUpdateCollectionDto): Promise<Response> {
    return this.patch(ClientApi.APIs.COLLECTIONS + `/${id}`, updateColorDto);
  }

  delete(id: string): Promise<Response> {
    return this.delete(ClientApi.APIs.COLLECTIONS + `/${id}`);
  }
}

export class ProductStatusApi extends ClientApi {
  constructor() {
    super();
  }

  fetchProductStatus(): Promise<Response> {
    return this.get(ClientApi.APIs.PRODUCT_STATUS);
  }

  fetchProductStatusById(id: string): Promise<Response> {
    return this.get(ClientApi.APIs.PRODUCT_STATUS + `/${id}`);
  }

  createProductStatus(createColorDto: ICreateProductStatusDto): Promise<Response> {
    return this.post(ClientApi.APIs.PRODUCT_STATUS, createColorDto);
  }

  updateProductStatus(id: string, updateColorDto: IUpdateProductStatusDto): Promise<Response> {
    return this.patch(ClientApi.APIs.PRODUCT_STATUS + `/${id}`, updateColorDto);
  }

  deleteProductStatus(id: string): Promise<Response> {
    return this.delete(ClientApi.APIs.PRODUCT_STATUS + `/${id}`);
  }

  async loadProducStatusAsOption(): Promise<Option[]> {
    return await this.loadDataAsOption(ClientApi.APIs.PRODUCT_STATUS);
  }
}

export class SizeApi extends ClientApi {
  constructor() {
    super();
  }

  fetch(): Promise<Response> {
    return this.get(ClientApi.APIs.SIZE);
  }

  fetchById(id: string): Promise<Response> {
    return this.get(ClientApi.APIs.SIZE + `/${id}`);
  }

  create(createColorDto: ICreateSizeReqDto): Promise<Response> {
    return this.post(ClientApi.APIs.SIZE, createColorDto);
  }

  update(id: string, updateColorDto: IUpdateSizeReqDto): Promise<Response> {
    return this.patch(ClientApi.APIs.SIZE + `/${id}`, updateColorDto);
  }

  delete(id: string): Promise<Response> {
    return this.delete(ClientApi.APIs.SIZE + `/${id}`);
  }

  async loadSizeAsOption(): Promise<Option[]> {
    return await this.loadDataAsOption(ClientApi.APIs.SIZE);
  }
}

export class ProductApi extends ClientApi {
  constructor() {
    super();
  }

  fetch(): Promise<Response> {
    return this.get(ClientApi.APIs.PRODUCTS);
  }

  fetchAvailable(): Promise<Response> {
    return this.get(ClientApi.APIs.PRODUCTS + "/fetch_available");
  }

  fetchById(id: string): Promise<Response> {
    return this.get(ClientApi.APIs.PRODUCTS + `/${id}`);
  }

  create(createColorDto: ICreateSizeReqDto): Promise<Response> {
    return this.postMultipart(ClientApi.APIs.PRODUCTS, createColorDto);
  }

  update(id: string, updateColorDto: IUpdateSizeReqDto): Promise<Response> {
    return this.patch(ClientApi.APIs.PRODUCTS + `/${id}`, updateColorDto);
  }

  delete(id: string): Promise<Response> {
    return this.delete(ClientApi.APIs.PRODUCTS + `/${id}`);
  }
}

export const clientApi = new ClientApi();
export const colorApi = new ColorApi();
export const collectionApi = new CollectionApi();
export const productStatusApi = new ProductStatusApi();
export const sizeApi = new SizeApi();
export const productApi = new ProductApi();
