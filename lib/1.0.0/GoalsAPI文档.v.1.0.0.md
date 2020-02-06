[toc]
# Goals
所有api均以内置入Goals

## Goals根

### Goals.init(settings)

在核心包加载完成后调用，初始化Goals。
通过它设置的值大部分都会一直存在`Goals.common`中，具体见`Goals.common`说明
参数列表
> settings.page [(`String`，必填)，首次打开的页面，如果uri中包含了页面信息，则此值无效。]
> settings.project [(`String`，必填)，项目名称]
> settings.server [(`String`，选填)，请求接口的前缀]
> settings.container [(`Object`，选填)，页面容器，elements对象，默认document.body]
> settings.pageCallbackName [(`String`，选填)，页面JS的回调名称，支持xxx.xxx，默认GoalsPage]
> settings.hashDelimiter [(`String`，选填)，uri中hash值的分割符，默认“!”]
> settings.hashParamsDelimiter [(`String`，选填)，uri中参数值的分割符,默认“=”]
> settings.hashEncrypt [(`Boolean`，选填)，是否加密uri中的hash值，默认false]
> settings.debug [(未实现)(`Boolean`，选填)，是否以debug模式启动，默认false]

### Goals.exportJs(src, callback)

通过JS导入JS文件

### Goals.exportCss(src)

通过JS导入CSS文件，它会返回CSS的link标签元素（elements）

### Goals.open(url, params)

打开一个页面，可以传入附加参数params。
url支持相对路径、绝对路径、以及http网络路径。
params会绑定在当前页面的对象上（`GoalsView.receive`）。
注：params会被copy至新页面（并且会出现在URI中），也就是说两个页面的params不是同一个对象。

### Goals.combine(source, target)

两个合并对象/数组。
将第一个对象深拷贝至第二个对象。
如果第二个参数为空，则是对象的深拷贝。
它会返回第二个参数，这也保证了不传入第二个参数的情况下能得到一个深拷贝对象。

### Goals.onhashchange [Callback|Function]

监听浏览器hash值的变化。
针对此框架而言就是监听页面的变化，可用于处理浏览器后退、前进等进行页面跳转。
可在方法上直接接收浏览器的hash值。
它是一个回调方法，它已经由Goals内部实现，除非你需要自定义核心功能，否则不要重写它。


## GoalsCommon

### Goals.common.PROJECT_NAME [String]

当前项目的名称，Goals在请求某些路径时会通过它作为根目录去寻找。
它的值通常就是Nginx配置下的文件夹名称，如果你是域名直接指向，它的值就是空字符串了。
它是在`Goals.init`设置的，它是只读的。

### Goals.common.PROJECT_SERVER_NAME [String]

当前项目请求后台接口API的名称，Goals的某些请求会通过它作为根目录去请求。
它的值通常都是Nginx配置下的location反向代理地址。
它是在`Goals.init`设置的，它是只读的。

### Goals.common.PAGE_CALLBACK_NAME [String]

页面JS的回调名称。
它的默认值是GoalsPage。
它是在`Goals.init`设置的，它是只读的。

### Goals.common.CONTAINER [Elements]

页面容器，所有的页面内容会在这个容器中生成。
它的默认值是document.body。
它是在`Goals.init`设置的，它是只读的。

### Goals.common.HASH_DELIMITER [String]

uri中的hash值的分割符。
它默认值是“!”，它的作用是在于初次简单的验证hash值的正确性。
它是在`Goals.init`设置的，它是只读的。

### Goals.common.HASH_PARAMS_DELIMITER [String]

uri中的参数值的分割符。
它默认值是“=”，它的作用是对uri中的参数进行提取。
它是在`Goals.init`设置的，它是只读的。

### Goals.common.HASH_ENCRYPT [Boolean]

是否加密uri中的hash值。
加密会使用chaotic加密，加密后的字符长度会大量变长。
使用加密的用作在于更好的保护你的uri地址。
它是在`Goals.init`设置的，它是只读的。

### Goals.common.DEBUG [Boolean]

（当前版本没有实现它的功能）
是否以debug模式启动。
它的默认值是false。
它是在`Goals.init`设置的，它是只读的。


## GoalsXml

xml工具类

### Goals.xml.parse(text)

将xml字符串解析成对象，也就是JSON嘛。
此方法解析的对象主要是适用于Goals框架。
当然，你也可以将解析出的值再次循环解析，并没有多大的影响。

### Goals.xml.elems(text)

将xml字符串解析成elements对象（页面）。
它使用的使用原生`DOMParser`对象与`Microsoft.XMLDOM`实现的，所以这一步它的速度是相当快的，但是因为它是elements对象，在需要解析出你需要的值的时候，遍历它去查找你需要的值是较慢的。


## GoalsRequest

### Goals.request.ajax(settings)

ajax方法，正常使用和常规ajax一样
参数列表
> settings.url [(`String`，必填)，请求的地址]
> settings.type [(`String`，选填)，请求类型，(GET|POST|PUT|DELETE|...)]
> settings.resultType [(`String`，选填)，返回值类型，对返回的数据进行解析，目前支持json、xml，默认会根据返回的Content-Type判断，如果不是json或者xml，则不会解析，(json|xml)]
> settings.parseData [(`Boolean`，选填)，是否需要解析传入的data值]
> settings.anysc [(`Boolean`，选填)，同步请求还是异步请求，默认false异步]
> settings.headers [(`Object`，选填)，请求的消息头，默认'Content-Type'为'application/json']
> settings.timeout [(`Number`，选填)，请求超时时间，默认无]
> settings.success [(`Callback|Function`，选填)，请求成功回调]
> settings.error [(`Callback|Function`，选填)，请求失败回调]

### Goals.request.jsonp(settings)

jsonp请求方法
参数列表
> settings.url [(`String`，必填)，请求的地址]
> settings.callbackName [(`String`，必填)，请求的回调域]
> settings.okFn [(`Callback|Function`，选填)，请求成功的回调]
> settings.errFn [(`Callback|Function`，选填)，请求错误的回调]
> settings.timeout [(`Number`，选填)，请求超时时间]

## GoalsView

在页面js中使用this关键字调用

### this.data [Object]

当前页面的data数据，可通过直接设置它的属性值来改变对应绑定页面的地方

### this.javascript [Array]

当前页面加载的其它js文件

### this.css [Array]

当前页面加载的其它css文件

### this.receive [Object|String]

当前页面的参数，从其它页面传入的参数。
此参数如果是对象，会从原对象上copy至此对象，而非直接赋值。

### this.hash [String]

页面的url值，在浏览器中它的名字是hash。

### this.notImportDefaultCss [Boolean]

是否引用与页面同级目录相同名称的css文件。
false为引用，true为不引用。
默认无此值，引用。

### this.onload()

此方法是在页面JS中定义的。
在Goals加载页面时会触发它。
这里可以写一些网络请求哦。

### this.onready()

此方法是在页面JS中定义的。
页面初始化完成，并且包也完成导入了。
这里可以写逻辑了或者是调用引用的包以及页面elements了

### this.onunload()

此方法是在页面JS中定义的。
页面卸载时的触发函数。

### this.onshow()

此方法是在页面JS中定义的。
页面显示的时候触发。

### this.onhide()

此方法是在页面JS中定义的。
页面隐藏的时候触发。

### this.showExecutor()

显示页面的执行者。
它需要实现将页面显示的功能。
它默认只执行了一句代码`this[0].style.display = 'block'`
你可以重写它，重写它的方式有两种：
* 【全局重写】
```javascript
GoalsView.prototype.showExecutor = function() {
    // 你需要实现显示的动画或效果
    // 这里可以直接使用this关键字
}
```
* 【单页面重写】
```javascript
// 只需要在页面JS中加入就可以了
GoalsPage({
    data: {},
    // ...你的其它方法
    showExecutor: function() {
        // 你需要实现当前页面的显示动画或效果
    }
});
```

### this.hideExecutor()

隐藏页面的执行者。
它需要实现将页面隐藏的功能。
它默认只执行了一句代码`this[0].style.display = 'none'`
你可以重写它，重写方法和`this.showExecutor()`一样。

### this.data.key = value

设置页面的数据，传入对象（key-value），根据赋值的key去修改页面elements对应的值。
此方法为属性赋值
使用方法`this.data.key = value`，这里的key必须是原始data中存在的key。
注意：使用此方法修改值时，针对数组与对象，是与之前的对象进行合并，而并非替换。

### this.setDate(obj)

设置页面的数据，传入对象（key-value），根据修改了的key去修改页面elements对应的值。
你也可以使用`this.data.key = value`直接赋值的方式
注意：使用此方法修改值时，针对数组与对象，是直接替换原来的值。
它和`this.data.key`的区别，举个简单的栗子：
初始化`data`
```javascript
data = {
    obj: {
        a: '我是a',
        b: '我是b'
    }
}
```
使用`this.data.obj = {a: 'I am a'};`时，此时的obj的值是`{a: 'I am a', b: '我是b'}`;
使用`this.setData({a: 'I am a'});`时，此时的obj的值是`{a: 'I am a', b: ''}`，`obj.b`在此时就没有值啦;

### this.find(selector)

查找页面上的dom，支持Goals选择器，id选择器，class选择器等，它内部是由querySelector实现的
Goals选择器，是Goals自定义的一种选择器，在使用中建议使用Goals选择器，原因：
* 在两个页面使用相同id时的只会是第一个生效，而Goals选择器不会，它只需要保证正一个页面下位置就行了。
* 它是不存在耗时问题的。
Goals选择器的元素在初始化后就已经存在，就像dom元素一样，它存在对象在，查找就相当于直接取值。
使用方法：
```html
<!-- html元素上添加属性'goals-id="xxx"' -->
<div goals-id="test">测试div</div>
<!-- js中使用 -->
this.find("g:test")
```

### this.getViewByUrl(url)

根据url查找页面。
返回的是`GoalsView`对象，如果找不到页面，则返回`null`。

### this.show()

显示页面，显示前会调用`this.onshow()`，再调用`this.showExecutor()`实现显示。
内置方法，由GoalsView实现，它是只读的。

### this.hide()

隐藏页面，隐藏前会调用`this.onhide()`，再调用`this.hideExecutor()`实现隐藏。
内置方法，由GoalsView实现，它是只读的。

### this.reload()

重新加载页面。
此方法是针对此框架（Goals）重新加载，它会重置页面数据，清空页面下的元素，重新生成以及绑定。
内置方法，由GoalsView实现，它是只读的。

### this.unload()

卸载当前页面。
他会完全关闭当前页面。
在卸载页面之前，它会调用onunload方法。
内置方法，由GoalsView实现，它是只读的。


## GoalsChaotic

字符串混淆加解密类

### Goals.chaotic.encode(str)

混淆加密字符串。

### Goals.chaotic.decode(str)

解密混淆字符串。


## GoalsCookie

浏览器cookie工具类

### Goals.cookie.add(name, value, expires)

添加或者修改浏览器cookie，如果name已存在则是修改。
并且对值使用了`Goals.chaotic`加密。
[name] cookie的name值。
[value] cookie的value值。
[expires] cookie的过期时间，单位为秒，如果不传入此参数，则在浏览器关闭时清除cookie。

### Goals.cookie.get(name)

根据name获取浏览器cookie。
返回cookie的value值。
[name] cookie的name值。

### Goals.cookie.remove(name)

根据name删除浏览器cookie。
[name] cookie的name值。


## GoalsSession

浏览器sessionStorage类。

### Goals.session.add(name, value)

添加或者修改浏览器sessionStorage。
如果name存在则是修改。
储存的时候对值进行了chaotic加密。
[name] sessionStorage的name值。
[value, (Object|String)] sessionStorage的value值，它会自动判断存入的值是对象还是基本类型，并做相应的处理后进行储存。

### Goals.session.get(name)

获取sessionStorage。
返回sessionStorage的值，它会自动判断值是基本类型还是对象。
[name] sessionStorage的name值。

### Goals.session.remove(name)

删除sessionStorage。
[name] sessionStorage的name值。

### Goals.session.clear()

清空所有sessionStorage。

### GoalsStorage

浏览器localStorage类。

### Goals.storage.add(name, value)

添加或者修改浏览器localStorage。
如果name存在则是修改。
储存的时候对值进行了chaotic加密。
[name] localStorage的name值。
[value, (Object|String)] localStorage的value值，它会自动判断存入的值是对象还是基本类型，并做相应的处理后进行储存。

### Goals.storage.get(name)

获取localStorage。
返回localStorage的值，它会自动判断值是基本类型还是对象。
[name] localStorage的name值。

### Goals.storage.remove(name)

删除localStorage。
[name] localStorage的name值。

### Goals.storage.clear()

清空所有localStorage。

## GoaslSecurity

与FastServer-Token和FastServer-Authority结合的数据传入安全操作类。

### Goals.security.disrupt(str)

混淆字符串。
提起偶数位倒序拼接上基数位倒序。
返回混淆后的字符串。
[str] 需要混淆的字符串。

### Goals.security.invert(str)

转换字符串。
把字符串从末尾依次倒序整理。
返回转换后的字符串。
[str] 需要混转换的字符串。

### Goals.security.sign(obj, secret)

使用密钥对数据（对象）进行MD5签名。
返回MD5签名。
[obj] 需要签名的数据。
[secret] 密钥。

### Goals.security.aesEncode(secret, str)

使用密钥对字符串进行AES加密。
返回加密后的数据。
[secret] 密钥。
[str] 需要加密的数据。

### Goals.security.aesDecode(secret, str)

使用密钥对字符串进行AES解密。
返回解密后的数据。
[secret] 密钥。
[str] 需要解密的数据。

### Goals.security.token(settings)

封装的以用户名、密码换取Token的方法（也就是登陆方法）。
对请求返回的数据进行了基本的处理：
* 对返回的数据用`Goals.session`进行储存。
* 对返回的密钥用`Goals.session`进行储存。
参数列表
> settings.data [(`Object`，必填)，包含用户名和密码的对象。]
> settings.data.loginName [(`String`，必填)，用户名。]
> settings.data.password [(`String`，必填)，密码。]
> settings.url [(`String`，选填)，默认是FastServer-Authority中的登陆接口地址。]
> settings.success [(`Callback|Function`，选填)，登陆成功的回调。]
> settings.error [(`Callback|Function`，选填)，登陆失败、请求错误的回调。]

### Goals.security.ajax(settings)

对`Goals.request`模块的ajax进行了封装。
它会使用`Goals.session`获取token等相关信息，然后写在对应的地方。
你也可以使用encrypt参数对请求数据进行加密。
参数列表
> settings.url [(`String`，必填)，请求接口地址，它会自动拼接`Goals.common.PROJECT_SERVER_NAME`的值。]
> settings.data [(`Object`，选填)，请求的数据。]
> settings.type [(`String`，选填)，请求接口的方式，默认为get请求，不区分大小写，(GET|PUT|DELETE|...)]
> settings.encrypt [(`Boolean`，选填)，是否加密请求数据。]
> settings.headers [(`Object`，选填)，消息头。]
> settings.success [(`Callback|Function`，选填)，成功回调。]
> settings.error [(`Callback|Function`，选填)，失败回调。]
> settings[其它] [参见`Goals.request.ajax`]

## GoalsUtils

常用方法utils工具类

### Goals.utils.assert(flag, msg)

断言。
通过判断flag参数，如果flag参数为[false|null|undefined|'']，则抛出msg异常。

### Goals.utils.isNull(arg)

判断传入的数据是否是null。

### Goals.utils.isUndefined(arg)

判断传入的数据是否是undefined。

### Goals.utils.isString(arg)

判断传入的数据是否是字符串（String）。

### Goals.utils.isNumber(arg)

判断传入的数据是否是数字（Number）。

### Goals.utils.isBoolean(arg)

判断传入的数据是否是布尔类型（Boolean）。

### Goals.utils.isFunction(arg)

判断传入的数据是否是方法（Function）。

### Goals.utils.isDate(arg)

判断传入的数据是否是时间类型（Date）。

### Goals.utils.isArray(arg)

判断传入的数据是否是数组（Array）。

### Goals.utils.isObject(arg)

判断传入的数据是否是对象（Object）。

### Goals.utils.isRegExp(arg)

判断传入的数据是否是正则表达式（RegExp）

### Goals.utils.getURIParameter(name)

根据name获取URI链接的参数，如果没有，则返回null。

### Goals.utils.dateFormat(date, format)

根据format格式化date。
[date，(String|Date|Number)] 可以是Date类型、字符串、或者数字类型的时间戳。
[format，(String)] yyyyMMddHHmmssSSS格式

### Goals.utils.getTagNameData(selector)

获取传入元素包含的input，select，textarea包含name属性的值。

### Goals.utils.event()

针对某些浏览器在事件触发时没有event值，可以通过此方法直接获取。

### Goals.utils.on(selector, bubbling, event, fn)

给selector下的bubbling绑定事件。
[selector] elements对象。
[bubbling] class或id值。
[event，(click|change|...)] 事件类型。
[fn] 事件触发的回调方法。

### Goals.utils.hover(selector, inFn, outFn)

给元素绑定hover事件的方法。
因直接使用mouseover和mouseout在元素本身也会多次触发，所以有了此方法进行封装。
[selector] elements对象。
[inFn] 移入的回调方法。
[outFn] 移出的回调方法。































