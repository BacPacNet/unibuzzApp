export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestData<T> {
  data?: T | T[];
  token?: string;
  headers?: { [key: string]: string };
  absoluteUrl?: boolean;
  method?: MethodType;
  transform?: boolean;
  customBaseUrl?: boolean;
  id?: string | number;
  page?: number;
  size?: number;
  userCode?: string;
  email?: string;
}

export interface ServerData<T> {
  items: T[];
}

export interface SuccessResponse {
  success: true;
}

export type ServerResponse<T> = T & T[] & ServerData<T> & SuccessResponse;

export type RequestFields = string[];
export interface IFieldsAndFilters<T> {
  fields?: RequestFields;
  filters?: T & { sortField?: string; sortOrder?: string };
  offset?: number;
  limit?: number;
}
