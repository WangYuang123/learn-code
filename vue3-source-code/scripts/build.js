// 把packages目录下的所有包打包
const fs = require('fs')
const execa = require('execa') // 开启子进程，进行打包，最终还是使用rollup进行打包

const tagets = fs.readdirSync('packages').filter(f => {
    return fs.statSync(`packages/${f}`).isDirectory()
})
 
// 对目标进行依次打包，并行打包
async function build(target) {
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {stdio: 'inherit'}) // 当子进程打包的信息共享给父进程
}
function runParallel(targets, interatorFn) {
    const res = []
    for(const item of targets) {
        const p = interatorFn(item)
        res.push(p)
    }
    return Promise.all(res)

}
runParallel(tagets, build)