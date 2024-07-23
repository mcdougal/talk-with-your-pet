import { ParsedUrlQuery } from 'querystring';

export type Router = {
  query: ParsedUrlQuery;
};

type GetPathArgs<P, S> =
  P extends Record<string, never>
    ? S extends Record<string, never>
      ? Record<string, never>
      : { searchParams: S }
    : S extends Record<string, never>
      ? { params: P }
      : { params: P; searchParams: S };

type RouteDefinition<P, S> = {
  /**
   * Build a link to this page in the app.
   */
  path: (args: GetPathArgs<P, S>) => string;
};

export type Route<P, S> = {
  /**
   * Build a link to this page in the app.
   */
  getPath: (args: GetPathArgs<P, S>) => string;
};

export default <P = Record<string, never>, S = Record<string, never>>(
  routeDefinition: RouteDefinition<P, S>
): Route<P, S> => {
  const getPath = (args: GetPathArgs<P, S>): string => {
    return routeDefinition.path(args);
  };

  const route = {
    getPath,
  };

  return route;
};
