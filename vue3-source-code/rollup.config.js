// rollup配置

import path, { format } from 'path'
import json from '@rollup/plugin-json' // json处理
import resolvePlugin from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'

// 根据环境变量中的target属性，获取对应模块中的package.json
const packagesDir = path.resolve(__dirname, 'packages') //找到packages

// 打包的基准目录 
const packageDic = path.resolve(packagesDir, process.env.TARGET) // 找到要打包的某个包

// 永远针对是某个模块
const resolve = (p) => path.resolve(packageDic,  p)

const pkg = require(resolve('package.json'))
const name = path.basename(packageDic) // 取文件名

// 对打包类型，先做一个映射表，根据你提供的formats，来格式化需要打包的内容
const outputConfig = { // 自定义的, rollup需要使用的 
  'esm-bundler': { // es6
    file: resolve(`dist/${name}.esm-bundler.js `),
    format: 'es'
  },
  'cjs': { // node
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  'global': { // 全局的
    file: resolve(`dist/${name}.global.js`),
    format: 'iife' // 立即执行函数
  }
}

const options = pkg.buildOptions

function createConfig(format, output) {
  output.name = options.name
  output.sourcemap = true // 生成sourcemap

  // 生成rollup配置
  return {
    input: resolve(`src/index.ts`),
    output,
    plugin: [
      json(),
      ts({ // ts插件
        tsconfig: path.relative(__dirname, 'tsconfig.json')
      }),
      resolvePlugin() // 解析第三方模块
    ]
  }
}

// rollup最终需要导出配置 
export default options.formats.map(format => createConfig(format, outputConfig[format]))