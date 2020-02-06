# 前言

先附带简单的使用方法
` 主html `
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="lib/goals/1.0/goals.css" />
    </head>
    <body>
    </body>
    <script type="text/javascript" src="../lib/goals/1.0/goals.compatibility.js" ></script>
    <script type="text/javascript" src="../lib/goals/1.0/goals.xml.js" ></script>
    <script type="text/javascript" src="../lib/goals/1.0/goals.request.js" ></script>
    <script type="text/javascript" src="../lib/goals/1.0/goals.chaotic.js" ></script>
    <script type="text/javascript" src="../lib/goals/1.0/goals.page.js" ></script>
    <script>
           (function(goals) {
                goals.init({
                     project: '/test',
                     hashEncrypt: true,
                     page: 'one'
                });
           }(Goals));
     </script>
</html>
```

` one.html `
```html
<div>${hello}</div>
```

` one.js `
```javascript
GoalsPage({
    data: {
        hello: 'Hello World'
    },
    notImportDefaultCss: false,
    onready: function() {
    	var that = this;
        setTimeout(function() {
            that.data.hello = '莫西莫西';
        }, 2000);
    }
})
```

---

看了简单使用方式是不是感觉很简单呀

```
Goals是HashFrame的特大升级版，但是它修改了许多HashFrame模式下的功能与特性，所以它叫做“GOALS”。
Goals和HashFrame在页面JS上最大的区别在于，HashFrame引入js是做了局域限制的（做局域限制会有很多坑，所有摒弃了），而Goals是全局的。
Goals不兼容IE8及以下，使用goals.compatibility.js可兼容IE10及以上版本
Goals的使用方法和微信小程序的写法非常类似，但是Goals内部目前并没有实现for标签以及if标签，因为实现较为麻烦，而这些都可以通过js实现，它不像微信小程序那样，限制太大。
Goals的核心包是goals.page.js，它实现了这套写法，Goals的每个包都可以独立使用的，在不使用goals.page.js的时候，也可以使用其他包，下面介绍Goals每个包的作用。
```

## Goals目录

> goals
>> 版本号
>>> goals.doc.js【充当JSDOC的角色】
>>> goals.page.js【核心包】
>>> goals.chaotic.js【简单的混淆加密包】
>>> goals.request.js【发送http请求的包】
>>> goals.xml.js【解析xml的包】
>>> goals.security.js【结合FastServer-Token使用的核心包，它会自动使用AES加密传输，解密响应密文，对请求参数签名等】
>>> goals.compatibility.js【兼容包，可兼任IE10】
>>> goals.cookie.js【操作cookie的包】
>>> goals.session.js【操作sessionStorage的包】
>>> goals.storage.js【操作localStorage的包】
>>> goals.utils.js【包含许多常用的js方法】

### GoalsDoc

```
GoalsDoc存在的意义，它包含了所有包下的js方法以及注释，它是一个简洁的API文档。
它在Hbuilder中在使用对应的方法时，会进行提示，当然，它不需要在html代码中引用，它只需要存在项目下的任何路径中，即可完成再书写时的友好提示。
（注：因编写时使用的是Hbuilder IDE，其它IDE是否会友好的提示，并没有测试。）
```

### GoalsPage

```
GoalsPage是Goals框架的核心包。
特性1：它完成了对html代码的解析，并创建elements，然后对elements和data数据进行绑定，以达到在修改data数据时对对应的elements进行修改。
特性2：它会对页面js中的内容进行封装，封装成GoalsView对象。
特性3：它会自动导入页面对应的css，当然，你也可以使用notImportDefaultCss属性来取消自动导入。
特性4：针对重复导入的js脚本，Goals将不会再做导入的超做，因为每个页面导入的js都是在全局的。
特性5：针对导入的CSS进行缓存，当页面切换和进入页面时会进行清理和重新导入。
特性6：在页面js中使用this关键字指向GoalsView对象，可以使用GoalsView中的方法。
......
```

### GoalsChaotic

```
GoalsChaotic是一个简单的混淆加密包。
使用它可对字符串进行混淆加密，它是可逆向的，所以它不是安全的，当然，没有完全的安全，主要看使用场景。
初始化GoalsPage时，如果设置了hashEncrypt属性为true，则GoalsPage会使用GoalsChaotic对URI中的hash值进行加密处理。
GoalsChaotic有一个的缺点，使用它混淆加密字符串后字符串的长度会增加3-8倍，所以不建议使用它进行传输大量数据混淆加密，可以使用它对id等关键属性进行首次混淆，再做其它加密，增大破解难度。
```

### GoalsRequest

```
GoalsRequest对http请求进行了封装。
这个模块应该没什么多大的说头吧，也没什么说头，就是request包
```

### GoalsXml

```
GoalsXml是对xml数据进行解析或者将数据转换成xml的一个工具类。
它目前最主要的作用是通过GoalsXml的parse方法解析html代码，他会已独特的格式进行解析，这是它自己实现的。
针对速度而言，parse方法的首次遍历速度会比JS原生的XML解析器慢许多，但是当它进行第二次遍历时它的速度是非常非常快的，总解析速度比jQuery的XML解析要快一些，这是需要看使用场景的，因为parse方法解析的结果是特殊，它主要还是用于GoalsPage的html解析。
当然，GoalsXml也包含了JS原生XML解析的封装。
```

### GoalsSecurity

```
GoalsSecurity是一个安全数据传输的包。
使用它需要后台使用FastServer-Token和FastServer-Authority配合使用，它是对FastServer-Token的这一套Token与签名认证以及数据加密进行了封装。
GoalsSecurity包含了对数据AES加解密，对数据MD5摘要，以及封装的需要权限认证ajax方法。
```

### GoalsCompatibility

```
GoalsCompatibility的作用在于兼容IE10等部分阉割版浏览器，对IE10等不支持的函数进行了重写。
```

### GoalsCookie

```
GoalsCookie是对浏览器cookie操作的封装，通过它可以比原生js更方便的操作浏览器cookie。
```

### GoalsSession

```
GoalsSession是对浏览器sessionStorage操作的封装，使用GoalsSession操作session缓存更为方便简单。
GoalsSession最大的特性在于，它会自动判断存入的值是对象还是基本类型，从而判断是否使用JSON.stringify与JSON.parse来对数据的操作，也就是说GoalsSession的使用者是不需要对对象或数组做JSON.stringify处理的，存的时候是什么，取的时候是什么，它是智能的。
```

### GoalsStorage

```
GoalsStorage是对浏览器localStorage操作的封装，使用GoalsStorage操作storage缓存更为方便简单。
GoalsStorage最大的特性在于，它会自动判断存入的值是对象还是基本类型，从而判断是否使用JSON.stringify与JSON.parse来对数据的操作，也就是说GoalsStorage的使用者是不需要对对象或数组做JSON.stringify处理的，存的时候是什么，取的时候是什么，它是智能的。
```
### GoalsUtils

```
GoalsUtils里面包含了常用的方法。
你可以使用它，你也可以不使用它，它只是对常用方法进行封装，对整体而言没什么影响。
```





