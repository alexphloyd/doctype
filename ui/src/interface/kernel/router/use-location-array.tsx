import { useLocation } from 'react-router-dom';

/**
 * @description
 * Returns an array of URL path segments..
 *
 * @example
 * Given the current URL is `/home/dashboard`
 * Output: ['home', 'dashboard']
 */
export function useLocationArray() {
  return useLocation()
    .pathname.split('/')
    .map((val) => val.replace('/', ''))
    .slice(1) as RoutePath[];
}
