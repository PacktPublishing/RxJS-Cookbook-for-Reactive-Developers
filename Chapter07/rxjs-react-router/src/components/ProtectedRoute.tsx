import { useObservableState } from 'observable-hooks';
import { Location, Navigate } from 'react-router-dom';
import { map } from 'rxjs';
import { useObservableLocation$ } from '../hooks/useLocation';

const ProtectedRoute = ({ children }: any) => {
  const location$ = useObservableLocation$().pipe(
      map(({ pathname }: Location) => {
          const parts = pathname.split('/');
          const userIdIndex = parts.findIndex(part => part === 'home') + 1;
          return parts[userIdIndex];
        })
  );
  const location = useObservableState(location$)

  if (!location) return;
  
  return (
    <> 
      {location === '123' ? <div>{children}</div> : <Navigate to="/login" replace state={{ from: location }} />}
    </>
  )
}

export default ProtectedRoute