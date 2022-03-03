import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import ldapConfig from './config/ldap.config';
import { LdapService } from './ldap.service';

@Module({
  imports: [ConfigModule.forFeature(ldapConfig)],
  providers: [LdapService],
  exports: [LdapService],
})
export class LdapModule {}
