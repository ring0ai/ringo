import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SuccessData<T extends (...args: any) => any> =
  Awaited<ReturnType<T>> extends infer R
    ? Extract<R, { code: "SUCCESS"; data: any }> extends { data: infer D }
      ? D
      : never
    : never;
