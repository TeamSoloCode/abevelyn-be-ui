import { ClientApi } from "./client-api/api.client";
import "reflect-metadata";

const pathURLMetadataKey = Symbol("pathURL");

export function fullApiUrl(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingPathURLParameters: number[] = Reflect.getOwnMetadata(pathURLMetadataKey, target, propertyKey) || [];
  existingPathURLParameters.push(parameterIndex);
  Reflect.defineMetadata(pathURLMetadataKey, existingPathURLParameters, target, propertyKey);
}

export function prependRootApi(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
  let method = descriptor.value!;

  descriptor.value = function () {
    let pathURLParameters: number[] = Reflect.getOwnMetadata(pathURLMetadataKey, target, propertyName);
    if (pathURLParameters) {
      for (let parameterIndex of pathURLParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] !== undefined) {
          arguments[parameterIndex] = ClientApi.ROOT_API + arguments[parameterIndex];
        }
      }
    }
    return method.apply(this, arguments);
  };
}
