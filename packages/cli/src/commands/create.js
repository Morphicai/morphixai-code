import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { generateProjectId } from '../utils/project-id.js';
import { copyTemplate } from '../utils/template.js';
import { installPrompts } from '../prompts/installer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createCommand(projectName, options) {
  try {
    const { template = 'react-ionic', yes } = options;
    
    // 如果没有提供项目名，询问用户
    if (!projectName) {
      const answers = await inquirer.prompt([{
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        validate: (input) => input.trim() ? true : 'Project name is required'
      }]);
      projectName = answers.projectName;
    }
    
    const projectPath = path.join(process.cwd(), projectName);
    
    // 检查目录是否已存在
    if (await fs.pathExists(projectPath)) {
      console.log(chalk.red(`Directory ${projectName} already exists!`));
      return;
    }
    
    console.log(chalk.blue(`Creating MorphixAI application: ${projectName}`));
    console.log(chalk.gray(`Template: ${template}`));
    
    // 创建项目目录
    const spinner = ora('Creating project directory...').start();
    await fs.ensureDir(projectPath);
    spinner.succeed('Project directory created');
    
    // 生成项目 ID
    spinner.start('Generating project ID...');
    const projectId = generateProjectId();
    
    // 复制模板
    spinner.start('Copying template files...');
    const templateInfo = await copyTemplate(template, projectPath, {
      PROJECT_NAME: projectName,
      PROJECT_ID: projectId
    });
    spinner.succeed('Template files copied');
    
    // 创建项目配置文件
    spinner.start('Setting up project configuration...');
    const projectConfig = {
      id: projectId,
      name: projectName,
      template: template,
      version: '1.0.0',
      createdAt: new Date().toISOString()
    };
    
    await fs.writeJson(path.join(projectPath, 'project-config.json'), projectConfig, { spaces: 2 });
    spinner.succeed('Project configuration complete');
    
    // 安装提示词（传递模板源路径）
    // 提示词安装是可选的增强功能，失败不会阻止项目创建
    spinner.start('Installing AI prompts...');
    try {
      await installPrompts(projectPath, { 
        templatePath: templateInfo?.templatePath 
      });
      spinner.succeed('AI prompts installed');
    } catch (error) {
      spinner.warn('AI prompts installation skipped (template files will be used)');
      console.log(`  ${chalk.gray('Reason:')} ${error.message}`);
    }
    
    // 询问是否安装依赖
    if (!yes) {
      const answers = await inquirer.prompt([{
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies?',
        default: true
      }]);
      
      if (answers.installDeps) {
        spinner.start('Installing dependencies...');
        await execa('npm', ['install'], { cwd: projectPath });
        spinner.succeed('Dependencies installed');
      }
    }
    
    console.log();
    console.log(chalk.green('✅ Project created successfully!'));
    console.log();
    console.log('Next steps:');
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan('  npm run dev'));
    console.log();
    console.log('Happy coding! 🚀');
    
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error.message);
    process.exit(1);
  }
}