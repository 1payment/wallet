//@flow

'use strict';

const chalk = require('chalk');
const fs = require('fs');

function replaceKeyword(content) {
    content = content.split(/compile\s/).join('implementation ');
    content = content.split('compile("').join('implementation("');
    content = content.split('compile(').join('implementation(');
    content = content.split(/androidTestCompile\s/).join('androidTestImplementation ');
    content = content.split(/testCompile\s/).join('testImplementation ');
    content = content.split(/debugCompile\s/).join('debugImplementation ');
    content = content.split(/testApi\s/).join('testImplementation ');
    content = content.split(/provided\s/).join('compileOnly ');
    return content;
}

function processGradle() {
    console.log(chalk.green.bold('####################################'));
    console.log(
        chalk.green.bold('#') +
        chalk.black.bold(' Upgrade All Android build.gradle ') +
        chalk.green.bold('#')
    );
    console.log(chalk.green.bold('####################################\n'));
    if (!fs.existsSync('./node_modules')) {
        console.log(chalk.red.bold('node_modules directory does not exists'));
        return;
    }
    const dirs = fs.readdirSync('./node_modules');
    const subDirs = [];
    dirs.forEach(dir => {
        let exists = fs.existsSync(`./node_modules/${dir}/android/build.gradle`);
        if (exists) {
            subDirs.push(`./node_modules/${dir}/android/build.gradle`);
        }
        exists = fs.existsSync(`./node_modules/${dir}/ReactAndroid/build.gradle`);
        if (exists) {
            subDirs.push(`./node_modules/${dir}/ReactAndroid/build.gradle`);
        }
        exists = fs.existsSync(`./node_modules/${dir}/src/android/build.gradle`);
        if (exists) {
            subDirs.push(`./node_modules/${dir}/src/android/build.gradle`);
        }
        exists = fs.existsSync(`./node_modules/${dir}/lib/android/build.gradle`);
        if (exists) {
            subDirs.push(`./node_modules/${dir}/lib/android/build.gradle`);
        }
        exists = fs.existsSync(`./node_modules/${dir}/android/app/build.gradle`);
        if (exists) {
            subDirs.push(`./node_modules/${dir}/android/app/build.gradle`);
        }
    });
    subDirs.forEach(gradle => {
        fs.writeFileSync(gradle, replaceKeyword(fs.readFileSync(gradle).toString()));
        console.log(chalk.green.bold('Processed file: ') + chalk.black.italic(gradle));
    });
}
processGradle();