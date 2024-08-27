import { useObservable } from 'observable-hooks';
import { useLocation } from 'react-router-dom';
import { of } from 'rxjs';

export function useObservableLocation$() {
  const location = useLocation();
  const location$ = useObservable(() => of(location), [location]);

  return location$;
}