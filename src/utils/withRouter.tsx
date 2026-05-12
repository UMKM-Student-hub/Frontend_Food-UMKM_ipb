import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function withRouter<P extends object>(Component: React.ComponentType<P>) {
  return function WrapperComponent(props: P) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    return <Component {...props} params={params} navigate={navigate} location={location} />;
  };
}