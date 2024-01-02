import { sanitizeUrl } from '@braintree/sanitize-url';

const sanitizeUrlHelper = (url) => {
  const sanitizedUrl = sanitizeUrl(url);
  const checkerStartHttp = ['http', 'https'].some((element) => sanitizedUrl.includes(element));
  return !checkerStartHttp ? `http://${sanitizedUrl}` : sanitizedUrl;
};

export default sanitizeUrlHelper;
