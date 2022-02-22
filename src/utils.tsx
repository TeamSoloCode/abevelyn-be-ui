import { useEffect, useRef } from "react";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import { ClientApi, clientApi } from "./client-api/api.client";
import { Option } from "./components/FieldSelect";

export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export const showError = (message: string | string[]) => {
  if (message instanceof Array) {
    let result = "";
    message.forEach((msg) => {
      result += msg + "\n";
    });

    toast.error(result);
    return;
  }
  toast.error(message);
};

export const showSuccess = (message: string | string[]) => {
  if (message instanceof Array) {
    let result = "";
    message.forEach((msg) => {
      result += msg + "\n";
    });

    toast.success(result);
    return;
  }
  toast.success(message);
};

export const findOptionByValue = (options: Option[], value?: string): SingleValue<Option> | undefined => {
  return options.find((op) => op.value === value);
};

export const getImageUrl = (url: string | undefined) => {
  try {
    if (!url || url.startsWith("http")) return url || "";
    return clientApi.getImageURLByName(ClientApi.APIs.FETCH_IMAGE, url);
  } catch (err) {
    return "";
  }
};
