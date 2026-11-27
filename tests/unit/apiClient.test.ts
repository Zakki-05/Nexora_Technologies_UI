import { describe, it, expect } from 'vitest';
import { isApiEnvelope, extractErrorMessage } from '@/services/apiClient';
import type { AxiosError } from 'axios';
import type { ApiErrorShape } from '@/types/api';

describe('Nexora 3.0 Typed API Client', () => {
  it('detects standardized FastAPI response envelope', () => {
    expect(
      isApiEnvelope({
        success: true,
        message: 'Employees retrieved successfully',
        status_code: 200,
        data: { items: [], total: 0 },
      })
    ).toBe(true);
  });

  it('rejects non-envelope payloads', () => {
    expect(isApiEnvelope({ access_token: 'abc' })).toBe(false);
    expect(isApiEnvelope(null)).toBe(false);
    expect(isApiEnvelope('plain string')).toBe(false);
  });

  it('extracts message from standardized error envelope', () => {
    const mockError = {
      message: 'Request failed with status code 401',
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Invalid or expired authentication token',
          status_code: 401,
          data: {},
        },
      },
    } as AxiosError<ApiErrorShape>;

    expect(extractErrorMessage(mockError)).toBe('Invalid or expired authentication token');
  });
});
