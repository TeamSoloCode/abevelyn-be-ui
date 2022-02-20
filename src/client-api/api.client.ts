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
import { IUpdateProductDto } from "../dto/product/update-product-req-dto";
import { Sale } from "../models/sale.model";
import { SaleType, UserRoles } from "../constanst";

export interface FetchQuery {
  limit?: number;
  offset?: number;
  order?: string;
  cond?: string;
}

type HttpMethod = "POST" | "GET" | "PATCH" | "DELETE";

export class ClientApi<C, U> {
  constructor(mainApi: string) {
    this._token = Cookie().get(ClientApi.COOKIE_KEYS.TOKEN);
    this.mainApi = mainApi;
  }

  static COOKIE_KEYS = {
    TOKEN: "token",
    USERNAME: "username",
  };

  static ROOT_API = "http://localhost:3000";
  static APIs = {
    SIGNIN_URI: "/auth/admin_signin",
    VERIFY_TOKEN: "/auth/admin_verify_token",
    COLORS: "/colors",
    COLLECTIONS: "/collections",
    PRODUCT_STATUS: "/product_status",
    SIZE: "/sizes",
    PRODUCTS: "/products",
    UPLOAD_IMAGE: "/file/upload",
    FETCH_IMAGE: "/file",
    MATERIAL: "/materials",
    LOGOUT: "/auth/logout",
    SALE: "/sales",
    USERS: "/users",
    LOGIN_WITH_GOOGLE: "/auth/google",
  };

  private mainApi: string;

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
  protected deleteMethod(@fullApiUrl apiUri: string, params: Object = {}): Promise<Response> {
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
  protected postMultipart(
    @fullApiUrl apiUri: string,
    body: Object = {},
    method: "POST" | "PATCH" = "POST"
  ): Promise<Response> {
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
      method,
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

  @prependRootApi
  getImageURLByName(@fullApiUrl apiUri: string, imageName: string): string {
    return apiUri + `/${imageName}`;
  }

  protected fetchAvailable(query?: FetchQuery): Promise<Response> {
    const queryString = query
      ? "?" +
        Object.keys(query)
          .map((key) => {
            return key + "=" + query[key];
          })
          .join("&")
      : "";

    return this.get(this.mainApi + "/fetch_available" + queryString);
  }

  protected async loadDataAsOption(): Promise<Option[]> {
    const res = await this.fetchAvailable();
    if (res.status == 200) {
      const result = await res.json();
      const data: any[] = result?.data || [];
      const options: Option[] = data.map((data) => {
        return {
          label: data.name || data.username,
          value: data.uuid,
        };
      });

      return options;
    }

    return [];
  }

  protected fetch(): Promise<Response> {
    return this.get(this.mainApi);
  }

  protected fetchById(id: string): Promise<Response> {
    return this.get(this.mainApi + `/${id}`);
  }

  protected create(createDto: C): Promise<Response> {
    return this.post(this.mainApi, createDto);
  }

  protected update(id: string, updateDto: U): Promise<Response> {
    return this.patch(this.mainApi + `/${id}`, updateDto);
  }

  protected delete(id: string): Promise<Response> {
    return this.deleteMethod(this.mainApi + `/${id}`);
  }

  async logout(): Promise<Response> {
    Cookie().remove(ClientApi.COOKIE_KEYS.TOKEN);
    Cookie().remove(ClientApi.COOKIE_KEYS.USERNAME);
    return this.post(ClientApi.APIs.LOGOUT);
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

class ColorApi extends ClientApi<ICreateColorReqDto, IUpdateColorReqDto> {
  constructor() {
    super(ClientApi.APIs.COLORS);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  fetchAvailable = super.fetchAvailable;
  create = super.create;
  update = super.update;
  delete = super.delete;

  async loadColorAsOption(): Promise<Option[]> {
    const res = await this.fetchAvailable();
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

export class CollectionApi extends ClientApi<ICreateCollectionDto, IUpdateCollectionDto> {
  constructor() {
    super(ClientApi.APIs.COLLECTIONS);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  fetchAvailable = super.fetchAvailable;
  createCollection = (createCollectionDto: ICreateCollectionDto): Promise<Response> => {
    return this.postMultipart(ClientApi.APIs.COLLECTIONS, {
      data: JSON.stringify(createCollectionDto),
      image: createCollectionDto.image,
    });
  };
  updateCollection = (id: string, updateCollectionDto: IUpdateCollectionDto): Promise<Response> => {
    return this.postMultipart(
      ClientApi.APIs.COLLECTIONS + `/${id}`,
      { data: JSON.stringify(updateCollectionDto), image: updateCollectionDto.image },
      "PATCH"
    );
  };
  delete = super.delete;
  loadDataAsOption = super.loadDataAsOption;
}

export class ProductStatusApi extends ClientApi<ICreateProductStatusDto, IUpdateProductStatusDto> {
  constructor() {
    super(ClientApi.APIs.PRODUCT_STATUS);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  fetchAvailable = super.fetchAvailable;
  create = super.create;
  update = super.update;
  delete = super.delete;
  loadDataAsOption = super.loadDataAsOption;
}

export class SizeApi extends ClientApi<ICreateSizeReqDto, IUpdateSizeReqDto> {
  constructor() {
    super(ClientApi.APIs.SIZE);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  fetchAvailable = super.fetchAvailable;
  create = super.create;
  update = super.update;
  delete = super.delete;
  loadDataAsOption = super.loadDataAsOption;
}

export class ProductApi extends ClientApi<ICreateSizeReqDto, IUpdateProductDto> {
  constructor() {
    super(ClientApi.APIs.PRODUCTS);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  fetchAvailable = super.fetchAvailable;
  delete = super.delete;
  loadDataAsOption = super.loadDataAsOption;

  create(createColorDto: ICreateSizeReqDto): Promise<Response> {
    return this.postMultipart(ClientApi.APIs.PRODUCTS, createColorDto);
  }

  update(id: string, updateProduct: IUpdateProductDto): Promise<Response> {
    return this.postMultipart(ClientApi.APIs.PRODUCTS + `/${id}`, updateProduct, "PATCH");
  }
}

export class MaterialApi extends ClientApi<any, any> {
  constructor() {
    super(ClientApi.APIs.MATERIAL);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  fetchAvailable = super.fetchAvailable;
  create = super.create;
  update = super.update;
  delete = super.delete;
  loadDataAsOption = super.loadDataAsOption;
}

export class SaleApi extends ClientApi<any, any> {
  constructor() {
    super(ClientApi.APIs.SALE);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  fetchAvailable = super.fetchAvailable;
  create = super.create;
  update = super.update;
  delete = super.delete;

  async loadOptionByType(saleType: SaleType): Promise<Option[]> {
    const res = await this.fetchAvailable({ cond: `[["saleType", "=", "${saleType}"]]` });
    if (res.status == 200) {
      const result = await res.json();
      const data: Sale[] = result?.data || [];
      const options: Option[] = data.map((sale) => {
        return {
          label: `${sale.name || "-"} (${sale.saleOff} ${sale.unit})`,
          value: sale.uuid,
        };
      });

      return options;
    }

    return [];
  }
}

export class UserApi extends ClientApi<any, any> {
  constructor() {
    super(ClientApi.APIs.USERS);
  }

  fetch = super.fetch;
  fetchById = super.fetchById;
  loadDataAsOption = super.loadDataAsOption;

  updateUserRole = (userId: string, role: UserRoles) => {
    return this.patch(ClientApi.APIs.USERS + `/${userId}`, { role });
  };
}

export const clientApi = new ClientApi("");
export const colorApi = new ColorApi();
export const collectionApi = new CollectionApi();
export const productStatusApi = new ProductStatusApi();
export const sizeApi = new SizeApi();
export const productApi = new ProductApi();
export const materialApi = new MaterialApi();
export const saleApi = new SaleApi();
export const userApi = new UserApi();
