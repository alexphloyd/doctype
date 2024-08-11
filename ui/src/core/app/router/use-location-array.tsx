import { useLocation } from 'react-router-dom';

export const useLocationArray = () => {
  return useLocation()
    .pathname.split('/')
    .map((val) => val.replace('/', ''))
    .slice(1);
};
