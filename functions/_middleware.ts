interface MiddlewareContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

export const onRequest = async (context: MiddlewareContext): Promise<Response> => {
  const response = await context.next();
  const url = new URL(context.request.url);

  // Apply X-Robots-Tag: noindex, nofollow on preview deployments and staging hosts
  if (url.hostname !== 'trivoxagroup.com' && url.hostname !== 'www.trivoxagroup.com') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
};
