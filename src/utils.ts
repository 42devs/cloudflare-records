import * as core from '@actions/core';

import { MissingEnvironmentError } from './errors';

// Utility Functions
export const validateEnvironment = (): void => {
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

export const logError = (message: string): void => {
  core.setFailed(`::error ::${message}`);
};

export const logOutput = (name: string, value: string): void => {
  core.setFailed(`::set-output name=${name}::${value}`);
};
