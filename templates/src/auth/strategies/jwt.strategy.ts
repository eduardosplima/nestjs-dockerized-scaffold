import type { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import authConfig from '../config/auth.config';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    config: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: FastifyRequest, payload: JwtPayload): Promise<unknown> {
    // TODO: Implementar lógica de validação (caso exista)
    // TODO: Retornar os dados de usuário que serão adicionados ao request (req.user)
    return { id: payload.sub };
  }
}
