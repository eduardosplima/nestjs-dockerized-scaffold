import { createClient, InvalidCredentialsError } from 'ldapjs';
import type { Client } from 'ldapjs';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import ldapConfig from './config/ldap.config';
import { LdapUserInvalidPswdException } from './exceptions/ldap-user-invalid-pswd.exception';
import { LdapUserNotFoundException } from './exceptions/ldap-user-not-found.exception';

@Injectable()
export class LdapService {
  constructor(
    @Inject(ldapConfig.KEY)
    private readonly config: ConfigType<typeof ldapConfig>,
  ) {}

  private static async signIn(
    client: Client,
    dn: string,
    pswd: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      client.bind(dn, pswd, (err) => {
        if (err) {
          if (err instanceof InvalidCredentialsError) {
            reject(
              new LdapUserInvalidPswdException(`Invalid pswd for DN "${dn}"`),
            );
          } else {
            reject(err);
          }
        } else {
          resolve();
        }
      });
    });
  }

  private async findByAttribute<Type>(
    client: Client,
    findBy: string,
    value: string,
    fetchAttributes: Array<keyof Type>,
  ): Promise<Type> {
    return new Promise((resolve, reject) => {
      client.search(
        this.config.ldapUsersBase,
        {
          filter: `${findBy}=${value}`,
          scope: 'sub',
          attributes: fetchAttributes as string[],
        },
        (searchErr, response) => {
          if (searchErr) reject(searchErr);
          else {
            let user: Type;
            response
              .on('searchEntry', (entry) => {
                if (!user) user = entry.object as unknown as Type;
                else reject(new Error('Should be returned one unique user'));
              })
              .on('error', reject)
              .on('end', () => resolve(user));
          }
        },
      );
    });
  }

  async signInUser<Type>(
    findBy: string,
    value: string,
    pswd: string,
    fetchAttributes: Array<keyof Type>,
  ): Promise<Type> {
    const client = createClient(this.config.ldapOptions);

    // Admin login
    await LdapService.signIn(
      client,
      this.config.ldapAppUser,
      this.config.ldapAppPswd,
    );

    const user = await this.findByAttribute<Type & { dn: string }>(
      client,
      findBy,
      value,
      fetchAttributes,
    );
    if (!user)
      throw new LdapUserNotFoundException(
        `User "${findBy}=${value}" not found`,
      );

    // User login
    await LdapService.signIn(client, user.dn, pswd);

    return new Promise((resolve) => {
      client.unbind(() => resolve(user));
    });
  }
}
