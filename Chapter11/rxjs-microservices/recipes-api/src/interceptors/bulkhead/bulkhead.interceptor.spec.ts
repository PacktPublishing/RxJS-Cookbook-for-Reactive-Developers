import { BulkheadInterceptor } from './bulkhead.interceptor';

describe('BulkheadInterceptor', () => {
  it('should be defined', () => {
    expect(new BulkheadInterceptor()).toBeDefined();
  });
});
