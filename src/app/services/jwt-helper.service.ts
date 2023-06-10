import { JwtHelperService } from '@auth0/angular-jwt';

export function jwtHelperFactory(): JwtHelperService {
  return new JwtHelperService();
}
