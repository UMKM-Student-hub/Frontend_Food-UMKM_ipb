export interface UMKM {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  location: string;
  is_open: boolean;
  created_at: string;
}

export interface UMKMCreateRequest {
  name: string;
  description: string;
  location: string;
}
