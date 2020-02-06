/*
 * 此js的意义
 * 因作者建议使用Hbuilder作为开发工具,将此js放在包目录下可以进行非常友好的jsdoc提示
 * 此文件不需要再html中引用,引用它是多余的
 * 它的存在仅仅在于jsdoc的友好提示
 */




var Goals = function() {this.prototype = new Object();}

var GoalsRequest = function() {this.prototype = new Object();};

/**
 * ajax方法,它的正常使用和常规的ajax一样必填参数<br/>
 * (<b>url</b>,String,请求的地址)<br/>
 * <br/>
 * 选传参数<br/>
 * (<b>type</b>,String,请求类型,GET,PUT,POST,DELETE等)<br/>
 * (<b>resultType</b>,String,返回值类型,对返回的数据进行解析,目前支持json,xml,默认会根据返回的Content-Type判断,如果不是json或xml,则不会解析<b>如果你使用了xml,则需要引用goals.xml包</b>)<br/>
 * (<b>data</b>,Object,请求的内容)<br/>
 * (<b>parseData</b>,Boolean,是否需要解析传入的data值)<br/>
 * (<b>anysc</b>,Boolean,同步请求还是异步请求,默认false异步)<br/>
 * (<b>headers</b>,Object,请求的消息头,默认'Content-Type'为'application/json')<br/>
 * (<b>timeout</b>,Number,请求超时时间,默认无)<br/>
 * (<b>success</b>,Function,请求成功回调)<br/>
 * (<b>error</b>,Function,请求失败回调)<br/>
 * @param {Object} settings
 */
GoalsRequest.prototype.ajax = function(opt) {};

/**
 * jsonp,此方法应该不需要做多余的解释吧<br/>
 * 必填参数<br/>
 * (<b>url</b>,String,请求的地址)<br/>
 * (<b>callbackName</b>,String,请求的回调域)<br/>
 * <br/>
 * 选传参数<br/>
 * (<b>okFn</b>,Function,请求成功的回调方法)<br/>
 * (<b>errFn</b>,Function,请求错误的回调方法)<br/>
 * (<b>timeout</b>,Number,请求超时时间)<br/>
 * @param {String} url 请求的地址
 * @param {String} callbackName ["GoalsView"] 请求的回调域
 * @param {Function} okFn 请求成功的回调方法
 * @param {Function} errFn 请求错误的回调方法
 * @param {Number} timeout 请求超时时间
 */
GoalsRequest.prototype.jsonp = function(url, callbackName, okFn, errFn, timeout) {};

/**
 * Goals的request类,通过它你可以发送HTTP请求以及其它请求
 * @param {Object} settings
 */
Goals.prototype.request = new GoalsRequest();

var GoalsView = function(opt) {this.prototype = new Object();};

/**
 * 设置页面的数据,与微信的setData类似<br/>
 * 你也可以使用page页面的data.xxx直接赋值的方式<br/>
 * 但是两种方式是有区别的,详情见文档
 * @param {Object} obj
 */
GoalsView.prototype.setDate = function(obj) {};

/**
 * 查找页面上的dom,支持Goals选择器,id选择器,class选择器等,它内部是由querySelector实现的<br/>
 * Goals选择器,是Goals自定义的一种选择器,在使用中建议使用Goals选择器,因为它是不存在耗时问题的.<br/>
 * Goals选择器的元素在初始化后就已经存在,就想dom元素一样,它存在对象在,查找就相当于直接取值.<br/>
 * <b>使用方法</b><br/>
 *  html元素上添加属性'goals-id=xxx'
 *  find('g:xxx')即可
 * @param {String} selector
 */
GoalsView.prototype.find = function(selector) {};

/**
 * 当前页面的data数据,可通过直接设置它的属性值来改变对应绑定页面的地方
 * @type {Object}
 */
GoalsView.prototype.data = null;

/**
 * 当前页面加载的其它js文件
 * @type {Array}
 */
GoalsView.prototype.javascript = null;

/**
 * 当前页面加载的其它css文件
 * @type {Array}
 */
GoalsView.prototype.css = null;

/**
 * 当前页面的参数,从其它页面传入的参数.<br/>
 * 此参数如果是对象,会从原对象上copy至此对象,而非直接赋值.
 * @type {Object|String}
 */
GoalsView.prototype.receive = null;

/**
 * 页面的url值,在浏览器中它的名字是hash
 * @type {String}
 */
GoalsView.prototype.hash = null;

/**
 * 是否引用与页面同级目录相同名称的css文件<br/>
 * false为引用,true为不引用<br/>
 * 默认无此值,引用
 * @type {Boolean}
 */
GoalsView.prototype.notImportDefaultCss = false;

/**
 * 当初始化时使用了语言包的时候,当前页面是否不使用语言包<br/>
 * 默认false,需要使用语言包
 * @type {Boolean}
 */
GoalsView.prototype.notUseLanguage = false;

/**
 * 当你启用了语言设置的时候.<br/>
 * 它就是自动获取到的语言.
 */
GoalsView.prototype.language = {};

/**
 * 当前页面的load方法,在准备加载页面时开始调用<br/>
 * 这里可以写一些网络请求哦
 */
GoalsView.prototype.onload = function() {};

/**
 * 页面初始化完成,并且包也完成导入了<br/>
 * 这里可以写逻辑了或者是调用引用的包以及页面Element了
 */
GoalsView.prototype.onready = function() {};

/**
 * 页面卸载时的触发函数
 */
GoalsView.prototype.onunload = function() {};

/**
 * 页面显示的时候触发
 */
GoalsView.prototype.onshow = function() {};

/**
 * 页面隐藏的时候触发
 */
GoalsView.prototype.onhide = function() {};

/**
 * 显示页面的执行者<br/>
 * 它需要实现将页面显示的功能<br/>
 * 你也可以重新它来实现显示页面的动画效果<br/>
 * 它默认只执行了一句代码“this[0].style.display = 'block'”
 */
GoalsView.prototype.showExecutor = function() {};

/**
 * 隐藏页面的执行者<br/>
 * 它需要实现将页面隐藏的功能<br/>
 * 你也可以重新它来实现显示隐藏的动画效果<br/>
 * 它默认只执行了一句代码“this[0].style.display = 'none'”
 */
GoalsView.prototype.hideExecutor = function() {};

/**
 * 根据url查找页面<br/>
 * 如果找到了则返回页面对象,否则返回null
 * @return {Object} GoalsView
 */
GoalsView.prototype.getViewByUrl = function(url) {};

/**
 * 显示页面,显示前会触发onshow<br/>
 * <b>注意：</b>它是只读的,不可被重写
 */
GoalsView.prototype.show = function() {};

/**
 * 隐藏页面,隐藏前会触发onhide<br/>
 * <b>注意：</b>它是只读的,不可被重写
 */
GoalsView.prototype.hide = function() {};

/**
 * 重新加载页面<br/>
 * 此方法是针对此框架重新加载,它会重置页面数据,清空页面下的元素,重新生成以及绑定<br/>
 * <b>注意：</b>它是只读的,不可被重写
 */
GoalsView.prototype.reload = function() {};

/**
 * 卸载当前页面<br/>
 * 它会完全关闭当前页面<br/>
 * 在卸载页面之前,它会调用onunload方法<br/>
 * <b>注意：</b>它是只读的,不可被重写
 */
GoalsView.prototype.unload = function() {};

/**
 * 当前页面的对象,它在页面中可以直接使用this关键字调用<br/>
 * 通过它你可以操作当前页面相关的一些方法
 */
Goals.prototype.Page = new GoalsView();

var GoalsChaotic = function() {
	this.prototype = new Object();
};

/**
 * 混淆加密字符串
 * @param {String} str 字符串
 * @return {String} 加密后的字符串
 */
GoalsChaotic.prototype.encode = function(str) {return null;};

/**
 * 解密混淆字符串
 * @param {String} str 字符串
 * @return {String} 解密后的字符串
 */
GoalsChaotic.prototype.decode = function(str) {return null;};

/**
 * 混淆加密工具类
 */
Goals.prototype.chaotic = new GoalsChaotic();

/**
 * 初始化Goals<br/>
 * 必传参数<br/>
 * (<b>page</b>,String,首次打开的页面)<br/>
 * (<b>project</b>,String,项目名称,设置了它的值之后可以使用Goals.common.PROJECT_NAME来取得)<br/>
 * (<b>server</b>,String,服务名称,设置了它的值之后可以使用Goals.common.PROJECT_SERVER_NAME来取得)
 * <br/>
 * 选传参数<br/>
 * (<b>container</b>,Object,页面容器,js对象,默认document.body)<br/>
 * (<b>pageCallbackName</b>,String,js中的包裹名称,支持xxx.xxx,默认GoalsPage)<br/>
 * (<b>debug</b>,Boolean,是否以debug模式启动,默认false)
 * (<b>hashDelimiter</b>,String,uri中hash值的分割符,默认“!”)<br/>
 * (<b>hashParamsDelimiter</b>,String,uri中参数值的分割符,默认“=”)<br/>
 * (<b>hashEncrypt</b>,Boolean,是否加密uri中的hash值,默认false)
 * @param {Object} opt
 */
Goals.prototype.init = function(settings) {};

/**
 * 导入js文件
 * @param {String} src js文件路径
 * @param {Function} callback 回调函数
 */
Goals.prototype.exportJs = function(src, callback) {};

/**
 * 导入css文件
 * @param {String} src css文件路径
 */
Goals.prototype.exportCss = function(src) {};

/**
 * 打开一个页面,可以传入附加参数params<br/>
 * params会绑定在当前页面的对象上<br/>
 * 注: params会被copy至新页面,也就是说两个页面的params不是同一个对象
 * @param {String} url 要打开的页面,支持相对路径,绝对路径,以及http网络路径
 * @param {Object} params 带入页面的附加参数,附加参数会被写入至页面js
 */
Goals.prototype.open = function(url, params) {};

/**
 * 两个合并对象/数组<br/>
 * 将第一个对象深拷贝至第二个对象<br/>
 * 如果第二个参数为空,则是对象的深拷贝
 * @param {Object} source 拷贝的来源
 * @param {Object} target 拷贝至目标
 * @return {Object} 返回拷贝至目标
 */
Goals.prototype.combine = function(source, target) {};

/**
 * 获取当前页面的url地址.
 * @return {String} url
 */
Goals.prototype.currentUrl = function() {};

/**
 * 监听浏览器hash值的变化<br/>
 * 针对此框架而言就是监听页面的变化,可用于处理浏览器后退、前进等进行页面跳转.<br/>
 * 可在方法上直接接收浏览器的hash值
 */
Goals.prototype.onhashchange = null;


var GoalsCommon = function() {this.prototype = new Object();};
/**
 * 当前项目的名称,Goals在请求某些路径时会通过它作为根目录去寻找<br/>
 * 它的值通常就是Nginx配置下的文件夹名称,如果你是域名直接指向,它的值就是空字符串了<br/>
 * 它是只读的
 * @type {String}
 */
GoalsCommon.prototype.PROJECT_NAME = "";
/**
 * 当前项目请求后台接口API的名称,Goals在请求所有接口API时都会通过它作为根目录去请求<br/>
 * 它的值通常都是Nginx配置下的location反向代理地址<br/>
 * 它是只读的
 * @type {String}
 */
GoalsCommon.prototype.PROJECT_SERVER_NAME = "";
/**
 * 页面js书写的内容包装<br/>
 * 它的默认值是GoalsPage<br/>
 * 它是只读的
 * @type {String}
 */
GoalsCommon.prototype.PAGE_CALLBACK_NAME = "";
/**
 * 页面容器,所有的页面内容会在这个容器中生成<br/>
 * 它的默认值是document.body<br/>
 * 它是只读的
 * @type {String}
 */
GoalsCommon.prototype.CONTAINER = null;
/**
 * 是否以debug模式启动,默认false<br/>
 * 你可以在初始化的时候设置它<br/>
 * 它是只读的
 * @type {Boolean}
 */
GoalsCommon.prototype.DEBUG = false;

/**
 * uri中的hash值的分割符<br/>
 * 你可以在初始化的时候设置它<br/>
 * 它默认值是“!”,它的作用是在于初次简单的验证hash值的正确性<br/>
 * 它是只读的
 * @type {String}
 */
GoalsCommon.prototype.HASH_DELIMITER = '!';

/**
 * uri中的参数值的分割符<br/>
 * 你可以在初始化的时候设置它<br/>
 * 它默认值是“=”,它的作用是对uri中的参数进行提取<br/>
 * 它是只读的
 * @type {String}
 */
GoalsCommon.prototype.HASH_PARAMS_DELIMITER = '=';

/**
 * 是否加密uri中的hash值<br/>
 * 加密会使用chaotic加密,加密后的字符长度会大量变长<br/>
 * 使用加密的用作在于更好的保护你的uri地址<br/>
 * 你可以在初始化的时候设置它<br/>
 * 它是只读的
 * @type {Boolean}
 */
GoalsCommon.prototype.HASH_ENCRYPT = false;

/**
 * 是否启用语言设置
 */
GoalsCommon.prototype.USE_LANGUAGE = false;

/**
 * 公共储存区域,它包含了一些项目公共属性<br/>
 * 此类可自定义扩展属性,它会有一些本身就存在的值,自定义时可不要把它们覆盖了哦
 */
Goals.prototype.common = new GoalsCommon();

var GoalsXml = function() {this.prototype = new Object()};

/**
 * 将xml字符串解析成对象,也就是JSON嘛
 * @param {Object} text xml字符串
 */
GoalsXml.prototype.parse = function(text) {};

/**
 * 将xml字符串解析成document文档
 * @param {Object} text xml字符串
 */
GoalsXml.prototype.elems = function(text) {};

/**
 * xml工具类,包含xml解析等常用方法
 */
Goals.prototype.xml = new GoalsXml();


var GoalsCookie = function() {this.prototype = new Object();};

/**
 * 添加或者修改cookie,如果name存在则是修改,并且对值进行了chaotic加密
 * @param {String} name cookie的name值
 * @param {String} value cookie的value值
 * @param {String} expires cookie的过期时间,单位为秒,如果不传入此参数,则在浏览器关闭时清除cookie
 */
GoalsCookie.prototype.add = function(name, value, expires) {};

/**
 * 根据name获取cookie
 * @param {String} name cookie的name值
 * @return {Object|String} cookie的value值
 */
GoalsCookie.prototype.get = function(name) {return null;};

/**
 * 删除cookie
 * @param {String} name
 */
GoalsCookie.prototype.remove = function(name) {};

/**
 * cookie工具类,可对浏览器的cookie值进行增删改查
 */
Goals.prototype.cookie = new GoalsCookie();

var GoalsSession = function() {this.prototype = new Object();};

/**
 * 添加或者修改session,如果name存在则是修改,并且对值进行了chaotic加密
 * @param {String} name session的name值
 * @param {Object|String} value session的value值
 */
GoalsSession.prototype.add = function(name, value) {};

/**
 * 获取session
 * @param {String} name session的name值
 * @return {Object|String} value session的value值
 */
GoalsSession.prototype.get = function(name) {return null;};

/**
 * 删除session
 * @param {String} name
 */
GoalsSession.prototype.remove = function(name) {};

/**
 * 清空所有session
 */
GoalsSession.prototype.clear = function() {};

/**
 * session工具类,对浏览器sessionStorage的增删改查进行超做
 */
Goals.prototype.session = new GoalsSession();

var GoalsStorage = function() {this.prototype = new Object();};
/**
 * 添加或者修改storage,如果name存在则是修改,并且对值进行了chaotic加密
 * @param {String} name storage的name值
 * @param {Object|String} value storage的value值
 */
GoalsStorage.prototype.add = function(name, value) {};
/**
 * 获取storage
 * @param {String} name storage的name值
 * @return {Object|String} value storage的value值
 */
GoalsStorage.prototype.get = function(name) {return null;};
/**
 * 删除storage
 * @param {String} name
 */
GoalsStorage.prototype.remove = function(name) {};
/**
 * 清空所有storage
 */
GoalsStorage.prototype.clear = function() {};
/**
 * storage工具类,对浏览器localStorage的增删改查进行超做
 */
Goals.prototype.storage = new GoalsStorage();

var GoaslSecurity = function() {this.prototype = new Object()};

/**
 * 混淆字符串<br/>
 * 提起偶数位倒序拼接上基数位倒序
 * @param {String} str 被混淆的字符串
 * @return {String} str 混淆后的字符串
 */
GoaslSecurity.prototype.disrupt = function(str) {};

/**
 * 转换字符串<br/>
 * 把字符串从末尾依次倒序整理
 * @param {String} str
 * @return {String} str
 */
GoaslSecurity.prototype.invert = function(str) {};

/**
 * 使用密钥对Object对象进行MD5签名
 * @param {Object} obj 签名数据
 * @param {String} secret 密钥
 * @return {String} MD5签名
 */
GoaslSecurity.prototype.sign = function(str, secret) {};

/**
 * 使用密钥对字符串进行AES加密
 * @param {Object} secret 密钥
 * @param {String} str 加密数据
 * @return {String} AES加密后的数据
 */
GoaslSecurity.prototype.aesEncode = function(secret, str) {};

/**
 * 使用密钥对字符串进行AES解密
 * @param {Object} secret 密钥
 * @param {String} str 解密数据
 * @return {String} AES解密后的数据
 */
GoaslSecurity.prototype.aesDecode = function(secret, str) {};

/**
 * 封装的以用户名、密码换取Token的方法(也就是登陆方法)<br/>
 * 对返回的数据进行了基本的处理<br/>
 * 参数为对象<br/>
 * 
 * <b>必要参数</b><br/>
 * (<b>data</b>,包含用户名和密码的对象)<br/>
 * 
 * <b>选填参数</b><br/>
 * (<b>url</b>,请求接口的路径,默认是FastServer的Authority模块中的请求接口)<br/>
 * (<b>success</b>,成功的回调方法)<br/>
 * (<b>error</b>,请求错误的回调方法)<br/>
 * @param {Object} option
 */
GoaslSecurity.prototype.token = function(option) {};

/**
 * 对request模块的ajax进行了封装<br/>
 * 它会获取session中的token相关信息,然后写在对应的地方<br/>
 * 也可以使用encrypt参数对请求数据进行加密<br/>
 * 参数为对象<br/>
 * 
 * <b>必要参数</b><br/>
 * (<b>url</b>,请求接口地址,他会获取Goals.common.PROJECT_SERVER_NAME进行自动拼接)<br/>
 * 
 * <b>选填参数</b><br/>
 * (<b>data</b>,请求接口的数据)<br/>
 * (<b>type</b>,请求接口方式,get,post,put,delete等,不区分大小写)<br/>
 * (<b>encrypt</b>,是否加密请求数据)<br/>
 * (<b>headers</b>,消息头,它是一个对象)<br/>
 * (<b>success</b>,成功的回调方法)<br/>
 * (<b>error</b>,请求错误的回调方法)<br/>
 * @param {Object} settings
 */
GoaslSecurity.prototype.ajax = function(settings) {};



var GoalsUtils = function() {this.prototype = new Object();};

/**
 * 断言,通过判断flag参数,如果flag参数为false,则抛出msg异常
 * @param {Boolean} flag
 * @param {String} msg
 */
GoalsUtils.prototype.assert = function(flag, msg) {};

/**
 * 判断传入的数据是否是null
 * @param {Object} arg
 */
GoalsUtils.prototype.isNull = function(arg) {};
/**
 * 判断传入的数据是否是undefined
 * @param {Object} arg
 */
GoalsUtils.prototype.isUndefined = function(arg) {};
/**
 * 判断传入的数据是否是string
 * @param {Object} arg
 */
GoalsUtils.prototype.isString = function(arg) {};
/**
 * 判断传入的数据是否是number
 * @param {Object} arg
 */
GoalsUtils.prototype.isNumber = function(arg) {};
/**
 * 判断传入的数据是否是boolean
 * @param {Object} arg
 */
GoalsUtils.prototype.isBoolean = function(arg) {};
/**
 * 判断传入的数据是否是function
 * @param {Object} arg
 */
GoalsUtils.prototype.isFunction = function(arg) {};
/**
 * 判断传入的数据是否是date
 * @param {Object} arg
 */
GoalsUtils.prototype.isDate = function(arg) {};
/**
 * 判断传入的数据是否是array
 * @param {Object} arg
 */
GoalsUtils.prototype.isArray = function(arg) {};
/**
 * 判断传入的数据是否是object
 * @param {Object} arg
 */
GoalsUtils.prototype.isObject = function(arg) {};
/**
 * 判断传入的数据是否是regexp
 * @param {Object} arg
 */
GoalsUtils.prototype.isRegExp = function(arg) {};



/**
 * 获取URI链接的参数,如果没有,则返回null
 * @param {String} name 你需要获取的参数名
 * @return {String} value 获取到的参数值,如果没有,则返回null
 */
GoalsUtils.prototype.getURIParameter = function(name) {};

/**
 * 格式化时间
 * @param {String|Date|Number} date 可以是date类型、字符串、或者数字类型的时间戳
 * @param {String} format 你需要得到的时间格式
 * @return {String} formatDate 格式化后的时间
 */
GoalsUtils.prototype.dateFormat = function(date, format) {};

/**
 * 获取传入元素包含的input,select,textarea包含name属性的值
 * @param {Object} selector js对象
 * @return {Object} elem下input,select,textarea所有包含name属性的的值
 */
GoalsUtils.prototype.getTagNameData = function(selector) {return null;};

/**
 * 设置传入元素包含的input,select,textarea包含name属性的值
 * @param {Object} selector js对象
 * @param {Object} data 数据
 */
GoalsUtils.prototype.setTagNameData = function(selector, data) {};

/**
 * 针对某些浏览器在事件触发时没有event值,可以通过此方法直接获取
 * @return {Object} event
 */
GoalsUtils.prototype.event = function() {return null;};

/**
 * 类似jQuery的on方法
 * @param {string} selector js dom对象
 * @param {string} bubbling 需要绑定元素的class值
 * @param {string} event 事件名称
 * @param {callback} fn 触发事件执行的方法
 */
GoalsUtils.prototype.on = function(selector, bubbling, event, fn) {};

/**
 * 给元素绑定hover事件的方法<br/>
 * 因直接使用mouseover和mouseout在元素本身也会多次触发,所以有了此方法进行封装<br/>
 * 它和jQuery的hover方法类似
 * @param {Object} selector js dom对象
 * @param {Function} inFn 移入的回调
 * @param {Function} outFn 移出的回调
 */
GoalsUtils.prototype.hover = function(selector, inFn, outFn) {};

/**
 * 绑定checkbox的全选/全不选<br/>
 * 此方法依赖jQuery
 * @param {Element} elem - 全选的input原生js对象
 * @param {Element} pelem 需要被选中的全局父元素js对象
 * @param {String} clazs 所有需要被选的checkbox的共同class
 */
GoalsUtils.prototype.bindCheckbox = function(elem, pelem, clazs) {};

/**
 * 获取某个element对象下所有clazs被选中的元素<br/>
 * 返回元素element对象数组<br/>
 * 此方法依赖jQuery
 * @param {Element} pelem 需要被获取的父元素js对象
 * @param {String} clazs 需要被获取的checkbox的共同class
 * @return 对象数组
 */
GoalsUtils.prototype.getCheckedElems = function(pelem, clazs) {return null;};

/**
 * 获取某个element对象下所有clazs被选中元素的下标index<br/>
 * 返回元素element对象数组<br/>
 * 此方法依赖jQuery
 * @param {Element} pelem 需要被获取的父元素js对象
 * @param {String} clazs 需要被获取的checkbox的共同class
 * @return 对象数组
 */
GoalsUtils.prototype.getCheckedIndexs = function(pelem, clazs) {return null;};

/** 
 * 联想下拉选择框
 * @param {Element} inputElems 搜索的输入框元素
 * @param {Array} dataArray 查询的数据集
 * @param {Array} searchFields 需要用哪些字段进行查询,数组参数
 * @param {Object} settings 附加参数(选填),对象
 * @param {Number} settings.top 显示数据区域的top值,默认是input输入框的高度以及距离顶部的距离,不需要加px单位
 * @param {Number} settings.left 显示数据区域的left值,默认是input输入框距离左侧的距离,不需要加px单位
 * @param {Number} settings.width 显示数据区域的width值,默认是input输入框的宽度,不需要加px单位
 * @param {Number} settings.maxHeight 显示数据区域的最大高度,默认300
 * @param {Boolean} settings.nullValueShow 当搜索输入框的数据为空时是否全部检索
 * @param {Boolean} settings.highlight 是否高亮显示
 * @param {String} settings.bottomHTML 显示在底部的元素
 * @param {String} settings.joint 当查询多个字段时.
 * @param {Callback|Function} settings.blurFn 光标移出的回调,可以接收data值,如果存在,则是选中,否则是直接移出.
 * @param {Callback|Function} settings.focusFn 光标移入的回调
 * @param {Callback|Function} settings.keyupFn 按键弹起回调
 */
GoalsUtils.prototype.pulldown = function(inputElems, dataArray, searchFields, settings) {};

/**
 * Goals的工具类,它里面封装了许多常用方法,当然,你也可以单独使用它
 */
Goals.prototype.utils = new GoalsUtils();

var GoalsPrompt = function() {this.prototype = new Object()};

/**
 * 消息加载框,消息加载框全局只会存在一个,如果重复调用,会以最后一次调用的信息为主.
 * @param {String} msg 提示的信息
 */
GoalsPrompt.prototype.showLoading = function(msg) {};

/**
 * 关闭loading框
 */
GoalsPrompt.prototype.hideLoading = function() {};

/**
 * 消息提示框,类似js的alert,它需要手动点击确认后关闭.
 * @param {String} msg
 * @param {Callbacl|Function} callback
 */
GoalsPrompt.prototype.info = function(msg, callback) {};

/**
 * 成功提示框
 * @param {String} msg
 * @param {Callbacl|Function} callback
 */
GoalsPrompt.prototype.success = function(msg, callback) {};

/**
 * 错误提示框
 * @param {String} msg
 * @param {Callbacl|Function} callback
 */
GoalsPrompt.prototype.error = function(msg, callback) {};

/**
 * 警告提示框
 * @param {String} msg
 * @param {Callbacl|Function} callback
 */
GoalsPrompt.prototype.warn = function(msg, callback) {};

/**
 * 自动消失提示框
 * @param {String} type [success|error|warn|info]
 * @param {String} msg
 * @param {Function|Callback} callback 弹框消失的回调
 */
GoalsPrompt.prototype.toast = function(type, msg, callback) {};

/**
 * 确认操作提示框
 * @param {String} msg 提示信息
 * @param {Object} okFn 点击确认后执行的回调
 * @param {Object} cancelFn 点击取消后执行的回调
 */
GoalsPrompt.prototype.confirm = function(msg, okFn, cancelFn) {};

/**
 * Goals下的各种提示框类
 */
Goals.prototype.prompt = new GoalsPrompt();

var GoalsPaging = function(settings) {this.prototype = new Object()};

/**
 * 分页插件的参数值,包含了初始化时传入的参数.<br/>
 * 它是合并默认参数后的值.<br/>
 * 你可以通过修改它的data值来达到setData的效果.<br/>
 * 你在data中设置的pageStart和pageSize是无效的.
 * @type {Object}
 */
GoalsPaging.prototype.option = null;

/**
 * 开始查询的分页条数,默认0,你可以直接修改它
 * @type {Number}
 */
GoalsPaging.prototype.pageStart = 0;

/**
 * 每次查询的条数,默认10,你可以直接修改它
 * @type {Number}
 */
GoalsPaging.prototype.pageSize = 0;

/**
 * 当前分页插件加载的数据缓存,你可以通过它取到你请求过的所有数据.<br/>
 * 当然,如果你调用了clearBuffer方法清除过数据,请忽视上面那句话.
 * @type {Object}
 */
GoalsPaging.prototype.buffer = null;

/**
 * 当前发起的请求是否是第一次发起的<br/>
 * 后台可以根据此属性判断某些数据是否随着首次请求时查询.
 * @type {Boolean}
 */
GoalsPaging.prototype.isFirstTime = false;

/**
 * 回调方法,此方法需要自己实现,将arr数组解析成html代码,然后返回即可.
 * @param {Array} arr 接口查询的数组数据
 */
GoalsPaging.prototype.template = function(arr) {return null;};

/**
 * 回调方法,此方法需要自己实现,才分页加载完成后的回调.
 * @param {Object} data 接口查询的完整数据
 */
GoalsPaging.prototype.callback = function(data) {return null;};

/**
 * 实现翻页的查询<br/>
 * 可以传入数字,表示从多少条开始查询.<br/>
 * 它在内部使用的时候是传入的elements对象,取page属性.
 * @param {Number|Object} e
 */
GoalsPaging.prototype.run = function(e) {};

/**
 * 设置接口查询的参数,以达到设置查询数据的效果.<br/>
 * 设置后它会自动调用查询,不要再次手动调用.<br/>
 * 注: 此处obj中设置pageStart和pageSize是无效的.
 * @param {Object} obj
 */
GoalsPaging.prototype.setData = function(obj) {};

/**
 * 实现开始解析数据,调用template和callback的方法<br/>
 * 它的内部实现是请求接口后拿到数据调用它.<br/>
 * 你可以自己封装或使用它来实现固定数据分页效果.
 * @param {Object} data
 */
GoalsPaging.prototype.load = function(data) {};

/**
 * 开始执行请求接口获取数据<br/>
 * 它或检查是否存在加载过的缓存,如果没有缓存的情况下,才会请求接口.<br/>
 * 你也可以手动设置各种属性后调用它.
 */
GoalsPaging.prototype.start = function() {};

/**
 * 重新加载当前页数的数据<br/>
 * 此方法一般在于增删改查后调用.<br/>
 * 它会清除缓存中的当前页的数据,在从新查询<br/>
 * 你也可以手动设置各种属性后调用它.
 */
GoalsPaging.prototype.reload = function() {};

/**
 * 请求当前分页插件的所有缓存<br/>
 */
GoalsPaging.prototype.clearBuffer = function() {};

/**
 * 分页插件,具体使用方法请参见各自使用的包.<br/>
 * <b>必要参数</b><br/>
 * (<b>url</b>,请求接口地址)<br/>
 * (<b>dataElem</b>,分页数据的容器)<br/>
 * (<b>pageElem</b>,分页插件的容器)<br/>
 * 
 * <b>选填参数</b><br/>
 * (<b>pageStart</b>,分页的开始条数,默认0)<br/>
 * (<b>pageSize</b>,每页多少条,默认10)<br/>
 * (<b>data</b>,初始化需要的数据)<br/>
 * (<b>type</b>,请求接口方式,分页一般都为get请求)<br/>
 * (<b>pageListKey</b>,获取list数据的键(key),在你需要对返回数据重新做封装的时候需要用到,默认'list')<br/>
 * (<b>pageCountKey</b>,获取count数据的键(key),在你需要对返回数据重新做封装的时候需要用到,默认'count')<br/>
 * @param {Object} settings
 */
Goals.prototype.paging = GoalsPaging;

var GoalsPopup = function(array) {this.prototype = new Object()};

/**
 * 在弹框即将弹出前的回调方法.<br/>
 * 可以接受参数'key',它的值是弹框的popup属性.
 * @param {key}
 */
GoalsPopup.prototype.onshow = function(key) {};

/**
 * 初始化弹框<br/>
 * 参数为对象数组<br/>
 * <b>必要参数</b><br/>
 * (<b>elem</b>,popup的elements对象)<br/>
 * 
 * <b>选填参数</b><br/>
 * (<b>animate</b>,popup显示的动画效果,(shade,渐变,left-right,从左到右,right-left,从右到左,lateral-spread,横向扩张,vertical-spread,纵向扩张))<br/>
 * (<b>okFn</b>,点击确认的回调,需要接收一个参数,参数是隐藏此弹框的方法)<br/>
 * (<b>cancelFn</b>,点击关闭的回调,需要接收一个参数,参数是隐藏此弹框的方法)<br/>
 * <br/>
 * 你可以直接使用它来调用popup弹框的popup属性方法.
 * @param {Array|Object} settings 对象数组
 */
Goals.prototype.popup = GoalsPopup;

var GoalsValidate = function(array) {this.prototype = new Object()};

/**
 * 表单所有包含name属性的data对象,包含内容较多,你可以是打印一下查看.
 * @type {Object}
 */
GoalsValidate.prototype.data = null;

/**
 * 传入的elem对象
 * @type {Object}
 */
GoalsValidate.prototype.elem = null;

/**
 * 重新绑定表单验证,针对表单内容改变后使用.
 */
GoalsValidate.prototype.rebind = function() {};

/**
 * 清除表单的所有数据,select选择框选择至第一个.
 */
GoalsValidate.prototype.clear = function() {};

/**
 * 验证表单并获取数据<br/>
 * 它会判断需要验证的表单,如果有验证不通过的,则光标移出对应的输入框.<br/>
 * 如果验证通过,返回data数据,否则返回null.
 * @return {Object} 如果验证通过,返回表单数据,否则返回null.
 */
GoalsValidate.prototype.verify = function() {};

/**
 * 表单验证插件
 * @param {Object} elem 表单elements元素
 */
Goals.prototype.validate = GoalsValidate;

var GoalsLanguage = function() {};

/**
 * 获取当前设置的语言
 * @return {String} 当前语言
 */
GoalsLanguage.prototype.current = function() {return null;};

/**
 * 设置当前的语言
 * @param {String} 当前语言
 */
GoalsLanguage.prototype.set = function(language) {};

/**
 * Goals下对语言操作的类
 */
Goals.prototype.language = new GoalsLanguage();