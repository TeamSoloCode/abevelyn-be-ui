import { SignInResDto } from "./dto/signin-res.dto";

type HttpMethod = "POST" | "GET" | "PATCH" | "DELETE";

class ClientApi {
  constructor() {
    this._token = "";
  }

  static ROOT_API = "http://localhost:3000";
  static APIs = {
    SIGNIN_URI: "/auth/signin",
  };

  private _token: string;

  public get token(): string {
    return this._token;
  }

  private publicPost(apiUri: string, body?: Object): Promise<Response> {
    const fullApiURL = ClientApi.ROOT_API + apiUri;
    return fetch(fullApiURL, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body || {}),
    });
  }

  private post(apiUri: string, body?: Object): Promise<Response> {
    const fullApiURL = ClientApi.ROOT_API + apiUri;
    return fetch(fullApiURL, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      method: "POST",
      body: JSON.stringify(body || {}),
    });
  }

  async signin(username: string, password: string): Promise<{ username: string } | null> {
    const res = await this.publicPost(ClientApi.APIs.SIGNIN_URI, { username, password });

    if (res.status == 201 && res.body) {
      const data: SignInResDto = await res.json();
      this._token = data.accessToken;
      return { username: data.username };
    }

    return null;
  }
}

export default new ClientApi();
