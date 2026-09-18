interface MiddlewareContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

export const onRequest = async (context: MiddlewareContext): Promise<Response> => {
  let response = await context.next();
  const url = new URL(context.request.url);

  // If Cloudflare Pages returned 404 on an RSC .txt request, attempt fallback resolving
  if (response.status === 404 && url.pathname.endsWith('.__PAGE__.txt')) {
    const filename = url.pathname.split('/').pop() || '';
    const basePath = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
    const nestedSubpath = filename.replace(/\.__PAGE__\.txt$/, '/__PAGE__.txt');
    const fallbackUrl = new URL(`${basePath}/${nestedSubpath}${url.search}`, url.origin);
    const fallbackResp = await context.next(fallbackUrl.toString());
    if (fallbackResp.status === 200) {
      response = fallbackResp;
    }
  }

  // Apply X-Robots-Tag: noindex, nofollow on preview deployments and staging hosts
  if (url.hostname !== 'trivoxagroup.com' && url.hostname !== 'www.trivoxagroup.com') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
};
