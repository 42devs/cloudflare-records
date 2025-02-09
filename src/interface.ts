import { RecordType } from './enum';

export interface DNSRecord {
  type: RecordType;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

export interface CloudflareResponse {
  success: boolean;
  result: Array<{ id: string; name: string }>;
  errors: Array<{ message: string }>;
}
