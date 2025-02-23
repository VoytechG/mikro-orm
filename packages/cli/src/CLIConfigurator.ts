import type { Argv } from 'yargs';
import yargs from 'yargs';

import { ConfigurationLoader, Utils } from '@mikro-orm/core';
import { ClearCacheCommand } from './commands/ClearCacheCommand';
import { DatabaseSeedCommand } from './commands/DatabaseSeedCommand';
import { DebugCommand } from './commands/DebugCommand';
import { GenerateCacheCommand } from './commands/GenerateCacheCommand';
import { GenerateEntitiesCommand } from './commands/GenerateEntitiesCommand';
import { ImportCommand } from './commands/ImportCommand';
import { MigrationCommandFactory } from './commands/MigrationCommandFactory';
import { SchemaCommandFactory } from './commands/SchemaCommandFactory';
import { CreateSeederCommand } from './commands/CreateSeederCommand';
import { CreateDatabaseCommand } from './commands/CreateDatabaseCommand';

/**
 * @internal
 */
export class CLIConfigurator {

  static async configure(): Promise<Argv> {
    await ConfigurationLoader.checkPackageVersion();
    const settings = await ConfigurationLoader.getSettings();
    const version = Utils.getORMVersion();

    if (settings.useTsNode) {
      const tsNode = await ConfigurationLoader.registerTsNode(settings.tsConfigPath);

      /* istanbul ignore if */
      if (!tsNode) {
        process.env.MIKRO_ORM_CLI_USE_TS_NODE ??= '0';
      }
    }

    return yargs
      .scriptName('mikro-orm')
      .version(version)
      .usage('Usage: $0 <command> [options]')
      .example('$0 schema:update --run', 'Runs schema synchronization')
      .alias('v', 'version')
      .alias('h', 'help')
      .command(new ClearCacheCommand())
      .command(new GenerateCacheCommand())
      .command(new GenerateEntitiesCommand())
      .command(new CreateDatabaseCommand())
      .command(new ImportCommand())
      .command(new DatabaseSeedCommand())
      .command(new CreateSeederCommand())
      .command(SchemaCommandFactory.create('create'))
      .command(SchemaCommandFactory.create('drop'))
      .command(SchemaCommandFactory.create('update'))
      .command(SchemaCommandFactory.create('fresh'))
      .command(MigrationCommandFactory.create('create'))
      .command(MigrationCommandFactory.create('up'))
      .command(MigrationCommandFactory.create('down'))
      .command(MigrationCommandFactory.create('list'))
      .command(MigrationCommandFactory.create('pending'))
      .command(MigrationCommandFactory.create('fresh'))
      .command(new DebugCommand())
      .recommendCommands()
      .strict();
  }

}
