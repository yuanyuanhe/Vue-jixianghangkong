### 项目运行打包流程

    # 运行项目
    npm run dev               //运行项目（测试环境）

    [http://localhost:8090/passengers/applyList/applyList.html]


    # 生产打包
    npm run build             //打包项目（正式环境打包）
    npm run build-pre         //打包项目（预发布环境打包）
    npm run build-test        //打包项目（测试环境打包）
    npm run native            //打包使用原生的环境地址

### 前端开发自动化构建 

```bash
#项目结构
├── build
│   ├── build.js                # 打包入口
│   ├── utils.js                # 公共方法
│   ├── webpack.base.conf.js    # 公共配置
│   ├── webpack.dev.conf.js     # 开发配置
│   └── webpack.prod.conf.js    # 生产配置
│
├── config
│   ├── index.js            # config index settings port 8060
│   ├── dev.env.js          # dev 配置测试接口地址
│   └── prod.env.js         # prod 配置正式接口地址
│
├── src  # main folder
│   ├── common  # common assets folder
│   │   ├── config          # h5版本配置
│   │   └── deploy          # 接口、地址、localstorage路径处理
│   │   ├── imgs            # 公共图片
│   │   ├── logic           # 逻辑处理
│   │   └── styles          # 公共样式
│   │   └── tools           # 工具类
│   ├── components          # Vue全局组件
│   ├── layout              # 全局模板
│   └── pages  # 模块
│       ├── passengers      # 模块
│       │   ├── applyList       # 页面
│       │   │   ├── index.js    # 页面入口js (file name can't be customized unless you change the webpack.config.js)
│       │   │   ├── app.vue     # login vue (file name can be customized)
│       │   │   └── index.html  # template html (file name can't be customized unless you change the webpack.config.js)
│       │   └── bassinet # index.html
│       │       ├── index.js
│       │       ├── index.html
│       │       └── app.vue
│       ├── commonPage      # 通用公共模块
│       │   ├── addPsg      # 添加常旅客 
│       │   ├── payment     # 支付
│       │   ├── payResult   # 支付结果
├── LICENSE
├── .babelrc          # babel config (es2015 default)
├── .eslintrc.js      # eslint config (eslint-config-vue default)
├── server.js         # port 2333
├── package.json
├── postcss.config.js # postcss (autoprefixer default)
├── webpack.config.js
└── README.md
```

### 前端开发流程

    svn clone项目之后首先安装项目所依赖的modules: 
    modules: npm install

