Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const client_1 = require("./client");
const main = async () => {
    try {
        (0, utils_1.validateEnvironment)();
        const { INPUT_TOKEN: token, INPUT_ZONE: zone, INPUT_TYPE: type, INPUT_NAME: name, INPUT_CONTENT: content, INPUT_TTL: ttl, INPUT_PROXIED: proxied } = process.env;
        const recordData = {
            type: type,
            name: name,
            content: content,
            ttl: Number(ttl),
            proxied: proxied === 'true'
        };
        const client = new client_1.CloudflareClient(token, zone);
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
            (0, utils_1.logError)(error.message);
        }
        else {
            (0, utils_1.logError)('An unknown error occurred');
        }
        process.exit(1);
    }
};
main();
//# sourceMappingURL=index.js.map
