export enum AppRoutes {
  COLLECTIONS = "collections",
  CREATE_COLLECTION = "create-collection",
  UPDATE_COLLECTION = "update-collection",

  COLORS = "colors",
  CREATE_COLORS = "create-color",
  UPDATE_COLORS = "update-color",

  SIZES = "sizes",
  CREATE_SIZE = "create-size",
  UPDATE_SIZE = "update-size",

  PRODUCT_STATUS = "product-status",
  CREATE_PRODUCT_STATUS = "create-product-status",
  UPDATE_PRODUCT_STATUS = "update-product-status",

  PRODUCTS = "products",
  CREATE_PRODUCT = "create-product",
  UPDATE_PRODUCT = "update-product",

  MATERIAL = "materials",
  CREATE_MATERIAL = "create-material",
  UPDATE_MATERIAL = "update-material",

  SALE = "sales",
  CREATE_SALE = "create-sale",
  UPDATE_SALE = "update-sale",

  USERS = "users",

  HOME = "home",
  SIGNIN = "signin",
}

export enum SaleUnit {
  PERCENTAGE = "%",
  USD = "usd",
}

export enum SaleType {
  ORDER = "order",
  COLLECTION = "collection",
  PRODUCT = "product",
  COMBO = "combo",
}

export enum SignInType {
  FACEBOOK = "facebook",
  GOOGLE = "google",
  REGISTER = "register",
}

export enum UserRoles {
  ROOT = "root",
  ADMIN = "admin",
  USER = "user",
}

export const DEFAULT_DATETIME_FORMAT = "MM-DD-YYYY HH:mm";
