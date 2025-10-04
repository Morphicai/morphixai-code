#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from '../src/commands/create.js';
import { devCommand } from '../src/commands/dev.js';
import { buildCommand } from '../src/commands/build.js';
import { promptsCommand } from '../src/commands/prompts.js';
import { templateCommand } from '../src/commands/template.js';

const program = new Command();

program
  .name('morphixai')
  .description('MorphixAI Code CLI - Create and manage MorphixAI applications')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new MorphixAI application')
  .argument('[project-name]', 'Project name')
  .option('-t, --template <template>', 'Template to use', 'react-ionic')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(createCommand);

program
  .command('dev')
  .description('Start development server with embedded console')
  .option('-p, --port <port>', 'Port number', '8812')
  .option('--console-path <path>', 'Console path', '/__console')
  .option('--debug', 'Enable debug mode')
  .action(devCommand);

program
  .command('build')
  .description('Build the application for production')
  .option('-o, --outDir <dir>', 'Output directory', 'dist')
  .option('--sourcemap', 'Generate source maps')
  .action(buildCommand);

const promptsCmd = program
  .command('prompts')
  .description('Manage AI prompts');

promptsCmd
  .command('check')
  .description('Check prompts version')
  .action(() => promptsCommand('check'));

promptsCmd
  .command('update')
  .description('Update prompts to latest version')
  .action(() => promptsCommand('update'));

promptsCmd
  .command('install')
  .description('Install prompts for specific editor')
  .argument('[editor]', 'Editor type (cursor, claude)', 'all')
  .action((editor) => promptsCommand('install', { editor }));

const templateCmd = program
  .command('template')
  .description('Manage project templates');

templateCmd
  .command('list')
  .description('List available templates')
  .action(() => templateCommand('list'));

templateCmd
  .command('clear-cache')
  .description('Clear template cache')
  .action(() => templateCommand('clear-cache'));

templateCmd
  .command('update')
  .description('Update template cache')
  .action(() => templateCommand('update'));

program.parse();