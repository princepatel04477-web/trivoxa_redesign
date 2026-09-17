/**
 * Human-readable reference numbers for the desk to quote back to a buyer
 * ("your enquiry TRV-RFQ-4F2A9C1B"). `crypto.randomUUID()` is a Web Crypto
 * API call, available natively in the Workers runtime — no dependency.
 */
export function generateReference(prefix: 'RFQ' | 'CNT' | 'SUB'): string {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
  return `TRV-${prefix}-${id}`;
}
