import { PrometheusController } from '@willsoto/nestjs-prometheus';
import type { FastifyReply } from 'fastify';

import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class MetricsController extends PrometheusController {
  @ApiExcludeEndpoint(true)
  @Get()
  async index(@Res() reply: FastifyReply): Promise<string> {
    return super.index(reply);
  }
}
