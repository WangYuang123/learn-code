// 只针对具体的某个包打包

const fs = require('fs')
const execa = require('execa') // 开启子进程，进行打包，最终还是使用rollup进行打包

const target = 'reactivity'
build(target)
 
// 对目标进行依次打包，并行打包
async function build(target) {
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {stdio: 'inherit'}) // 当子进程打包的信息共享给父进程
}