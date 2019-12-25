const download = require('download-git-repo')
const ora = require('ora')
const path =require('path')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    const spinner = ora(`正在下载项目模板，源地址${target}`)
    spinner.start()
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    download('https://github.com:tengrenli/template#master',
        target, { clone: true }, (err) => {
      if (err) {
          spinner.fail()
        reject(err)
      } else {
        spinner.succeed()
        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
        resolve(target)
      }
    })
  })
}