# wechatycloud [![Powered by Wechaty](./1.svg)](https://github.com/chatie/wechaty) [![Wechaty开源激励计划](./2.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

在线编辑，沙盒运行，无需重启。计划打造成插件平台。

## 说明

默认的插件，是一个echo回复机器人，代码在msg.sandbox.js里。web提供一个按钮，用于在线启动，停止。

web提供一个在线编辑器，可编辑 msg.sandbox.js 文件。保存后，即可生效，无需重新启动wechaty。

## 运行环境

1、linux操作系统，我的是 Linux Mint 19.3

2、node环境，我的node 版本是：10.19.0

3、开启redis服务

## 安装

```
git clone https://github.com/wechatycloud/demo.git
cd demo
npm install
```

## 配置

文件 conf.yml

把 your_puppet_padplus_token 替换成你的token
```
token: your_puppet_padplus_token
port: 3000
botname: wechaty
```

## 启动
```
npm start
```

## 体验

打开浏览器，输入:

http://你的服务器ip:3000
