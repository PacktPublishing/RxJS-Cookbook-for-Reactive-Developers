import { useObservableState } from 'observable-hooks';
import { Location, Navigate } from 'react-router-dom';
import { switchMap } from 'rxjs';
import { useObservableLocation$ } from '../hooks/useLocation';
import { ajax } from 'rxjs/ajax';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const hasAccess$ = useObservableLocation$().pipe(
      switchMap((location: Location) => {
        return ajax<boolean>(`https://super-recipes.com/api/check-access`)
      })
  );
  const hasAccess = useObservableState(hasAccess$)
  const location = useObservableState(useObservableLocation$());

  if (hasAccess === undefined) return;
  
  return (
    <> 
      {hasAccess ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />}
    </>
  )
}

export default ProtectedRoute