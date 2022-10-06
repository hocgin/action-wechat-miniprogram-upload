# action-wechat-miniprogram-upload

> 微信项目自动发布(小程序/小游戏/游戏插件/小程序插件)

#### 1. 如何申请微信小程序或小游戏开发者发布的密钥

微信配置页面路径: 开发/开发者管理/开发设置/小程序代码上传/小程序代码上传密钥

**输入**

| 参数          | 是否必须   | 描述          | 默认值         |
|---------|--------|-------------|-------------|
| upload_key  | 必须     | 私钥文件内容      | -           |
| workspace   | 必须     |上传的代码目录                                                           | ./          |
| action_type | 必须     |作业类型: upload / preview                                            | upload      |
| type        | 必须     |项目类型: miniProgram / miniGame / miniProgramPlugin / miniGamePlugin | miniProgram |
| version        | 必须     |发布版本号                                                             | v1.0.0      |
| env        | 非必须    |发布环境                                                                 | -           |
| description        |非必须    | 发布简介   | -           |
| preview_pagepath        | 非必须    |预览页面路径 | -           |
| preview_pagequery        | 非必须    |预览页面参数 | -           |

**输出**

|参数| 是否必须 | 描述                   |默认值|
|---|---|----------------------|---|
|preview_qrcode| 非必须 | 仅预览模式有值，预览二维码的base64 |-|
