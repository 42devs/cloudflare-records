export class MissingEnvironmentError extends Error {
  constructor(variable: string) {
    super(`Missing required environment variable: ${variable}`);
    this.name = 'MissingEnvironmentError';
  }
}

export class CloudflareAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudflareAPIError';
  }
}
