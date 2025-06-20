import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import autoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import StylelintPlugin from 'vite-plugin-stylelint'
import postcssPresetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const base = env.VITE_BASE
  const shouldAnalyze = env.VITE_ANALYSIS === 'true' // 检查是否启用了分析模式

  const plugins = [
    vue(),
    autoImport({
      imports: ['vue', 'vue-router', 'pinia'], // 需要引入的类型来源
      dts: 'src/types/auto-import.d.ts', // 根据引入来源自动生成的类型声明文件路径
      eslintrc: {
        enabled: true, // 使用 eslint 配置
      },
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    eslint(),
    StylelintPlugin(),
    obfuscatorPlugin({
      include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.js'],
      exclude: [/node_modules/],
      apply: 'build',
      debugger: true,
      options: {
        compact: false, // 混淆后的代码将移除所有额外的空格、换行符和注释，从而减小文件大小。
        identifierNamesGenerator: 'hexadecimal', // 'hexadecimal': 生成十六进制的标识符，例如 _0xabc123。'mangled': 生成短而不易读的、基于字母的标识符，例如 a, b, c。'mangled-shuffled': 与 mangled 类似，但会随机打乱生成的标识符，使其更难以推断。
        numbersToExpressions: true, //如果设置为 true，会将数字字面量转换为复杂的表达式，例如 1 可能会变成 (!![] + !![]) / (!![] + !![])。这增加了代码的复杂性。
        //启用控制流平坦化。它会重构函数的控制流（例如 if/else, for, while, switch 语句），
        // 将其转换为一个复杂的 while 循环和一个大的 switch 语句，或者三元表达式利用三元表达式和函数调用链来重构条件分支和循环逻辑。
        // 使得代码的执行路径变得非常复杂和难以追踪。
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75, //此属性控制有多少比例的函数会应用控制流平坦化。
        deadCodeInjection: true, //会在代码中注入“死代码”（永远不会执行的代码）。这些死代码旨在迷惑逆向工程师，增加他们理解真正逻辑的难度。
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true, //如果设置为 true，启用调试保护。当检测到开发者工具（如 Chrome DevTools）被打开时，代码会进入无限循环、重新加载页面或执行其他操作，以阻止调试。
        debugProtectionInterval: 0, //此属性指定调试保护检查的间隔时间（毫秒）0 表示在每个函数执行时进行检查，更大的值表示更长的检查间隔。
        disableConsoleOutput: true, //如果设置为 true，会禁用 console.log, console.info, console.warn,
        log: true,
        optionsPreset: 'default',
        renameGlobals: false, //如果设置为 true，会尝试混淆全局变量名。慎用！混淆全局变量名可能与第三方库、浏览器全局对象或环境上下文发生冲突，导致应用程序崩溃。
        selfDefending: false, //如果设置为 true，会向混淆后的代码中添加额外的自卫代码。如果有人尝试格式化或篡改混淆后的代码，代码可能会损坏或无法执行。这使得代码难以被直接美化或手动分析。
        splitStrings: true, //如果设置为 true，会将字符串常量拆分为多个字符。
        splitStringsChunkLength: 10,
        stringArrayThreshold: 0.75,
        transformObjectKeys: false, //如果设置为 true，会混淆对象字面量中的键名（属性名），但前提是这些键名是字符串字面量并且不是通过计算得出的。
        unicodeEscapeSequence: false, //如果设置为 true，会将所有字符串字面量和标识符（如果适用）中的非 ASCII 字符转换为 Unicode 转义序列（例如 \u0061 代表 a）。这使得代码更加难以阅读，因为所有可读的字符都被替换为转义序列。
      },
    }),
  ]
  if (shouldAnalyze) {
    plugins.push(
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: 'analysis.html', //分析图生成的文件名
        open: true, //如果存在本地服务端口，将在打包后自动展示
      }),
    )
  }
  return {
    base,
    plugins,
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      // 配置跨域
      // cors: {
      //   origin: 'http://localhost:3000', // 明确指定允许的来源
      //   credentials: true, // 允许凭据
      // },
      // 配置代理
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:8001',
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/api/, ''),
      //   },
      // },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 定义全局的scss变量
          // 给导入的路径最后加上 ;
          additionalData: `@import '@/common/style/vars.scss';`,
        },
      },
      postcss: {
        plugins: [tailwindcss, autoprefixer, postcssPresetEnv()],
      },
    },
  }
})
