class MissingEnvironmentError extends Error {
    constructor(variable) {
        super(`Missing required environment variable: ${variable}`);
        this.name = 'MissingEnvironmentError';
    }
}
class CloudflareAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CloudflareAPIError';
    }
}

// Utility Functions
const validateEnvironment = () => {
    const requiredVars = [
        'INPUT_TOKEN',
        'INPUT_ZONE',
        'INPUT_TYPE',
        'INPUT_NAME',
        'INPUT_CONTENT',
        'INPUT_TTL',
        'INPUT_PROXIED'
    ];
    for (const variable of requiredVars) {
        if (!process.env[variable]) {
            throw new MissingEnvironmentError(variable);
        }
    }
};
const logError = (message) => {
    console.error(`::error ::${message}`);
};
const logOutput = (name, value) => {
    console.log(`::set-output name=${name}::${value}`);
};

class CloudflareClient {
    constructor(token, zone) {
        this.token = token;
        this.zone = zone;
        this.baseURL = 'https://api.cloudflare.com/client/v4/zones';
        this.headers = {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
    async getRecordId(name) {
        const url = `${this.baseURL}/${this.zone}/dns_records?name=${name}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });
        if (!response.ok) {
            throw new CloudflareAPIError(`HTTP Error! status ${response.status}`);
        }
        const data = (await response.json());
        if (data.success && data.result.length > 0) {
            return data.result[0].id;
        }
        return null;
    }
    async createRecord(record) {
        const url = `${this.baseURL}/${this.zone}/dns_records`;
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(record)
        });
        if (!response.ok) {
            throw new CloudflareAPIError(`HTTP Error! status ${response.status}`);
        }
        const data = (await response.json());
        if (!data.success) {
            throw new CloudflareAPIError(data.errors[0].message);
        }
        logOutput('record_id', data.result[0].id);
        logOutput('name', data.result[0].name);
    }
    async updateRecord(id, record) {
        const url = `${this.baseURL}/${this.zone}/dns_records/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(record)
        });
        if (!response.ok) {
            throw new CloudflareAPIError(`HTTP Error! status ${response.status}`);
        }
        const data = (await response.json());
        if (!data.success) {
            throw new CloudflareAPIError(data.errors[0].message);
        }
        logOutput('record_id', data.result[0].id);
        logOutput('name', data.result[0].name);
    }
}

const main = async () => {
    try {
        validateEnvironment();
        const { INPUT_TOKEN: token, INPUT_ZONE: zone, INPUT_TYPE: type, INPUT_NAME: name, INPUT_CONTENT: content, INPUT_TTL: ttl, INPUT_PROXIED: proxied } = process.env;
        const recordData = {
            type: type,
            name: name,
            content: content,
            ttl: Number(ttl),
            proxied: proxied === 'true'
        };
        const client = new CloudflareClient(token, zone);
        const recordId = await client.getRecordId(name);
        if (recordId) {
            await client.updateRecord(recordId, recordData);
        }
        else {
            await client.createRecord(recordData);
        }
        process.exit(0);
    }
    catch (error) {
        if (error instanceof Error) {
            logError(error.message);
        }
        else {
            logError('An unknown error occurred');
        }
        process.exit(1);
    }
};
main();
