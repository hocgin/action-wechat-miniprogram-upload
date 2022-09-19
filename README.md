# action-starter

## 如何使用

1. 编写 action.yml
    - `name` action 的名称
    - `author` 作者
    - `description` 描述 github action 的作用
    - `inputs` 定义需要的输入参数
    - `outputs` 定义产生的输出参数

2. 编写主流程 `src/core.ts
3. 编写测试代码 `src/core.test.ts`
4. 运行`yarn build`生成 action 代码

- **备注** 默认主分支推送的时候会自动编译重新生成 dist/, 推送后直接发布版本即可。
- **可选** 如果需要在本地测试 Github Action 可以参考 [nektos/act](https://github.com/nektos/act) 项目, Github
  官方提供了 [actions/toolkit](https://github.com/actions/toolkit) 工具。

### 参考文档

- [github api sample](https://gist.github.com/queq1890/125e74e1fa33397d2508a6ca4badac83)

## 一些 Github 目录

| 链接   | 用途                                           |
|------|----------------------------------------------|
| [hocgin/action-env](https://github.com/hocgin/action-env) | 根据运行的分支获取部署的目标环境及项目参数                        |
| [hocgin/action-qiniu-upload](https://github.com/hocgin/action-qiniu-upload) | 用于上传资源文件到七牛 CDN                              |
| [hocgin/action-use-template](https://github.com/hocgin/action-use-template) | 在使用 `use template repository` 时候，替换模版仓库里面的变量 |
