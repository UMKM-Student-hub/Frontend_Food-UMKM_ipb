export class ApiService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";
  }

  protected getHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  protected async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw await this.parseError(res);
    return res.json();
  }

  protected async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw await this.parseError(res);
    return res.json();
  }

  protected async patch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw await this.parseError(res);
    return res.json();
  }

  protected async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) throw await this.parseError(res);
    return res.json();
  }

  private async parseError(res: Response): Promise<Error> {
    try {
      const errorData = await res.json();
      return new Error(errorData.detail ?? "Terjadi kesalahan server");
    } catch {
      return new Error(`HTTP Error ${res.status}`);
    }
  }
}
