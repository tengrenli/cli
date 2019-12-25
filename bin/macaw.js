// #!/usr/bin/env node

const program = require('commander')
// console.log(process)
program.version('0.1.0','-v, --version', 'output the current ')
// 你可以自定义标识，通过给version方法再传递一个参数，语法与option方法一致。版本标识名字可以是任意的，但是必须要有长名字。
    .name('my-command') // 这两个选项让你可以自定义在帮助信息第一行中显示的命令使用描述(description)，并且描述是从（完整的）命令参数中推导出来的
	.usage('<command> [项目名称]')  // 帮助信息会以此开头： Usage: my-command <command> [项目名称]
	.command('init', '这里是项目名称')
    .parse(process.argv);
// program
//  .option('-d, --debug', 'output extra debugging')
//  .option('-s, --small', 'small pizza size')
//  .option('-p, --my-type <type>', 'flavour of pizza');

// program.parse(process.argv);
// console.log(JSON.stringify(program, null ,4))
// if (program.debug) console.log(program.opts());
// console.log('pizza details:');
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);
    


