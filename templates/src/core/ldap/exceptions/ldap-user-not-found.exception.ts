export class LdapUserNotFoundException extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, LdapUserNotFoundException);
  }
}
