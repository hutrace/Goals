# Goals

## 简介

`Goals` 是 `HashFrame` 的特大升级版，所以，它也是单页面应用；

单页面应用的好处在于
1. 加载速度非常快，不会二次加载公共资源。
2. 对服务器压力小，服务器只用出数据就可以，不用管展示逻辑和页面合成，吞吐能力会提高几倍。
3. 打开新页面完全采用异步Ajax加载，没有页面之间的切换，不会出现“白屏”与“假死”现象，页面显示流畅，web应用更具响应性和更令人着迷；这样的体验才更像应用，而不是网页。
4. ...

缺点是
1. 无法做SEO
2. 使用页面缓存时，id选择器和class选择器无法达到想要的结果
3. ...

`Goals` 在缺点上做了优化，SEO可采用中间件（ `Node.js` 或其它语言实现），实现中间件编译。

而id选择器等， `Goals` 定义了 `goals-id` 选择器，它完美避免了多页面重复 `id/class` 。


## 版本特性

`Goals2.0` 版本起，优化了许多代码，并且支持组件，[Goals2.0.0下载](http://goals.hutrace.info/doc/2.0.0/)，[整包下载](http://goals.hutrace.info/doc/2.0.0/)。

是什么组件？

凡是能够被复用的，都可以称之为组件，就这么简单！

`Goals` 的组件和其它组件可能有些不同，它和页面（ `view` ）类似，和页面具有非常多的相同属性以及方法。具体见 [`GoalsPage.GoalsComponent` 的 `API`](http://goals.hutrace.info/doc/2.0.0/interfaces/_goals_d_.goalspage.instancecomponent.html) 列表


## 注意事项

* 不能在标签内部的最末尾保留空格，否则会解析错误

> 错误例子：`<div class="test" ></div>` 、 `<input type="text" / >`

> 正确例子：`<div class="test"></div>` 、 `<input type="text" />` ("/"之前的空格就随心情了，再多也没事)

* `Goals`对标签属性保留了一个关键字，叫做 `GoalsText` ，当属性中存在表达式的时候，属性名不能为 `GoalsText` ，当然，正常情况下没人会这样写属性，因为 `html` 标签属性浏览器都会转换成小写的，那万一不正常了呢？

> 错误示例：`<div GoalsText="${txt}"></div>`
> 正确示例：`<div GoalsText="abcdefg"></div>` 或者 `<div goalstext="${txt}"></div>` 再或者 `<div goals-text="${txt}"></div>`


## Goals解析

`Goals` 中有很多模块，它的核心模块是 `GoalsView` 模块以及 `GoalsXML` 模块

`GoalsXML` 实现了解析 `html` ， `GoalsView` 实现了页面的生命周期以及页面属性的绑定。
各个模块的作用见 [`API`](http://goals.hutrace.info/doc/2.0.0/) 文档


## 入门使用

**Goals使用非常简单，你需要一个主html页面，它是所有页面的容器**

***main.html***
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <title>Hello Goals</title>
    </head>
    <body>
    </body>
    <script type="text/javascript" src="lib/goals.js" ></script>
    <script>
        // project的值为当前项目名，如果你的访问不用加项目名，则为空字符串
        // page的值为首次打开的页面，按照当前html文件的相对路径，不需要后缀
        Goals.init({
            project: '/test',
            hashEncrypt: true,
            page: 'one'
        });
    </script>
</html>
```

***one.html***
```html
<div>${hello}</div>
<div>让我们试试表达式的使用吧</div>
```

***one.js***
```js
GoalsPage({
    data: {
        hello: 'Hello world !!!'
    },
    notImportDefaultCss: false,
    onready: function() {
        var self = this;
        // 延迟2秒修改hello的值
        setTimeout(function() {
            self.setData({hello: '你好，世界！'});
        }, 2000);
        // 如果使用es6，那就更简单了，你也可以使用另一种方式
        setTimeout(this.setData, 4000, {hello: 'Hello world !!!'});
    }
})
```

## Goals组件说明

组件使用稍微复杂，它的使用方式非常多，说不完，可根据实际情况进行书写。

你可以在一个项目中有一个专门写组件的 `js` ，当然，也可以一个组件一个 `js` ，看心情以及是否好维护。

**首先需要创建一个 `js` ，用于存放组件。**

***component.js***
```js
// 这里创建一个名字叫做component1的组件
GoalsComponent('component1', {
    // 这里的view支持html代码，html文件绝对路径、相对路径以及网络路径，详情见API文档
    view: '<div>Hello Goals component !!!</div>'
});
// 这里创建一个名字叫做component2的组件
GoalsComponent('component2', {
    view: '<div>${hello}</div>',
    onshow: function() {
        setTimeout(this.setData, 2000, {hello: '你好，世界！'});
    }
});
// 这里创建一个名字叫做component3的组件
GoalsComponent('component3', {
    data: {hello: 'Hello World'},
    view: '<div>${hello}</div>',
    onshow: function() {
        setTimeout(this.setData, 2000, {hello: '你好，世界！'});
    }
});
```

**创建容器页面**

***container.html***
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <title>Hello Goals</title>
    </head>
    <body>
    </body>
    <script type="text/javascript" src="lib/goals.js" ></script>
    <script>
        // project的值为当前项目名，如果你的访问不用加项目名，则为空字符串
        // page的值为首次打开的页面，按照当前html文件的相对路径，不需要后缀
        // 具体属性见API文档
        Goals.init({
            project: '/test',
            page: 'page/test'
        });
    </script>
</html>
```

**创建一个测试页面，你可以放在一个文件夹内，例如，在container.html同级下创建page文件夹**

***page/test.html***
```html
<div>${hello}</div>
<component1></component1>
<!-- 如果你的组件中不需要支持子元素，你可以使用单标签的写法，要记得加'/'哦 -->
<component2/>
<component3/>
```

***page/test.js***
```javascript
GoalsPage({
    data: {
        hello: 'Hello World'
    },
    notImportDefaultCss: true,
    onready: function() {
        setTimeout(this.setData, 5000, {hello: 'Hello World !!!'});
    }
})
```

**说明：你可以按照上面的例子实验，你会发现他们的区别**

* `component1`：很简单，没有什么，就只是简单的标签，没有表达式
* `component2`：使用了表达式 `${hello}` ，但本身并没有在 `data` 中声明 `hello` 属性，它会自动继承来自页面 `page/test.js` 下的 `hello` 属性，且注意看延迟 `2s` 执行的 `setData` ，当 `component2` 调用 `setData` 的时候，改变的仅仅是 `component2` 的 `hello` 属性，并不会全局更改，而再看 `page/test.js` 延迟 `5s` 执行的 `setData` ，当它这些之后，改变的内容包含了 `component2` 下所使用的 `hello` 属性。

> 从这里可以总结出：当组件中，没有在 `data` 中声明的属性，但是使用过的属性，该属性会自动继承页面的对应属性（特殊说明：组件可以内嵌组件，内部组件和外部组件的关系和此处的组件与页面关系一样），当在子组件中使用 `setData` 改变值的时候，其父页面/父组件的内容不会改变，当父页面/父组件使用 `setData` 改变值的时候，这种情况下所有的子孙组件都会对应改变。
* `component3`：使用了表达式 `${hello}` ，且本身声明了 `hello` 属性，它和 `component2` 的区别在于，他的 `hello` 属性是独立的，不会随着父级的改变而改变。

上面介绍的是组件的基本用法，也有更高级的用法，种类很多，这里大概阐述一下，在 `js` 中初始创建组件时，有一个较为重要的属性和一个较为重要的回调函数，分别是 `node` 属性和 `oncreate` 回调函数，通过他们可以实现非常高级的组件使用方式，详情见组件 [`API`](http://goals.hutrace.info/doc/2.0.0/) 文档。
