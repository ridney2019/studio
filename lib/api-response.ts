export type ApiMessageResponse = {
  ok: boolean;
  message?: string;
};

export const readApiMessage = async (response: Response): Promise<ApiMessageResponse> => {
  const text = await response.text();

  if (!text) {
    return {
      ok: response.ok,
      message: response.ok ? undefined : "The server returned an empty response.",
    };
  }

  try {
    return JSON.parse(text) as ApiMessageResponse;
  } catch {
    return {
      ok: response.ok,
      message: response.ok ? undefined : "The server returned an invalid response.",
    };
  }
};