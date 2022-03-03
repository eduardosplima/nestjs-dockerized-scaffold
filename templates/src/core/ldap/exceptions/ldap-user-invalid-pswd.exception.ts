export class LdapUserInvalidPswdException extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, LdapUserInvalidPswdException);
  }
}
