import { DNSRecord } from './interface';
export declare class CloudflareClient {
    private token;
    private zone;
    private baseURL;
    private headers;
    constructor(token: string, zone: string);
    getRecordId(name: string): Promise<string | null>;
    createRecord(record: DNSRecord): Promise<void>;
    updateRecord(id: string, record: DNSRecord): Promise<void>;
}
