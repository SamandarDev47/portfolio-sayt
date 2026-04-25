import type { ZodError } from "zod";

import type { ActionResponse } from "@/types/actions";

export function zodFieldErrors(error: ZodError) {
  return error.flatten().fieldErrors;
}

export function successResponse<T = void>(
  message: string,
  data?: T,
): ActionResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse<T = void>(
  message: string,
  fieldErrors?: Record<string, string[]>,
): ActionResponse<T> {
  return {
    success: false,
    message,
    fieldErrors,
  };
}
