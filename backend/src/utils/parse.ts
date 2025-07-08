export function parseDevice(ua: string): string {
  const uaLower = ua.toLowerCase();
  if (/mobile|iphone|android(?!.*tablet)/i.test(uaLower)) return 'Mobile';
  if (/ipad|tablet|nexus 7|nexus 10|kindle|playbook|silk/i.test(uaLower)) return 'Tablet';
  if (/smart-tv|hbbtv|appletv|googletv|tizen/i.test(uaLower)) return 'TV';
  if (/playstation|xbox|nintendo/i.test(uaLower)) return 'Console';
  if (/bot|crawl|slurp|spider|mediapartners/i.test(uaLower)) return 'Bot';
  return 'Desktop';
}

export function parseBrowser(ua: string): string {
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return 'Safari';
  if (/edg/i.test(ua)) return 'Edge';
  return 'Other';
}