import { ClientApi } from "./api.client";
import "reflect-metadata";

const requiredMetadataKey = Symbol("pathName");

export function FullApiUrl(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function PrependRootApi(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
  let method = descriptor.value!;

  descriptor.value = function () {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] !== undefined) {
          arguments[parameterIndex] = ClientApi.ROOT_API + arguments[parameterIndex];
        }
      }
    }
    return method.apply(this, arguments);
  };
}
