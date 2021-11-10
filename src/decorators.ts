import { ClientApi } from "./api.client";

const requiredMetadataKey = Symbol("required");

export function GetFullApi(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log("abcd", target, propertyKey, parameterIndex);
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function updateApiCall(target: any, methodName: string, descriptor?: PropertyDescriptor) {
  let originalFunction = target[methodName];

  let auditFunction = function (this: any) {
    if (typeof arguments[0] == "string") {
      arguments[0] = ClientApi.ROOT_API + arguments[0];
    }
    return originalFunction.apply(this, arguments);
  };
  target[methodName] = auditFunction;
  return originalFunction;
}
