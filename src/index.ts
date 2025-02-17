import * as core from '@actions/core';
import { DNSRecord } from './interface';
import { logError, validateEnvironment } from './utils';
import { RecordType } from './enum';
import { CloudflareClient } from './client';

const main = async (): Promise<void> => {
  try {
    validateEnvironment();

    const {
      INPUT_TOKEN: token,
      INPUT_ZONE: zone,
      INPUT_TYPE: type,
      INPUT_NAME: name,
      INPUT_CONTENT: content,
      INPUT_TTL: ttl,
      INPUT_PROXIED: proxied
    } = process.env;

    const recordData: DNSRecord = {
      type: type as RecordType,
      name: name!,
      content: content!,
      ttl: Number(ttl),
      proxied: proxied === 'true'
    };

    const client = new CloudflareClient(token!, zone!);
    const recordId = await client.getRecordId(name!);

    if (recordId) {
      await client.updateRecord(recordId, recordData);
    } else {
      await client.createRecord(recordData);
    }

    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      logError('An unknown error occurred');
    }
  }
};

main();
