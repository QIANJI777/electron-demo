## 模板说明
### 后续添加：webpack配置（dev、打包等）
### 目录结构

    build(打包(webpack)配置)
    src
        assets(静态资源)
            font(字体)
            images(图像)
            styles(样式)
        common(公共文件夹)
            components(公共组件)
            mixins(混入)
            directives(自定义指令)
            utils(方法)
            rem(屏幕适配方案)
            axioshelpLoading(请求加载层)
            global(websocket)
            $message(message消息提示组件封装)
            config(存放环境变量、路径配置)
        layouts(公共布局)
        middleware(中间件, 路由跳转判断)
        moudules(按业务分模块(文件夹))
            xx(某业务)
                components(业务组件)
                tests(测试单元)
                store(该业务的持久数据vuex)
        plugins(插件)
        services()
            http(封装axios、放api)
            local(管理localStorage)
        static(虚拟数据)
        router
        store
        views
            emptypage(空白页)
            404(404页)

    