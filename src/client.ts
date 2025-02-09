import { CloudflareResponse, DNSRecord } from './interface';
import { CloudflareAPIError } from './errors';
import { logOutput } from './utils';

export class CloudflareClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(
    private token: string,
    private zone: string
  ) {
    this.baseURL = 'https://api.cloudflare.com/client/v4/zones';
    this.headers = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async getRecordId(name: string): Promise<string | null> {
    const url = `${this.baseURL}/${this.zone}/dns_records?name=${name}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new CloudflareAPIError(`HTTP Error! status ${response.status}`);
    }

    const data = (await response.json()) as CloudflareResponse;

    if (data.success && data.result.length > 0) {
      return data.result[0].id;
    }
    return null;
  }

  async createRecord(record: DNSRecord): Promise<void> {
    const url = `${this.baseURL}/${this.zone}/dns_records`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      throw new CloudflareAPIError(`HTTP Error! status ${response.status}`);
    }

    const data: CloudflareResponse =
      (await response.json()) as CloudflareResponse;

    if (!data.success) {
      throw new CloudflareAPIError(data.errors[0].message);
    }

    logOutput('record_id', data.result[0].id);
    logOutput('name', data.result[0].name);
  }

  async updateRecord(id: string, record: DNSRecord): Promise<void> {
    const url = `${this.baseURL}/${this.zone}/dns_records/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      throw new CloudflareAPIError(`HTTP Error! status ${response.status}`);
    }

    const data: CloudflareResponse =
      (await response.json()) as CloudflareResponse;

    if (!data.success) {
      throw new CloudflareAPIError(data.errors[0].message);
    }

    logOutput('record_id', data.result[0].id);
    logOutput('name', data.result[0].name);
  }
}
