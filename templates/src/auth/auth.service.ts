import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import authConfig from './config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}

  // TODO: Implementar lógica de login
  async signIn(): Promise<{ token: string }> {
    const payload = {};
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.config.expiresIn,
    });
    return { token };
  }
}
