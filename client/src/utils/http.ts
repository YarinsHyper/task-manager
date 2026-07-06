// Generic fetch response handling, not tied to any one resource: unwraps
// JSON on success, throws the server's error message on failure. Every
// endpoint in this API always returns a JSON body, so there's no 204/empty
// case to special-case here.
export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}
