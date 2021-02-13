/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.10.1.0 (NJsonSchema v10.3.3.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

export class IConfig {
  /* 
      ApiClient.ts
      This is the base classes for the NSwag generated ApiClient. Has overrides for transformOptions and getBaseUrl to allow me to instantiate a client and
      inject firebase authorization tokens into the request header for the back end to then verify and get my own baseUrl stored in a config file.
      A comment at the top of this file will actually break client generation and for whatever reason this will end up at the bottom of Client.ts not the top.
    */
  constructor(token: string) {
    this.JwtToken = token;
  }
  /*
      Returns a valid value for the Authorization header.
      Used to dynamically inject the current auth header.
     */
  JwtToken: string;
}

export class AuthorizedApiBase {
  private readonly config: IConfig;

  protected constructor(config: IConfig) {
    this.config = config;
  }

  protected transformOptions = (options: RequestInit): Promise<RequestInit> => {
    options.headers = {
      ...options.headers,
      Authorization: this.config.JwtToken,
    };
    return Promise.resolve(options);
  };

  protected getBaseUrl = (defaultUrl: string, baseUrl?: string) => {
    const ApiUrl =
      process.env.NODE_ENV === "production"
        ? "https://192.168.0.69:4471"
        : "https://localhost:44306";
    return ApiUrl !== undefined ? ApiUrl : defaultUrl;
  };
}

export class Client extends AuthorizedApiBase {
  private http: {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
  };
  private baseUrl: string;
  protected jsonParseReviver:
    | ((key: string, value: any) => any)
    | undefined = undefined;

  constructor(
    configuration: IConfig,
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }
  ) {
    super(configuration);
    this.http = http ? http : <any>window;
    this.baseUrl = this.getBaseUrl("https://localhost:44306", baseUrl);
  }

  /**
   * @param metadata (optional) ClientMetadata
   * @return Success getting auth token
   */
  authentication_GetOAuthTokenWithUserInfo(
    code: string | null,
    state: string | null,
    metadata: any | undefined
  ): Promise<TokenUserResponse> {
    let url_ = this.baseUrl + "/auth/token/{code}/{state}";
    if (code === undefined || code === null)
      throw new Error("The parameter 'code' must be defined.");
    url_ = url_.replace("{code}", encodeURIComponent("" + code));
    if (state === undefined || state === null)
      throw new Error("The parameter 'state' must be defined.");
    url_ = url_.replace("{state}", encodeURIComponent("" + state));
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <RequestInit>{
      method: "GET",
      headers: {
        Metadata:
          metadata !== undefined && metadata !== null ? "" + metadata : "",
        Accept: "application/json",
      },
    };

    return this.transformOptions(options_)
      .then((transformedOptions_) => {
        return this.http.fetch(url_, transformedOptions_);
      })
      .then((_response: Response) => {
        return this.processAuthentication_GetOAuthTokenWithUserInfo(_response);
      });
  }

  protected processAuthentication_GetOAuthTokenWithUserInfo(
    response: Response
  ): Promise<TokenUserResponse> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => (_headers[k] = v));
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = TokenUserResponse.fromJS(resultData200);
        return result200;
      });
    } else if (status === 400) {
      return response.text().then((_responseText) => {
        let result400: any = null;
        let resultData400 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result400 = ValidationResponse.fromJS(resultData400);
        return throwException(
          "Bad request getting auth token",
          status,
          _responseText,
          _headers,
          result400
        );
      });
    } else if (status === 401) {
      return response.text().then((_responseText) => {
        let result401: any = null;
        let resultData401 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result401 = UnauthorizedResponse.fromJS(resultData401);
        return throwException(
          "No token provided when getting user info",
          status,
          _responseText,
          _headers,
          result401
        );
      });
    } else if (status === 404) {
      return response.text().then((_responseText) => {
        let result404: any = null;
        let resultData404 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result404 = NotFoundResponse.fromJS(resultData404);
        return throwException(
          "Error getting auth token, code provided not found",
          status,
          _responseText,
          _headers,
          result404
        );
      });
    } else if (status === 500) {
      return response.text().then((_responseText) => {
        let result500: any = null;
        let resultData500 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result500 = ProblemDetails.fromJS(resultData500);
        return throwException(
          "Error getting auth token",
          status,
          _responseText,
          _headers,
          result500
        );
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<TokenUserResponse>(<any>null);
  }

  /**
   * @param metadata (optional) ClientMetadata
   * @return Success getting github redirect url
   */
  authentication_GetLoginRedirectUrl(
    metadata: any | undefined
  ): Promise<string> {
    let url_ = this.baseUrl + "/auth/login-redirect";
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <RequestInit>{
      method: "GET",
      headers: {
        Metadata:
          metadata !== undefined && metadata !== null ? "" + metadata : "",
        Accept: "application/json",
      },
    };

    return this.transformOptions(options_)
      .then((transformedOptions_) => {
        return this.http.fetch(url_, transformedOptions_);
      })
      .then((_response: Response) => {
        return this.processAuthentication_GetLoginRedirectUrl(_response);
      });
  }

  protected processAuthentication_GetLoginRedirectUrl(
    response: Response
  ): Promise<string> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => (_headers[k] = v));
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = resultData200 !== undefined ? resultData200 : <any>null;
        return result200;
      });
    } else if (status === 400) {
      return response.text().then((_responseText) => {
        let result400: any = null;
        let resultData400 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result400 = ValidationResponse.fromJS(resultData400);
        return throwException(
          "Bad request getting redirect url",
          status,
          _responseText,
          _headers,
          result400
        );
      });
    } else if (status === 404) {
      return response.text().then((_responseText) => {
        let result404: any = null;
        let resultData404 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result404 = NotFoundResponse.fromJS(resultData404);
        return throwException(
          "Error getting redirect url",
          status,
          _responseText,
          _headers,
          result404
        );
      });
    } else if (status === 500) {
      return response.text().then((_responseText) => {
        let result500: any = null;
        let resultData500 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result500 = ProblemDetails.fromJS(resultData500);
        return throwException(
          "Error getting redirect url",
          status,
          _responseText,
          _headers,
          result500
        );
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<string>(<any>null);
  }

  /**
   * @param metadata (optional) ClientMetadata
   * @return Success getting user info
   */
  authentication_GetUserInformationForToken(
    metadata: any | undefined
  ): Promise<User> {
    let url_ = this.baseUrl + "/auth/user-info";
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <RequestInit>{
      method: "GET",
      headers: {
        Metadata:
          metadata !== undefined && metadata !== null ? "" + metadata : "",
        Accept: "application/json",
      },
    };

    return this.transformOptions(options_)
      .then((transformedOptions_) => {
        return this.http.fetch(url_, transformedOptions_);
      })
      .then((_response: Response) => {
        return this.processAuthentication_GetUserInformationForToken(_response);
      });
  }

  protected processAuthentication_GetUserInformationForToken(
    response: Response
  ): Promise<User> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => (_headers[k] = v));
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = User.fromJS(resultData200);
        return result200;
      });
    } else if (status === 401) {
      return response.text().then((_responseText) => {
        let result401: any = null;
        let resultData401 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result401 = UnauthorizedResponse.fromJS(resultData401);
        return throwException(
          "No token provided",
          status,
          _responseText,
          _headers,
          result401
        );
      });
    } else if (status === 404) {
      return response.text().then((_responseText) => {
        let result404: any = null;
        let resultData404 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result404 = NotFoundResponse.fromJS(resultData404);
        return throwException(
          "User not found",
          status,
          _responseText,
          _headers,
          result404
        );
      });
    } else if (status === 500) {
      return response.text().then((_responseText) => {
        let result500: any = null;
        let resultData500 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result500 = ProblemDetails.fromJS(resultData500);
        return throwException(
          "Error getting user",
          status,
          _responseText,
          _headers,
          result500
        );
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<User>(<any>null);
  }
}

export class TokenUserResponse implements ITokenUserResponse {
  accessToken?: string | undefined;
  user?: User | undefined;

  constructor(data?: ITokenUserResponse) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.accessToken = _data["accessToken"];
      this.user = _data["user"] ? User.fromJS(_data["user"]) : <any>undefined;
    }
  }

  static fromJS(data: any): TokenUserResponse {
    data = typeof data === "object" ? data : {};
    let result = new TokenUserResponse();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["accessToken"] = this.accessToken;
    data["user"] = this.user ? this.user.toJSON() : <any>undefined;
    return data;
  }
}

export interface ITokenUserResponse {
  accessToken?: string | undefined;
  user?: User | undefined;
}

export abstract class Account implements IAccount {
  avatarUrl?: string | undefined;
  bio?: string | undefined;
  blog?: string | undefined;
  collaborators?: number | undefined;
  company?: string | undefined;
  createdAt?: Date;
  diskUsage?: number | undefined;
  email?: string | undefined;
  followers?: number;
  following?: number;
  hireable?: boolean | undefined;
  htmlUrl?: string | undefined;
  id?: number;
  nodeId?: string | undefined;
  location?: string | undefined;
  login?: string | undefined;
  name?: string | undefined;
  type?: AccountType | undefined;
  ownedPrivateRepos?: number;
  plan?: Plan | undefined;
  privateGists?: number | undefined;
  publicGists?: number;
  publicRepos?: number;
  totalPrivateRepos?: number;
  url?: string | undefined;

  constructor(data?: IAccount) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.avatarUrl = _data["avatarUrl"];
      this.bio = _data["bio"];
      this.blog = _data["blog"];
      this.collaborators = _data["collaborators"];
      this.company = _data["company"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
      this.diskUsage = _data["diskUsage"];
      this.email = _data["email"];
      this.followers = _data["followers"];
      this.following = _data["following"];
      this.hireable = _data["hireable"];
      this.htmlUrl = _data["htmlUrl"];
      this.id = _data["id"];
      this.nodeId = _data["nodeId"];
      this.location = _data["location"];
      this.login = _data["login"];
      this.name = _data["name"];
      this.type = _data["type"];
      this.ownedPrivateRepos = _data["ownedPrivateRepos"];
      this.plan = _data["plan"] ? Plan.fromJS(_data["plan"]) : <any>undefined;
      this.privateGists = _data["privateGists"];
      this.publicGists = _data["publicGists"];
      this.publicRepos = _data["publicRepos"];
      this.totalPrivateRepos = _data["totalPrivateRepos"];
      this.url = _data["url"];
    }
  }

  static fromJS(data: any): Account {
    data = typeof data === "object" ? data : {};
    throw new Error("The abstract class 'Account' cannot be instantiated.");
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["avatarUrl"] = this.avatarUrl;
    data["bio"] = this.bio;
    data["blog"] = this.blog;
    data["collaborators"] = this.collaborators;
    data["company"] = this.company;
    data["createdAt"] = this.createdAt
      ? this.createdAt.toISOString()
      : <any>undefined;
    data["diskUsage"] = this.diskUsage;
    data["email"] = this.email;
    data["followers"] = this.followers;
    data["following"] = this.following;
    data["hireable"] = this.hireable;
    data["htmlUrl"] = this.htmlUrl;
    data["id"] = this.id;
    data["nodeId"] = this.nodeId;
    data["location"] = this.location;
    data["login"] = this.login;
    data["name"] = this.name;
    data["type"] = this.type;
    data["ownedPrivateRepos"] = this.ownedPrivateRepos;
    data["plan"] = this.plan ? this.plan.toJSON() : <any>undefined;
    data["privateGists"] = this.privateGists;
    data["publicGists"] = this.publicGists;
    data["publicRepos"] = this.publicRepos;
    data["totalPrivateRepos"] = this.totalPrivateRepos;
    data["url"] = this.url;
    return data;
  }
}

export interface IAccount {
  avatarUrl?: string | undefined;
  bio?: string | undefined;
  blog?: string | undefined;
  collaborators?: number | undefined;
  company?: string | undefined;
  createdAt?: Date;
  diskUsage?: number | undefined;
  email?: string | undefined;
  followers?: number;
  following?: number;
  hireable?: boolean | undefined;
  htmlUrl?: string | undefined;
  id?: number;
  nodeId?: string | undefined;
  location?: string | undefined;
  login?: string | undefined;
  name?: string | undefined;
  type?: AccountType | undefined;
  ownedPrivateRepos?: number;
  plan?: Plan | undefined;
  privateGists?: number | undefined;
  publicGists?: number;
  publicRepos?: number;
  totalPrivateRepos?: number;
  url?: string | undefined;
}

export class User extends Account implements IUser {
  permissions?: RepositoryPermissions | undefined;
  siteAdmin?: boolean;
  suspendedAt?: Date | undefined;
  suspended?: boolean;
  ldapDistinguishedName?: string | undefined;
  updatedAt?: Date;

  constructor(data?: IUser) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.permissions = _data["permissions"]
        ? RepositoryPermissions.fromJS(_data["permissions"])
        : <any>undefined;
      this.siteAdmin = _data["siteAdmin"];
      this.suspendedAt = _data["suspendedAt"]
        ? new Date(_data["suspendedAt"].toString())
        : <any>undefined;
      this.suspended = _data["suspended"];
      this.ldapDistinguishedName = _data["ldapDistinguishedName"];
      this.updatedAt = _data["updatedAt"]
        ? new Date(_data["updatedAt"].toString())
        : <any>undefined;
    }
  }

  static fromJS(data: any): User {
    data = typeof data === "object" ? data : {};
    let result = new User();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["permissions"] = this.permissions
      ? this.permissions.toJSON()
      : <any>undefined;
    data["siteAdmin"] = this.siteAdmin;
    data["suspendedAt"] = this.suspendedAt
      ? this.suspendedAt.toISOString()
      : <any>undefined;
    data["suspended"] = this.suspended;
    data["ldapDistinguishedName"] = this.ldapDistinguishedName;
    data["updatedAt"] = this.updatedAt
      ? this.updatedAt.toISOString()
      : <any>undefined;
    super.toJSON(data);
    return data;
  }
}

export interface IUser extends IAccount {
  permissions?: RepositoryPermissions | undefined;
  siteAdmin?: boolean;
  suspendedAt?: Date | undefined;
  suspended?: boolean;
  ldapDistinguishedName?: string | undefined;
  updatedAt?: Date;
}

export class RepositoryPermissions implements IRepositoryPermissions {
  admin?: boolean;
  push?: boolean;
  pull?: boolean;

  constructor(data?: IRepositoryPermissions) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.admin = _data["admin"];
      this.push = _data["push"];
      this.pull = _data["pull"];
    }
  }

  static fromJS(data: any): RepositoryPermissions {
    data = typeof data === "object" ? data : {};
    let result = new RepositoryPermissions();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["admin"] = this.admin;
    data["push"] = this.push;
    data["pull"] = this.pull;
    return data;
  }
}

export interface IRepositoryPermissions {
  admin?: boolean;
  push?: boolean;
  pull?: boolean;
}

export enum AccountType {
  User = 0,
  Organization = 1,
  Bot = 2,
}

export class Plan implements IPlan {
  collaborators?: number;
  name?: string | undefined;
  privateRepos?: number;
  space?: number;
  billingEmail?: string | undefined;

  constructor(data?: IPlan) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.collaborators = _data["collaborators"];
      this.name = _data["name"];
      this.privateRepos = _data["privateRepos"];
      this.space = _data["space"];
      this.billingEmail = _data["billingEmail"];
    }
  }

  static fromJS(data: any): Plan {
    data = typeof data === "object" ? data : {};
    let result = new Plan();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["collaborators"] = this.collaborators;
    data["name"] = this.name;
    data["privateRepos"] = this.privateRepos;
    data["space"] = this.space;
    data["billingEmail"] = this.billingEmail;
    return data;
  }
}

export interface IPlan {
  collaborators?: number;
  name?: string | undefined;
  privateRepos?: number;
  space?: number;
  billingEmail?: string | undefined;
}

export abstract class BaseResponse implements IBaseResponse {
  message?: string | undefined;
  title?: string | undefined;

  constructor(data?: IBaseResponse) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.message = _data["message"];
      this.title = _data["title"];
    }
  }

  static fromJS(data: any): BaseResponse {
    data = typeof data === "object" ? data : {};
    throw new Error(
      "The abstract class 'BaseResponse' cannot be instantiated."
    );
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["message"] = this.message;
    data["title"] = this.title;
    return data;
  }
}

export interface IBaseResponse {
  message?: string | undefined;
  title?: string | undefined;
}

export class ValidationResponse
  extends BaseResponse
  implements IValidationResponse {
  validationErrors?: { [key: string]: string } | undefined;

  constructor(data?: IValidationResponse) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      if (_data["validationErrors"]) {
        this.validationErrors = {} as any;
        for (let key in _data["validationErrors"]) {
          if (_data["validationErrors"].hasOwnProperty(key))
            this.validationErrors![key] = _data["validationErrors"][key];
        }
      }
    }
  }

  static fromJS(data: any): ValidationResponse {
    data = typeof data === "object" ? data : {};
    let result = new ValidationResponse();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    if (this.validationErrors) {
      data["validationErrors"] = {};
      for (let key in this.validationErrors) {
        if (this.validationErrors.hasOwnProperty(key))
          data["validationErrors"][key] = this.validationErrors[key];
      }
    }
    super.toJSON(data);
    return data;
  }
}

export interface IValidationResponse extends IBaseResponse {
  validationErrors?: { [key: string]: string } | undefined;
}

export class UnauthorizedResponse
  extends BaseResponse
  implements IUnauthorizedResponse {
  constructor(data?: IUnauthorizedResponse) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
  }

  static fromJS(data: any): UnauthorizedResponse {
    data = typeof data === "object" ? data : {};
    let result = new UnauthorizedResponse();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    super.toJSON(data);
    return data;
  }
}

export interface IUnauthorizedResponse extends IBaseResponse {}

export class NotFoundResponse
  extends BaseResponse
  implements INotFoundResponse {
  badProperties?: { [key: string]: string } | undefined;

  constructor(data?: INotFoundResponse) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      if (_data["badProperties"]) {
        this.badProperties = {} as any;
        for (let key in _data["badProperties"]) {
          if (_data["badProperties"].hasOwnProperty(key))
            this.badProperties![key] = _data["badProperties"][key];
        }
      }
    }
  }

  static fromJS(data: any): NotFoundResponse {
    data = typeof data === "object" ? data : {};
    let result = new NotFoundResponse();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    if (this.badProperties) {
      data["badProperties"] = {};
      for (let key in this.badProperties) {
        if (this.badProperties.hasOwnProperty(key))
          data["badProperties"][key] = this.badProperties[key];
      }
    }
    super.toJSON(data);
    return data;
  }
}

export interface INotFoundResponse extends IBaseResponse {
  badProperties?: { [key: string]: string } | undefined;
}

export class ProblemDetails implements IProblemDetails {
  type?: string | undefined;
  title?: string | undefined;
  status?: number | undefined;
  detail?: string | undefined;
  instance?: string | undefined;
  extensions?: { [key: string]: any } | undefined;

  constructor(data?: IProblemDetails) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.type = _data["type"];
      this.title = _data["title"];
      this.status = _data["status"];
      this.detail = _data["detail"];
      this.instance = _data["instance"];
      if (_data["extensions"]) {
        this.extensions = {} as any;
        for (let key in _data["extensions"]) {
          if (_data["extensions"].hasOwnProperty(key))
            this.extensions![key] = _data["extensions"][key];
        }
      }
    }
  }

  static fromJS(data: any): ProblemDetails {
    data = typeof data === "object" ? data : {};
    let result = new ProblemDetails();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["type"] = this.type;
    data["title"] = this.title;
    data["status"] = this.status;
    data["detail"] = this.detail;
    data["instance"] = this.instance;
    if (this.extensions) {
      data["extensions"] = {};
      for (let key in this.extensions) {
        if (this.extensions.hasOwnProperty(key))
          data["extensions"][key] = this.extensions[key];
      }
    }
    return data;
  }
}

export interface IProblemDetails {
  type?: string | undefined;
  title?: string | undefined;
  status?: number | undefined;
  detail?: string | undefined;
  instance?: string | undefined;
  extensions?: { [key: string]: any } | undefined;
}

export class ClientMetadata implements IClientMetadata {
  page?: string | undefined;
  referrer?: string | undefined;
  browserName?: string | undefined;
  browserEngine?: string | undefined;
  browserLanguage?: string | undefined;
  cookiesEnabled?: boolean;

  constructor(data?: IClientMetadata) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.page = _data["page"];
      this.referrer = _data["referrer"];
      this.browserName = _data["browserName"];
      this.browserEngine = _data["browserEngine"];
      this.browserLanguage = _data["browserLanguage"];
      this.cookiesEnabled = _data["cookiesEnabled"];
    }
  }

  static fromJS(data: any): ClientMetadata {
    data = typeof data === "object" ? data : {};
    let result = new ClientMetadata();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["page"] = this.page;
    data["referrer"] = this.referrer;
    data["browserName"] = this.browserName;
    data["browserEngine"] = this.browserEngine;
    data["browserLanguage"] = this.browserLanguage;
    data["cookiesEnabled"] = this.cookiesEnabled;
    return data;
  }
}

export interface IClientMetadata {
  page?: string | undefined;
  referrer?: string | undefined;
  browserName?: string | undefined;
  browserEngine?: string | undefined;
  browserLanguage?: string | undefined;
  cookiesEnabled?: boolean;
}

export class ApiException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any
  ) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }
}

function throwException(
  message: string,
  status: number,
  response: string,
  headers: { [key: string]: any },
  result?: any
): any {
  if (result !== null && result !== undefined) throw result;
  else throw new ApiException(message, status, response, headers, null);
}
