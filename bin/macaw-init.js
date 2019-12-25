#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const download = require('./download')

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
console.log('list:::', list)
let rootName = path.basename(process.cwd())
// console.log(process.cwd()) // /Users/tengrenli/Desktop/code/my_github/test
// console.log(rootName)  test
// process.cwd 返回当前进程的工作目录
// path.basename(p[, ext])	返回路径中的最后一部分。同 Unix 命令 bashname 类似。
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
  rootName = projectName
} else if (rootName === projectName) { // 根目录与用于输入的名称相同
    rootName = ''
} else {
    rootName = projectName
}

go()
function go () {
  // 预留
  console.log(path.resolve(process.cwd(), rootName))
  download(rootName).then(res => {
    console.log('成功:::',res)
  }).catch(err => {
    console.log('error:::', err)
  })
}
