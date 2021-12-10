export interface JwtPayload {
  aud: string;

  exp: number;

  iat: number;

  iss: string;

  jti: string;

  sub: string;
}
