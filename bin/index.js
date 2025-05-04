#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// To handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program.version('1.0.0').description('Create a boilerplate Node.js API');

program
    .argument('<project-name>', 'Name of your project')
    .action(async (projectName) => {
        const projectPath = path.join(process.cwd(), projectName);

        // Check if the project already exists
        if (fs.existsSync(projectPath)) {
            console.log(chalk.red('❌ Project folder already exists.'));
            process.exit(1);
        }

        // Copy template folder to the project path
        console.log(chalk.green('🔧 Creating project...'));
        await fs.copy(path.join(__dirname, '../template'), projectPath);

        // Modify package.json name
        const pkgPath = path.join(projectPath, 'package.json');
        const pkg = await fs.readJson(pkgPath);
        pkg.name = projectName;
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });

        // Install dependencies
        console.log(chalk.yellow('📦 Installing dependencies...'));
        await execa('npm', ['install'], { cwd: projectPath, stdio: 'inherit' });

        // Success message
        console.log(chalk.green(`🎉 Project "${projectName}" created successfully!`));
        console.log(chalk.cyan(`👉 cd ${projectName} && npm run dev`));
    });

program.parse(process.argv);
