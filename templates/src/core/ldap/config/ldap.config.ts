import type { ClientOptions } from 'ldapjs';

import { registerAs } from '@nestjs/config';

export default registerAs('ldap-config', () => ({
  ldapAppUser: process.env.LDAP_APP_USER,
  ldapAppPswd: process.env.LDAP_APP_PSWD,
  ldapOptions: JSON.parse(process.env.LDAP_OPTIONS) as ClientOptions,
  ldapUsersBase: process.env.LDAP_USERS_BASE,
}));
