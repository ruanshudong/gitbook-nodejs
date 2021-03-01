# 代码说明

整体代码采用nodejs + vue + element-ui实现, 分两部分:
- 客户端部分: 客户端表示vue页面这部分, 在client目录下
- 服务器端部分: 服务器代码在src目录下

# 代码逻辑

服务器启动以后, 会定时git clone TarsDocs, 到client/markdown目录下, 注意服务器需要安装 git
web页面会实时解析markddown文件, 并转化成html

你可以用这个工程来解析其他的markdown文件!
# 如何调试

启动client:
- 进入client目录
- npm install
- npm run dev 

启动server:
- 源码目录: npm install
- npm run dev

访问: http://localhost:6001/ 即可

开发时修改任何代码, 服务器和客户端都会自动编译和更新.

# 源码如何发布

编译client
- 进入client目录
- npm run build
- 运行后, 生成所有client的页面和js等

编译server
- 由于server采用的typescript实现, 因此需要编译
- 在源码目录, npm run build

完成以上工作后, 代码都编译并准备好(这个也是提交到git的状态), 需要运行时, 采用pm来控制服务, 先安装pm:
```
npm install pm2
```

npm run prd

**注意默认开启的是6080端口!!(config/webConf.ts中修改)**

# Docker发布
可以编译成docker来发布
```sh
npm run docker
docker run -p 80:6080 -v /data/doc:/root/gitbook/client/markdown gitbook
```

# 关于搜索

搜索用到分词技术, 使用了一个nodejieba的库, 注意他底层是c++写的, 因此导致了这部分是无法跨平台的!

# 关于用户系统

默认是没有开启用户登录的, 如果开启用户登录, 则用户需要通过email注册和激活, 才能完成访问.
开启方式: 打开webConf.ts中的enableLogin

# 关于配置

你可以指定自己的git, 修改/config/webConf.ts即可(正式发布, 不要忘了npm run build)

