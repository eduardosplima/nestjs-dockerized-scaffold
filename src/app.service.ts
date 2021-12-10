import { Command, Console } from 'nestjs-console';
import { basename, join } from 'path';

import { Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';

import { BuildEnvCommand } from './commands/impl/build-env.command';
import { CopyCommand } from './commands/impl/copy.command';
import { CreateNestAppCommand } from './commands/impl/create-nest-app.command';
import { CreateTmpDirCommand } from './commands/impl/create-tmp-dir.command';
import { ExecNpmCliCommand } from './commands/impl/exec-npm-cli.command';
import { MergeJsonsCommand } from './commands/impl/merge-jsons.command';
import { RemoveCommand } from './commands/impl/remove.command';
import { SrcUncommentCommand } from './commands/impl/src-uncomment.command';
import { WriteCommand } from './commands/impl/write.command';
import appConfig from './config/app.config';
import { DatabaseTypeEnum } from './enums/database-type.enum';
import { NpmCliCmdEnum } from './enums/npm-cli-cmd.enum';
import type { EnvConfig } from './interfaces/env-config';
import type { NewProjectOptions } from './interfaces/new-project-options';

@Console()
export class AppService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
    private readonly commandBus: CommandBus,
  ) {}

  @Command({
    command: 'new-project <name>',
    description: 'Create a new project',
    options: [
      {
        flags: '-d, --description <description>',
        description: 'Project description',
        required: false,
      },
      {
        flags: '-p, --port <port>',
        description: 'Port that will be expose to access API locally',
        required: false,
        defaultValue: '8080',
        fn: (value) => {
          const port = +value;
          if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new Error('Invalid port');
          }
          return port;
        },
      },
      {
        flags: '-D, --debug-port <debug-port>',
        description: 'Port that will be expose to debug API locally',
        required: false,
        defaultValue: '9229',
        fn: (value) => {
          const debugPort = +value;
          if (
            !Number.isInteger(debugPort) ||
            debugPort < 1 ||
            debugPort > 65535
          ) {
            throw new Error('Invalid debug port');
          }
          return debugPort;
        },
      },
      {
        flags: '--setup-jwt',
        description: 'Indicative to use JWT guard template',
        required: false,
      },
      {
        flags: '--setup-database <mongodb|mssql|oracle|postgres>',
        description:
          'Indicative to use core module template to connect in desired database',
        required: false,
        fn: (value) => {
          if (!value) return null;

          const [, databaseType] =
            Object.entries(DatabaseTypeEnum).find((entry) => {
              const [, v] = entry;
              return v === value;
            }) || [];

          if (!databaseType) throw new Error('Invalid database type');
          return databaseType;
        },
      },
      {
        flags: '--setup-redis',
        description:
          'Indicative to use core module template to connect in redis',
        required: false,
      },
      {
        flags: '--setup-email',
        description: 'Indicative to use core module template to send e-mails',
        required: false,
      },
      {
        flags: '--setup-prometheus',
        description:
          'Indicative to use core module template to collect Prometheus metrics',
        required: false,
      },
      {
        flags: '--skip-database-container',
        description: 'Indicative to skip database container setup',
        required: false,
      },
      {
        flags: '--skip-redis-container',
        description: 'Indicative to skip redis container setup',
        required: false,
      },
      {
        flags: '--skip-email-container',
        description: 'Indicative to skip smtp4dev container setup',
        required: false,
      },
      {
        flags: '--skip-prometheus-container',
        description:
          'Indicative to skip prometheus and grafana container setup',
        required: false,
      },
    ],
  })
  async newProject(appName: string, options: NewProjectOptions): Promise<void> {
    const tmpDir: string = await this.commandBus.execute(
      new CreateTmpDirCommand(this.config.tmpdir_prefix),
    );
    const projectDir = join(tmpDir, appName);
    const templatesDir = join(__dirname, '..', 'templates');

    await this.commandBus.execute(new CreateNestAppCommand(tmpDir, appName));

    await this.updateNpmPackages(
      projectDir,
      options.setupJwt,
      options.setupDatabase,
      options.setupRedis,
      options.setupEmail,
      options.setupPrometheus,
    );

    await this.customizePackageJson(
      projectDir,
      templatesDir,
      options.description,
    );

    await this.customizeNestCliJson(projectDir, templatesDir);

    await this.customizeEslintConfig(projectDir, templatesDir);

    await this.customizePrettierrc(projectDir, templatesDir);

    await this.customizeTsConfig(projectDir, templatesDir);

    await this.createVscodeWorkspace(
      projectDir,
      templatesDir,
      options.debugPort,
    );

    await this.createDockerEnvironment(
      projectDir,
      templatesDir,
      options.skipDatabaseContainer ? null : options.setupDatabase,
      options.setupRedis && !options.skipRedisContainer,
      options.setupEmail && !options.skipEmailContainer,
      options.setupPrometheus && !options.skipPrometheusContainer,
    );

    await this.createEnvFile(
      projectDir,
      appName,
      options.port,
      options.debugPort,
      options.setupJwt,
      options.setupDatabase,
      options.skipDatabaseContainer,
      options.setupRedis,
      options.skipRedisContainer,
      options.setupEmail,
      options.skipEmailContainer,
      options.setupPrometheus,
      options.skipPrometheusContainer,
    );

    await this.assembleSrc(
      projectDir,
      templatesDir,
      options.setupJwt,
      options.setupDatabase,
      options.setupRedis,
      options.setupEmail,
      options.setupPrometheus,
    );

    await this.assembleTest(projectDir, templatesDir);

    // Prometheus + Grafana

    await this.lintProject(projectDir);
  }

  private async updateNpmPackages(
    projectDir: string,
    setupJwt: boolean,
    setupDatabase: DatabaseTypeEnum,
    setupRedis: boolean,
    setupEmail: boolean,
    setupPrometheus: boolean,
  ): Promise<void> {
    const [...installPackages] = this.config.commom.npm.install;
    const [...installDevPackages] = this.config.commom.npm.install_dev;
    const [...uninstallPackages] = this.config.commom.npm.uninstall;

    if (setupJwt) {
      if (this.config.jwt.npm.install) {
        installPackages.push(...this.config.jwt.npm.install);
      }
      if (this.config.jwt.npm.install_dev) {
        installDevPackages.push(...this.config.jwt.npm.install_dev);
      }
    }
    if (setupDatabase) {
      const dbConfig = this.config.database[setupDatabase];
      if (dbConfig.npm.install) {
        installPackages.push(...dbConfig.npm.install);
      }
      if (dbConfig.npm.install_dev) {
        installDevPackages.push(...dbConfig.npm.install_dev);
      }
    }
    if (setupRedis) {
      if (this.config.redis.npm.install) {
        installPackages.push(...this.config.redis.npm.install);
      }
      if (this.config.redis.npm.install_dev) {
        installDevPackages.push(...this.config.redis.npm.install_dev);
      }
    }
    if (setupEmail) {
      if (this.config.email.npm.install) {
        installPackages.push(...this.config.email.npm.install);
      }
      if (this.config.email.npm.install_dev) {
        installDevPackages.push(...this.config.email.npm.install_dev);
      }
    }
    if (setupPrometheus) {
      if (this.config.prometheus.npm.install) {
        installPackages.push(...this.config.prometheus.npm.install);
      }
      if (this.config.prometheus.npm.install_dev) {
        installDevPackages.push(...this.config.prometheus.npm.install_dev);
      }
    }

    if (uninstallPackages.length > 0) {
      await this.commandBus.execute(
        new ExecNpmCliCommand(
          projectDir,
          NpmCliCmdEnum.UNINSTALL,
          'Uninstalling unnecessary packages',
          uninstallPackages,
        ),
      );
    }
    if (installPackages.length > 0) {
      await this.commandBus.execute(
        new ExecNpmCliCommand(
          projectDir,
          NpmCliCmdEnum.INSTALL,
          'Installing new packages',
          installPackages,
        ),
      );
    }
    if (installDevPackages.length > 0) {
      await this.commandBus.execute(
        new ExecNpmCliCommand(
          projectDir,
          NpmCliCmdEnum.INSTALL_DEV,
          'Installing new dev packages',
          installDevPackages,
        ),
      );
    }
  }

  private async customizePackageJson(
    projectDir: string,
    templatesDir: string,
    description?: string,
  ): Promise<void> {
    const src = join(templatesDir, 'package.json');
    const dst = join(projectDir, 'package.json');

    const data: Record<string, unknown> = await this.commandBus.execute(
      new MergeJsonsCommand(
        [src, { description: description || '' }],
        dst,
        'Customizing package.json',
      ),
    );

    return this.commandBus.execute(new WriteCommand(data, dst));
  }

  private async customizeNestCliJson(
    projectDir: string,
    templatesDir: string,
  ): Promise<void> {
    const src = join(templatesDir, 'nest-cli.json');
    const dst = join(projectDir, 'nest-cli.json');

    const data: Record<string, unknown> = await this.commandBus.execute(
      new MergeJsonsCommand([src], dst, 'Customizing nest-cli.json'),
    );

    return this.commandBus.execute(new WriteCommand(data, dst));
  }

  private async customizeEslintConfig(
    projectDir: string,
    templatesDir: string,
  ): Promise<void> {
    let src: string;
    let dst: string;

    src = join(templatesDir, '.eslintrc.js');
    dst = join(projectDir, '.eslintrc.js');
    await this.commandBus.execute(new CopyCommand(src, dst));

    src = join(templatesDir, '.eslintignore');
    dst = join(projectDir, '.eslintignore');
    return this.commandBus.execute(new CopyCommand(src, dst));
  }

  private async customizePrettierrc(
    projectDir: string,
    templatesDir: string,
  ): Promise<void> {
    const src = join(templatesDir, '.prettierrc');
    const dst = join(projectDir, '.prettierrc');

    return this.commandBus.execute(new CopyCommand(src, dst));
  }

  private async customizeTsConfig(
    projectDir: string,
    templatesDir: string,
  ): Promise<void> {
    let src: string;
    let dst: string;

    src = join(templatesDir, 'tsconfig.json');
    dst = join(projectDir, 'tsconfig.json');
    await this.commandBus.execute(new CopyCommand(src, dst));

    src = join(templatesDir, 'tsconfig.build.json');
    dst = join(projectDir, 'tsconfig.build.json');
    await this.commandBus.execute(new CopyCommand(src, dst));

    src = join(templatesDir, 'tsconfig.build-prod.json');
    dst = join(projectDir, 'tsconfig.build-prod.json');
    await this.commandBus.execute(new CopyCommand(src, dst));
  }

  private async createVscodeWorkspace(
    projectDir: string,
    templatesDir: string,
    debugPort: number,
  ): Promise<void> {
    const src = join(templatesDir, '.vscode');
    const dst = join(projectDir, '.vscode');

    await this.commandBus.execute(new CopyCommand(src, dst));

    const file = join(dst, 'launch.json');
    const data: Record<string, unknown> = await this.commandBus.execute(
      new MergeJsonsCommand(
        [
          {
            configurations: [{ port: debugPort }],
          },
        ],
        file,
        'Adjusting debug port in launch.json',
      ),
    );

    return this.commandBus.execute(new WriteCommand(data, file));
  }

  private async createDockerEnvironment(
    projectDir: string,
    templatesDir: string,
    setupDatabase: DatabaseTypeEnum,
    setupRedis: boolean,
    setupEmail: boolean,
    setupPrometheus: boolean,
  ): Promise<void> {
    // Dockerfile
    const dbConfig = this.config.database[setupDatabase];
    const src = join(templatesDir, dbConfig?.docker.dockerfile || 'Dockerfile');
    const dst = join(projectDir, 'Dockerfile');
    await this.commandBus.execute(new CopyCommand(src, dst));

    // docker-compose.yml
    const composeFragments: Array<Record<string, unknown>> = [];
    const dependsOn: Array<string> = [];

    if (dbConfig?.docker.compose) {
      composeFragments.push(dbConfig.docker.compose);
      dependsOn.push(...Object.keys(dbConfig.docker.compose.services));
    }
    if (setupRedis && this.config.redis.docker_compose) {
      composeFragments.push(this.config.redis.docker_compose);
      dependsOn.push(...Object.keys(this.config.redis.docker_compose.services));
    }
    if (setupEmail && this.config.email.docker_compose) {
      composeFragments.push(this.config.email.docker_compose);
      dependsOn.push(...Object.keys(this.config.email.docker_compose.services));
    }
    if (setupPrometheus && this.config.prometheus.docker_compose) {
      composeFragments.push(this.config.prometheus.docker_compose);
      dependsOn.push(
        ...Object.keys(this.config.prometheus.docker_compose.services),
      );
    }
    if (dependsOn.length > 0) {
      const composeMainService = Object.keys(
        this.config.commom.docker_compose.services,
      )[0];
      const composeDependsOnFragment = {
        services: {
          [composeMainService]: {
            depends_on: dependsOn,
          },
        },
      };
      composeFragments.push(composeDependsOnFragment);
    }

    const data = await this.commandBus.execute(
      new MergeJsonsCommand(
        composeFragments,
        this.config.commom.docker_compose,
        'Building docker-compose.yml',
      ),
    );
    return this.commandBus.execute(
      new WriteCommand(data, join(projectDir, 'docker-compose.yml')),
    );
  }

  private async createEnvFile(
    projectDir: string,
    appName: string,
    port: number,
    debugPort: number,
    setupJwt: boolean,
    setupDatabase: DatabaseTypeEnum,
    skipDatabaseContainer: boolean,
    setupRedis: boolean,
    skipRedisContainer: boolean,
    setupEmail: boolean,
    skipEmailContainer: boolean,
    setupPrometheus: boolean,
    skipPrometheusContainer: boolean,
  ): Promise<void> {
    const dbConfig = this.config.database[setupDatabase];
    const envFragments: Map<string, EnvConfig> = new Map();

    const populateEnvFragments = (
      envFile: { [K in string]: EnvConfig },
      useDockerValues: boolean,
    ): void => {
      Object.keys(envFile).forEach((key) => {
        const envConfig = envFile[key];
        if (useDockerValues && envConfig.valueIfContainer) {
          envConfig.value = envConfig.valueIfContainer;
        }
        envFragments.set(key, envConfig);
      });
    };

    populateEnvFragments(this.config.commom.env_file, false);

    if (setupJwt) {
      populateEnvFragments(this.config.jwt.env_file, false);
    }
    if (dbConfig) {
      populateEnvFragments(dbConfig.env_file, !skipDatabaseContainer);
    }
    if (setupRedis) {
      populateEnvFragments(this.config.redis.env_file, !skipRedisContainer);
    }
    if (setupEmail) {
      populateEnvFragments(this.config.email.env_file, !skipEmailContainer);
    }
    if (setupPrometheus) {
      populateEnvFragments(
        this.config.email.env_file,
        !skipPrometheusContainer,
      );
    }

    // Customize application
    envFragments.get('APP_NAME').value = appName;
    envFragments.get('APP_PORT').value = port;
    envFragments.get('APP_PORT_DEBUG').value = debugPort;

    const data = await this.commandBus.execute(
      new BuildEnvCommand(envFragments),
    );

    return this.commandBus.execute(
      new WriteCommand(data, join(projectDir, '.env')),
    );
  }

  private async assembleSrc(
    projectDir: string,
    templatesDir: string,
    setupJwt: boolean,
    setupDatabase: DatabaseTypeEnum,
    setupRedis: boolean,
    setupEmail: boolean,
    setupPrometheus: boolean,
  ): Promise<void> {
    const srcTemplatesDir = join(templatesDir, 'src');
    const srcProjectDir = join(projectDir, 'src');

    await this.commandBus.execute(new RemoveCommand(srcProjectDir));

    let setupTypeOrm = false;
    let setupMongoose = false;
    if (setupDatabase) {
      setupTypeOrm = setupDatabase !== DatabaseTypeEnum.MONGODB;
      setupMongoose = !setupTypeOrm;
    }

    const filter: ConstructorParameters<typeof CopyCommand>['2'] = (
      src,
      dest,
    ) => {
      if (!setupJwt && basename(dest) === 'auth') return false;
      if (!setupTypeOrm && basename(dest) === 'db') return false;
      if (!setupMongoose && basename(dest) === 'mongodb') return false;
      if (!setupRedis && basename(dest) === 'redis') return false;
      if (!setupEmail && basename(dest) === 'email') return false;
      if (!setupPrometheus && basename(dest) === 'metrics') return false;
      return true;
    };

    await this.commandBus.execute(
      new CopyCommand(srcTemplatesDir, srcProjectDir, filter),
    );

    const dbConfig = this.config.database[setupDatabase];
    const srcUncommentConfigList: Array<Record<string, unknown>> = [];
    if (setupJwt) {
      srcUncommentConfigList.push(this.config.jwt.src_uncomment);
    }
    if (dbConfig) {
      srcUncommentConfigList.push(dbConfig.src_uncomment);
    }
    if (setupRedis) {
      srcUncommentConfigList.push(this.config.redis.src_uncomment);
    }
    if (setupEmail) {
      srcUncommentConfigList.push(this.config.email.src_uncomment);
    }
    if (setupPrometheus) {
      srcUncommentConfigList.push(this.config.prometheus.src_uncomment);
    }

    if (srcUncommentConfigList.length > 0) {
      const srcUncommentConfig = await this.commandBus.execute(
        new MergeJsonsCommand(
          srcUncommentConfigList,
          {},
          'Processing customizations in src folder',
        ),
      );
      await this.commandBus.execute(
        new SrcUncommentCommand(srcProjectDir, srcUncommentConfig),
      );
    }
  }

  private async assembleTest(
    projectDir: string,
    templatesDir: string,
  ): Promise<void> {
    const testTemplatesDir = join(templatesDir, 'test');
    const testProjectDir = join(projectDir, 'test');

    await this.commandBus.execute(new RemoveCommand(testProjectDir));

    return this.commandBus.execute(
      new CopyCommand(testTemplatesDir, testProjectDir),
    );
  }

  async lintProject(projectDir: string): Promise<void> {
    return this.commandBus.execute(
      new ExecNpmCliCommand(projectDir, NpmCliCmdEnum.RUN, 'Lint project', [
        'lint',
      ]),
    );
  }
}
