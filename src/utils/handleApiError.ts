import { ERROR_MESSAGES } from "@/constants/messages";

export function handleApiError(err: any) {
  if (!err.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const { status } = err.response;

  switch (status) {
    case 400:
      return "Bad request. Please check your input.";
    case 401:
      return ERROR_MESSAGES.LOGIN_INVALID;
    case 403:
      return "You are not authorized to perform this action.";
    case 404:
      return "Requested resource not found.";
    case 422:
      return "Validation failed. Please check your data.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}