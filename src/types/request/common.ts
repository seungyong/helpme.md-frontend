import { ApiError } from "../error";

export interface Callback<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}
