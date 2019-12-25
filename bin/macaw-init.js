#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const download = require('../lib/download')
const inquirer = require('inquirer')
const generator = require('../lib/generator')
// 这个模块可以获取node包的最新版本
const latestVersion = require('latest-version')  // npm i latest-version -D

program.usage('<project-name>').parse(process.argv)

// 根据输入获取项目名称
let projectName = program.args[0]
// 判断是否输入了项目名称
if (!projectName) {
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help()
  return
}
const list = glob.sync('*') //遍历当前目录

let rootName = path.basename(process.cwd())
// console.log(process.cwd()) // /Users/tengrenli/Desktop/code/my_github/test
// console.log(rootName)  test
// process.cwd 返回当前进程的工作目录
// path.basename(p[, ext])	返回路径中的最后一部分。同 Unix 命令 bashname 类似。
let next = undefined

if (list.length) {
  // 遍历当前目录
  const arr = list.filter(name => {
    const fileName = path.resolve(process.cwd(), name)
    const isDir = fs.statSync(fileName).isDirectory()
    return name.indexOf(projectName) !== -1 && isDir
  })
  if (arr.length !== 0) {
    console.log(`项目${projectName}已经存在`)
    return
  }
  next = Promise.resolve(projectName)
} else if (rootName === projectName) { // 根目录与用于输入的名称相同
    next = inquirer.prompt([
      {
        name: 'buildIncurrent',
        message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
        type: 'confirm',
        default: true
      }
    ]).then(answer => {
      return Promise.resolve(answer.buildIncurrent ? '.' : projectName)
    })
} else {
    next = Promise.resolve(projectName)
}

next && go()
function go () {
  // 预留
  next.then(projectRoot => {
    if (projectRoot !== '.') {
      fs.mkdirSync(projectRoot)
    }
    return download(projectRoot).then(res => {
      console.log('成功:::',res)
      return {
        name: projectRoot,
        root: projectRoot,
        target: res
      }
    }).catch(err => {
      console.log('error:::', err)
    })
  }).then(context => {
    return inquirer.prompt([
      {
        name: 'projectName',
    	  message: '项目的名称',
        default: context.name
      }, {
        name: 'projectVersion',
        message: '项目的版本号',
        default: '1.0.0'
      }, {
        name: 'projectDescription',
        message: '项目的简介',
        default: `A project named ${context.name}`
      }
    ]).then(answers => {
      return latestVersion('macaw-ui').then(version => {
        answers.supportUiVersion = version
        return {
          ...context,
          metadata: {
            ...answers
          }
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    })
  }).then(context => {
    console.log(context)
    return generator(context.metadata, context.target, path.parse(context.target).dir);
  }).catch(err => {
    console.error(err)
  })
}
