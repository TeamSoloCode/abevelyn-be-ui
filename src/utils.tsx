import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

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
