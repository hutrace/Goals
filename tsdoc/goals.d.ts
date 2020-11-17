/**
 * ajax请求参数
 */
declare interface AjaxData {
    /** 请求地址 */
    url:string
    /** 请求uri，该值是方法内部生成，表示完整的请求连接 */
    uri?:string
    /** 请求类型 */
    type?:string
    /** 请求数据 */
    data?:object
    /** 是否同步请求，默认false（异步） */
    anysc?:boolean
    /**
     * 是否解析data数据，默认true（解析）
     * 
     * 正常情况写都为true，如果你需要上传文件等特殊操作，则设置为false
     */
    parseData?:boolean
    /**
     * 请求的消息头
     * 
     * 默认设置了Content-Type为'application/json'
     */
    headers?:object
    /** 设置超时时间，单位毫秒（ms），默认无超时时间 */
    timeout?:number
    /**
     * 响应数据类型
     * 
     * 根据响应的Content-Type进行判断，如果不包含对应的解析类型，则会返回字符串
     * 
     * 默认支持json、xml，你可以使用`Goals.request.setAjaxDataResolver(string, function)`进行扩展
     */
    resultType?:string
    /**
     * 成功回调，当请求成功并获得响应数据时，会调用该回调方法。
     * @param data 响应的内容，根据解析器判断内容类型
     * @param xhr 本次请求的`XMLHttpRequest`对象
     */
    success?:(data:any, xhr?:XMLHttpRequest) => void
    /**
     * 请求错误回调，当请求超时和请求出错时，会调用该回调方法。
     * @param err 包含错误信息的对象
     */
    error?:(err:object) => void
    /**
     * 请求进度，适用于文件上传操作
     * @param e 包含进度信息的对象
     */
    progress?:(e:object) => void
}
/**
 * JSONP请求参数
 */
declare interface JsonpData {
    /** 请求地址 */
    url:string
    /**
     * 请求的回调域，你必须使用此值将请求的内容包裹起来
     * 
     * 例如：`callbackName(object)`
     */
    callbackName:string
    /**
     * 请求成功的回调，该回调方法会将`callbackName(object)`中的`object`作为参数传入
     * @param js `callbackName`中的包裹对象
     */
    okFn?:(js:object) => void
    /**
     * 请求失败的回调，该回调方法会将错误详情作为参数传入
     * @param err 错误详情
     */
    errFn?:(err:object) => void
    /**
     * 请求超时时间，默认不超时。
     */
    timeout?:number
}
/**
 * 自定义XML标签对象
 */
declare interface XMLNode {
    
    /** 当前xml的标签名称 */
    tag?:string
    /** 当前xml标签中的文本内容 */
    text?:string
    /** 
     * 是否是单类型标签
     * 
     * 例如：input等单标签
     */
    single?:boolean
    /**
     * 标签中的所有属性
     * 
     * key-value形式对象
     * 
     * key表示属性名，value表示属性值
     */
    attr?:{[key:string]:string}
    /**
     * 子标签数组
     */
    children?:XMLNode[]
    /**
     * 获取该节点下的所有内容
     * 
     * 该方法会遍历所有子孙节点，然后生成字符串返回
     * @param cache 是否启用缓存，如果启用，该返回的内容会存储在节点中，后续再调用方法会直接取缓存的内容，而不会重新遍历，默认为`false`，不启用
     * @returns 该节点下的所有字符串
     */
    inner?(useCache?:boolean):string
    /**
     * 获取该节点以及该节点下的所有内容
     * 
     * 该方法获取自身信息后通过调用`inner()`实现
     */
    outer?():string
}
/**
 * 初始化Goals的参数对象
 */
declare interface GoalsInitSetting {
    /**
     * 设置`Goals.common.PROJECT_NAME`的值
     * 
     * 当前项目的名称，`Goals`在请求某些路径时会通过它作为根目录去寻找，默认为''空字符串
     */
    project?:string
    /**
     * 设置`Goals.common.SERVER_NAME`的值
     * 
     * 使用`security`安全类发送请求时，在`url`的前面统一添加此值，默认为''空字符串
     */
    server?:string
    /**
     * 首次打开的页面，如果不设置则不会打开页面
     */
    page?:string
    /**
     * 设置`Goals.common.CONTAINER`的值
     * 
     * 页面容器对象，所有的页面内容会在这个容器中生成，默认是`document.body`
     */
    container?:Element
    /**
     * 设置`Goals.common.VIEW_CALLBACK_NAME`的值
     * 
     * 页面JavaScript中最外层包裹方法的名称，默认为'GoalsPage'
     */
    viewCallbackName?:string
    /**
     * 该属性为保留属性，当前版本暂未实现它的相关功能。
     * 
     * 设置`Goals.common.DEBUG`的值
     * 
     * 是否以debug模式启动，默认为false
     */
    debug?:boolean
    /**
     * 设置`Goals.common.HASH_DELIMITER`的值
     * 
     * uri中的hash值的分割符，它的作用是在于初次简单的验证hash值的正确性，默认为'!'
     */
    hashDelimiter?:string
    /**
     * 设置`Goals.common.HASH_PARAMS_DELIMITER`的值
     * 
     * uri中的参数值的分割符，它的作用是对uri中的参数进行提取，默认为'='
     */
    hashParamsDelimiter?:string
    /**
     * 设置`Goals.common.HASH_ENCRYPT`的值
     * 
     * 是否加密uri中的hash值，加密会使用chaotic加密，加密后的字符长度会大量变长，使用加密的用作在于更好的保护你的uri地址，默认为false
     */
    hashEncrypt?:boolean
    /**
     * 最大可缓存多少个页面，页面缓存可大幅度提升页面二次加载速度
     * 
     * 值说明：
     * > -1表示无限制
     * 
     * > 0表示不缓存
     * 
     * 默认为10
     */
    pageMaxinum?:number
    /**
     * 页面获取值的表达式包裹的前面部分，例如：`${}`中的`\\${`
     * 
     * 注意，这里的`$`是加了`\\`来转义的，在使用的时候需要注意哪些符号需要转义，哪些不需要，
     * 在正则中是`\`，而此处是字符串，所以是`\\`
     * 
     * 默认为`\\${`
     */
    expressionStart?:string
    /**
     * 页面获取值的表达式包裹的后面部分，例如：`${}`中的`}`
     * 
     * 默认为`}`
     */
    expressionEnd?:string
}
/**
 * 表达式`XML`标签对象
 */
declare interface GoalsViewXMLNode extends XMLNode {
    /**
     * 当前标签生成的element对象
     */
    elem:Element
    /**
     * 表达式对象
     * 
     * `key`存储使用表达式的`html`的属性，`value`存储的表达式数组
     */
    exps:{[key:string]:string[]}
    /**
     * 文本表达式
     */
    textExps:string
    /**
     * 属性表达式
     * 
     * `key`为`html`的属性，`value`为`html`属性的值
     */
    attrExps:{[key:string]:string}
}
/**
 * `GoalsView`下的私有标签空间值对象
 */
declare interface GoalsViewSpaceOnce {
    /**
     * 表达式属性，如果是`html`标签的属性，则此处存的就是此属性，如果是指，则是`GoalsText`
     */
    attr?:string
    /**
     * `xml`元素，单个标签
     */
    node?:GoalsViewXMLNode
    /**
     * 元素绑定内容（文本）的方法
     * 
     * 执行此方法即可替换某个页面`data`键（`key`）对应元素对应的内容（文本）
     * @param key 页面`data`的键
     * @param data 页面`data`
     */
    textFunc?(key:string, data:object):void
    /**
     * 元素绑定属性的方法
     * 
     * 执行此方法即可替换某个页面`data`键（`key`）对应元素对应的属性内容
     * @param key 页面`data`的键
     * @param data 页面`data`
     */
    attrFunc?(key:string, data:object):void
}
/**
 * `GoalsView`下的私有标签空间对象
 */
declare interface GoalsViewSpace {
    [key:string]:GoalsViewSpaceOnce[]
}

/**
 * Goals下网络请求模块，通过它你可以发送HTTP请求以及其它请求
 */
declare class GoalsRequest {

    /**
     * Ajax方法，发送http请求，也可以上传文件。
     */
    ajax(opts:AjaxData):void

    /**
     * 添加设置Ajax的响应数据解析器，如果设置的类型已经存在，将会覆盖之前的解析方法。
     * @param contentType 需要解析的响应类型`Content-Type`，例如`appliction/json`
     * @param parseFn 解析方法的实现方法，方法中可以接收`string`参数，该参数是响应的具体内容。
     */
    setAjaxDataResolver(contentType:string, parseFn:(responseText:string) => void):void

    /**
     * 发起Jsonp请求
     */
    jsonp(opts:JsonpData):void

}

/**
 * Goals下混淆加密工具类
 */
declare class GoalsChaotic {
    /**
     * 混淆加密字符串
     * @param str 需要加密的字符串
     * @returns 加密后的字符串
     */
    encode(str:string):string

    /**
     * 混淆解密字符串
     * @param str 需要解密的字符串
     * @returns 解密后的字符串
     */
    decode(str:string):string
}

/**
 * Goals下XML工具类，包含XML解析等常用方法
 */
declare class GoalsXML {
    /**
     * 将xml字符串解析成JSON对象
     * @param text xml字符串
     */
    parse(text:string):XMLNode[]
    /**
     * 将xml字符串解析成Element对象
     * 
     * 该方法使用浏览器自带的`DOMParser.parseFromString`方法或者`ActiveXObject.loadXML`方法
     * @param text xml字符串
     */
    elems(text:string):Element[]
}

/**
 * Goals下存储工具类，主要包含浏览器存取数据，它的好处在于可以直接存入对象，且它是加密过的
 */
declare class GoalsStorage {
    /**
     * 添加或者修改存储，如果name存在则是修改，并且对值进行了chaotic加密
     * 
     * 如果传入的value为null/undefined，都会存为字符串null
     * @param name 存储的键
     * @param value 存储的值，可以是对象或字符串，如果为null/undefined，都会存为字符串null
     */
    add(name:string, value:string|object|any):void
    /**
     * 根据存储的键获取存储的值
     * 
     * 如果取得的值为null/undefined/字符串null，都会返回null
     * @param name 存储的键
     * @returns 存储的值，如果取得的值为null/undefined/字符串null，都会返回null
     */
    get(name:string):string|object|any
    /**
     * 根据存储的键删除存储的键值对
     * @param name 存储的键
     */
    remove(name:string):void
    /**
     * 清除所有的存储的键值对
     */
    clear():void
}

/**
 * Goals下cookie工具类，可对浏览器的cookie值进行增删改查，且它是加密过的
 */
declare class GoalsCookie {
    /**
     * 添加或者修改Cookie，如果name存在则是修改，并且对值进行了chaotic加密
     * @param name Cookie的存储键
     * @param value Cookie的存储值
     * @param expires Cookie的过期时间，单位秒，如果不传入此参数，则在浏览器关闭时清除Cookie
     */
    add(name:string, value:string, expires?:number):void
    /**
     * 根据Cookie的存储键获取Cookie值
     * @param name Cookie的存储键
     * @returns Cookie的存储值
     */
    get(name:string):string
    /**
     * 根据Cookie的存储键删除Cookie值
     * @param name Cookie的存储键
     */
    remove(name:string):void
}

/**
 * Goals下session工具类，对浏览器sessionStorage进行增删改查操作，它的好处在于可以直接存入对象，且它是加密过的
 */
declare class GoalsSession {
    /**
     * 添加或者修改Session，如果name存在则是修改，并且对值进行了chaotic加密
     * 
     * 如果传入的value为null/undefined，都会存为字符串null
     * @param name Session存储的键
     * @param value Session存储的值，可以是对象或字符串，如果为null/undefined，都会存为字符串null
     */
    add(name:string, value:string|object|any):void
    /**
     * 根据Session存储的键获取Session值
     * @param name Session存储的键
     * @returns Session存储的值，对象或字符串，如果取得的值为null/undefined/字符串null，都会返回null
     */
    get(name:string):string|object|any
    /**
     * 根据Session存储的键删除存储的键值对
     * @param name Session存储的键
     */
    remove(name:string):void
    /**
     * 清空所有Session存储
     */
    clear():void
}

/**
 * 公共储存区域，它包含了一些公共属性。
 * 
 * 此类可自定义扩展属性，但是它会有一些本身就存在的值，自定义时可不要把它们覆盖了哦！
 */
declare class GoalsCommon {
    /**
     * 当前项目的名称，`Goals`在请求某些路径时会通过它作为根目录去寻找
     * 
     * 默认为''空字符串
     * 
     * 它是只读的，你可以在初始化的时候设置它
     */
    PROJECT_NAME:string
    /**
     * 使用`security`安全类请求服务端时，在`url`的前面统一添加的值
     * 
     * 通常它的值为服务端项目名或者`nginx`的拦截名称
     */
    SERVER_NAME:string
    /**
     * 页面JavaScript中最外层包裹方法的名称
     * 
     * 默认为'GoalsPage'
     * 
     * 它是只读的，你可以在初始化的时候设置它
     */
    VIEW_CALLBACK_NAME:string
    /**
     * 页面容器对象，所有的页面内容会在这个容器中生成
     * 
     * 默认为`document.body`
     * 
     * 它是只读的，你可以在初始化的时候设置它
     */
    CONTAINER:Element
    /**
     * 该属性为保留属性，当前版本暂未实现它的相关功能。
     * 
     * 否以debug模式启动
     * 
     * 默认为false
     * 
     * 它是只读的，你可以在初始化的时候设置它
     */
    DEBUG:boolean
    /**
     * uri中的hash值的分割符，它的作用是在于初次简单的验证hash值的正确性
     * 
     * 默认为'!'
     * 
     * 它是只读的，你可以在初始化的时候设置它
     */
    HASH_DELIMITER:string
    /**
     * uri中的参数值的分割符，它的作用是对uri中的参数进行提取
     * 
     * 默认为'='
     * 
     * 它是只读的，你可以在初始化的时候设置它
     */
    HASH_PARAMS_DELIMITER:string
    /**
     * 是否加密uri中的hash值
     * 
     * 加密会使用chaotic加密，加密后的字符长度会大量变长，使用加密的用作在于更好的保护你的uri地址
     * 
     * 默认为false
     * 
     * 它是只读的，你可以在初始化的时候设置它
     */
    HASH_ENCRYPT:boolean
    /**
     * 最大可缓存多少个页面，页面缓存可大幅度提升页面二次加载速度
     * 
     * 值说明：
     * > -1表示无限制
     * 
     * > 0表示不缓存
     * 
     * 默认为10
     */
    PAGE_MAXINUM:number
    /**
     * 页面表达式的正则表达式
     * 
     * 可以在初始化时通过`expressionStart`和`expressionEnd`指定
     */
    EXPRESSION_REG:RegExp
    /**
     * 表达式的开始标识符长度，就是`expressionStart`的长度
     * 
     * 默认为2，`\\${`（`\\$`就是`$`，在计算长度的时候会忽略转义符）的长度为2
     */
    EXPRESSION_LENGTH_START:number
    /**
     * 表达式的结束标识符长度，就是`expressionEnd`的长度
     * 
     * 默认为1，`}`的长度为1
     */
    EXPRESSION_LENGTH_END:number
}

/**
 * 页面对象
 */
declare namespace GoalsPage {
    /**
     * 储存对象（键值对key-value）对象
     */
    type Record<K extends keyof any, T> = {
        [P in K]:T;
    }
    /**
     * 用于遍历属性，生成提示
     */
    type Partial<T> = {
        [P in keyof T]?:T[P];
    }
    /**
     * 当前对象`data`属性列表
     */
    type DataOption = Record<string, any>
    /**
     * 当前对象自定义方法/属性列表
     */
    type CustomOption = Record<string, any>
    /**
     * 页面属性
     */
    type OptionView<TData extends DataOption, TMethod extends CustomOption> = Partial<TMethod> & InstanceView<TData>;
    /**
     * 组件的属性
     */
    type OptionComponent<TData extends DataOption, TMethod extends CustomOption> = Partial<TMethod> & InstanceComponent<TData>;

    /**
     * 组件签名索引构造器
     */
    interface ComponentConstructor {
        <
            TData extends DataOption,
            TMethod extends CustomOption
        >(
            /** 组件名称 */
            name:string,
            options?:OptionComponent<TData, TMethod>
        ):void
    }
    /**
     * 页面签名索引构造器
     */
    interface ViewConstructor {
        <
            TData extends DataOption,
            TMethod extends CustomOption
        >(
            options?:OptionView<TData, TMethod>
        ):void
    }

    /**
     * tag实例，包含了完整的属性与方法
     */
    interface InstanceComponent<D extends DataOption> extends Page<D>, GoalsComponent {}
    
    /**
     * 页面实例，包含了完整的属性与方法
     */
    interface InstanceView<D extends DataOption> extends Page<D>, GoalsView {}
    
    interface Page<D extends DataOption> {
        /**
         * 当前页面的通讯数据。可通过直接设置它的属性值来改变对应绑定页面的地方
         * 
         * 页面加载时，`data`中的值会绑定至页面`${key}`对应的值
         * 
         * 如果要使改变`data`中的某些属性，请使用`setData`方法，不要直接改变当前`data`
         * 
         * **注意：所有涉及到的第一层键（`key`）一定要在`data`中初始化一次，哪怕是初始化成`null`，否则会出现获取不到值的情况**
         */
        data?:D
        /**
         * 设置页面的数据，传入对象（key-value），根据修改了的`key`去修改页面对应的内容。
         * 
         * 示例示例：`this.setData({key: value})`
         * 
         * `this.setData({key: value})`设置值是直接覆盖原先的值
         * 
         * 你也可以使用`this.data.key = value`直接赋值的方式，需要明确它们的区别（详见data属性）
         * 
         * 该方法是只读的，你只能调用它。
         * @param data 初始化中`data`中所包含的属性
         */
        setData?(data: Partial<D>):void
    }
    /**
     * 在组件中使用的一些表达式操作的方法
     */
    interface GoalsComponentUtilsFuncs {
        /**
         * 去除表达式的标识，比如表达式为`${aaa}`或者`${abc ? def : 'zi fu chuan'}`，去除后就是`aaa`或者`abc ? def : 'zi fu chuan'`
         * @param expression 完整的表达式
         * @returns 去除标识后的表达式/变量
         */
        elem_exps_remove_identify(expression:string):string
        /**
         * 提取表达式中的变量部分，去掉了所有的值，将变量全部提取出来
         * @param expression 表达式内容，具体的表达式，如：`data.name`、`hello`、`a == b ? c : b`等
         * @param norepeat 是否去除重复变量
         * @returns 表达式中包含的变量数组
         */
        elem_exps_extract_variable(expression:string, norepeat?:boolean):string[]
        /**
         * 设置`Element`对象的属性
         * @param elem 元素
         * @param name 属性名
         * @param value 属性值
         */
        set_element_attribute(elem:Element, name:string, value:string):void
    }
    /**
     * 组件对象，所有组件都必须存在页面/组件中，不可单独使用
     * 
     * 所有组件创建的时候都会直接创建一个Element对象，并放置在组件使用的位置，你可以通过`tag`属性指定创建的标签，默认为`div`
     * 
     * 组件标签上正常是支持常规属性的，当然，也有特殊例外，使用某个组件时务必查看组件的说明
     */
    interface GoalsComponent extends GoalsPublic {
        /**
         * 当前组件的`ID`标识符，可通过使用组件标签上`id="xxx"`来指定，注意，此`id`并非是标签的`id`，而是组件的`id`
         * 
         * 如果不指定，将会默认生存随机字符串
         */
        id?:string
        /**
         * 当前组件标签本身的`node`节点，如果它有`children`属性
         * 
         * 你可以根据组件的作用来决定`children`属性的去留，当存在`children`属性的时候，会直接使用`children`属性，`view`属性是不生效的
         * 
         * 如果你不想使用此`children`属性，你也可以把它删除`delete node.children`，然后在全局对象中添加`view`属性
         */
        node?:XMLNode
        /**
         * 所有组件创建的时候都会直接创建一个Element对象，并放置在组件使用的位置，你可以通过该属性指定创建的标签，默认为`div`
         */
        tag?:string
        /**
         * 支持初始化自定义的属性，如果组件中有属性允许在初始化的时候定义的属性，就可以放在这里面
         */
        customProperty?:object
        /**
         * 当前组件（包括子孙组件）所有使用到的`data`属性
         * 
         * 不要直接在此值上进行添加属性或值，否则会出现数据不匹配的情况，如有需要，使用`addUsespace`方法
         */
        __usespace__?:object
        /**
         * 当前组件的父级页面/组件
         */
        __parent__?:GoalsView|GoalsComponent
        /**
         * 开始创建组件`Element`元素之前的回调操作，你可以通过此方法处理你需要的结合的`html`字符或者`node`对象
         * 
         * @param util 针对表达式的一些方法
         */
        oncreate?(util:GoalsComponentUtilsFuncs):void
        /**
         * 向当前对象添加使用过的键，该方法只能在`oncreate`中调用才有效果，用于自定义扩展当前组件使用页面的`data`内容
         * @param key 使用过属性的键
         */
        addUsespace?(key:string):void
        /**
         * 添加表达式空间
         * @param key 表达式空间的键
         * @param value 表达式空间值
         */
        addSpace?(key:string, value:GoalsViewSpaceOnce[]):void
    }
    /**
     * 页面对象
     */
    interface GoalsView extends GoalsPublic {
        /**
         * 当前页面的请求url值，它其实就是浏览器的hash值
         */
        hash?:string
        /**
         * 是否不引用与页面同级目录相同名称的`css`文件
         * 
         * false表示需要引用，true表示不需要引用
         * 
         * 不设置默认为false，需要引用
         */
        notImportDefaultCss?:boolean
        /**
         * 当前页面引用的额外组件
         */
        componentLibs: [],
        /**
         * 当前页面接收的参数，从其它页面传入的参数
         */
        receive?:string|object
        /**
         * 重新加载页面，相当于刷新当前页面，此处的刷新不是刷新浏览器，而是在框架中刷新当前页面。
         * 
         * `reload`方法会重新加载`js`，并重新创建当前页面的`GoalsView`对象
         * 
         * 该方法是只读的，你只能调用它。
         */
        reload?():void
        /**
         * 页面后退，可指定后退页面的数量，默认为返回上一级
         * 
         * 如果指定数量超出页面栈数量，则返回至第一个页面
         * 
         * @param delta 返回页面的数量，默认1，返回上一级
         */
        back?(delta?:number):void
    }
    /**
     * 页面与组件的公共属性/方法
     */
    interface GoalsPublic {
        /**
         * 当前页面的打开`url`地址，该值为系统生成
         */
        url?:string
        /**
         * 当前页面元素对象
         */
        document?:HTMLElement
        /**
         * 引用的`html`文件或者`html`字符串，`html`文件支持字符串
         * 
         * 该字符串支持路径与`html`文本
         * 
         * 路径支持
         * > 网络路径（网络路径是通过`ajax`请求，需要注意跨域问题）
         * > 绝对路径（绝对路径是以容器`html`问标准）
         * > 相对路径（相对路径是按照当前`js`文件而言）
         * 
         * `html`文本支持
         * > 需要注意，`goals`的默认表达式为`${}`，该表达式和`js`的模板字符串冲突，要么就自定义`goals`表达式，要么就不使用`js`模板字符串（使用纯字符串拼接）
         */
        view?:string
        /**
         * 引用的`js`或者`css`文件路径，该路径支持相对路径与绝对路径
         * 
         * **注意：相对路径是相对当前`js`文件的路径**
         */
        script?:string[]
        /**
         * 当前页面引用的其它`js`文件
         */
        javascript?:string[]
        /**
         * 加载`js`是同步还是异步，异步加载效率会很高，但是如果导入的多个`js`文件中有需要依赖另外导入的`js`文件的情况，就只能使用同步了
         * 
         * 同步是按照顺序，一个加载完成后再继续下一个，一直到结束
         * 
         * 异步是直接全部开始加载
         * 
         * 默认为`false`异步
         */
        syncload?:boolean
        /**
         * 是否重复加载已经载入过的`js`文件
         * 
         * 如果载入的`js`中没有页面静态缓存，不需要重复加载，以提高页面打开效率
         * 
         * 默认为`false`不重复加载
         */
        repeatload?:boolean
        /**
         * 当前页面引用的其它`css`文件
         */
        css?:string[]
        /**
         * 获取当前页面或组件下的所有子组件
         */
        components?:GoalsComponent[]
        /**
         * 根据`id`查找组件，该方法会递归所有子孙组件，直到找到为止，如果找到对应`id`的组件，就立即返回。
         * @param id 组件的id
         * @returns 组件对象或者`null`
         */
        findComponentById?(id:string):GoalsComponent | null
        /**
         * 查找页面上的`Element`，支持`goals-id`选择器、以及原生`querySelector/querySelectorAll`支持的选择器
         * 
         * `goals-id`选择器是`Goals`定义的一种选择器，在使用中强烈建议使用`goals-id`选择器，请看下面使用示例
         * 
         * `goals-id`选择器的优点在于：
         * > 1. 查找`Element`不存在耗时问题，它是存在对象中的，查找相当于直接去对象中取
         * > 2. 在 **单页面** 程序中，多个 **页面** 导致`id`重复的情况非常常见，而使用`id`选择器会导致选择不到需要的`Element`，
         * `goals-id`选择器完美的避免了这种情况，它只需要保证在 **当前页面** 中保持唯一即可
         * 
         * 使用示例：
         * 
         * #### xxx.html
         * ```html
         * <div goals-id="test"></div>
         * ```
         * #### xxx.js
         * ```js
         * GoalsPage({
         *    onready: function() {
         *        var elem = this.find('g:test');
         *    }
         * })
         * ```
         * 
         * 该方法是只读的，你只能调用它。
         * @param selector 选择器，支持`goals-id`、`id`、`class`、`tag`等原生支持的选择器
         */
        find?(selector:string):HTMLElement | null
        /**
         * 显示当前页面，显示前会触发`onshow`
         * 
         * 该方法是只读的，你只能调用它。
         */
        show?():void
        /**
         * 隐藏当前页面，隐藏前会触发`onhide`
         * 
         * 该方法是只读的，你只能调用它。
         */
        hide?():void
        /**
         * 卸载当前页面，它会完全关闭当前页面
         * 
         * `unload`会优先调用`hide`方法，再调用`onunload`
         * 
         * 为了保证`hide`动画能完全执行，完全卸载会延迟`1000`毫秒，但是页面栈中在调用`unload`之后就已经不存在此页面了
         * 
         * 该方法是只读的，你只能调用它。
         */
        unload?():void
        /**
         * 页面显示的时候触发的函数
         * 
         * 你可以在这里开始做页面处理了
         */
        onshow?():void
        /**
         * 页面初始化完成，并且包也完全导入了之后触发的函数
         * 
         * 你可以在这里开始调用引用的其它包中包含的方法
         */
        onready?():void
        /**
         * 页面卸载时触发的函数
         */
        onunload?():void
        /**
         * 页面隐藏时触发的函数
         */
        onhide?():void
        /**
         * 显示页面的执行者，它需要实现将页面显示的功能，你可以重新它来实现显示页面的动画效果
         * 
         * 在页面中它执行了一个延迟`200ms`的延迟显示，而组件中只执行了一句代码`this[0].style.display = 'block'`
         * 
         * **注意：自定义动画的时候，一定要先调用`this[0].style.display = 'block'`，你可以使用`opacity`等属性来过渡动画，
         * `this[0].style.display = 'block'`一定要同步执行，千万不要在异步方法中执行，否则`onshow`和`onready`会出现找不到页面的情况**
         */
        showExecutor?():void
        /**
         * 隐藏页面的执行者，它需要实现将页面隐藏的功能，你可以重新它来实现显示隐藏的动画效果
         * 
         * 它默认只执行了一句代码`this[0].style.display = 'none'`
         */
        hideExecutor?():void

        
        /**
         * **隐藏属性**
         * 
         * 页面栈中的表达式执行空间，储存了所有表达式/变量的绑定
         */
        __space__?:GoalsViewSpace
        /**
         * 缓存数据，该数据才是真正意义上的`data`
         */
        __buffer__?:object
        /**
         * **隐藏属性**
         * 
         * `goals-id`选择器储存对象
         */
        __goalsids__?:{[key:string]:GoalsViewXMLNode}
        /**
         * **隐藏属性**
         * 
         * 页面原始`data`，用于`reload`时重新加载页面
         */
        __originaldata__?:object
        /**
         * **隐藏属性**
         * 
         * 缓存`html`的`XMLNode`对象，用于`reload`时不需要重新加载`html`文件
         */
        __nodes__?:XMLNode[]
        /**
         * **隐藏属性**
         * 
         * 缓存的`css`标签，用于页面重新显示时更快加载
         */
        __csstags__?:HTMLLinkElement[]
        /**
         * **隐藏方法**
         * 
         * 清除页面`css`样式
         */
        __clearstyle__?():void
    }
}

/**
 * 页面执行方法
 */
declare let GoalsPage:GoalsPage.ViewConstructor;

/**
 * 页面执行方法
 */
declare let GoalsView:GoalsPage.GoalsView;

/**
 * 组件执行方法
 */
declare let GoalsComponent:GoalsPage.ComponentConstructor;

/**
 * Goals模块
 */
declare module Goals {

    /** Goals下网络请求模块，通过它你可以发送HTTP请求以及其它请求 */
    var request:GoalsRequest
    /** Goals下混淆加密工具类 */
    var chaotic:GoalsChaotic
    /** Goals下XML工具类，包含XML解析等常用方法 */
    var xml:GoalsXML
    /** Goals下存储工具类，主要包含浏览器存取数据，它的好处在于可以直接存入对象，且它是加密过的 */
    var storage:GoalsStorage
    /** Goals下cookie工具类，可对浏览器的cookie值进行增删改查，且它是加密过的 */
    var cookie:GoalsCookie
    /** Goals下session工具类，对浏览器sessionStorage进行增删改查操作，它的好处在于可以直接存入对象，且它是加密过的 */
    var session:GoalsSession
    /**
     * 公共储存区域，它包含了一些公共属性。
     * 
     * 此类可自定义扩展属性，但是它会有一些本身就存在的值，自定义时可不要把它们覆盖了哦！
     */
    var common:GoalsCommon
    /**
     * 断言判断，通过判断judge参数，如果judge参数为false|undefined|null，则抛出msg异常
     * @param judge 判断参数
     * @param msg 异常信息
     */
    function assert(judge:boolean|undefined|null|string|object, msg:string):void
    /**
     * 设置对象的固定（不可变）属性
     * @param obj 需要设置只读属性的对象
     * @param key 给对象设置的只读属性键
     * @param value 给对象设置只读的值
     */
    function setReadonly(obj:object, key:string, value:any):void
    /**
     * 两个合并对象/数组，将第一个对象深拷贝至第二个对象
     * 
     * 如果第二个参数为空，则是对象的深拷贝
     * @param source 拷贝的来源
     * @param target 拷贝至目标
     * @param filter 不需要拷贝的字段数组
     * @returns 拷贝至目标
     */
    function combine(source:any, target:any, filter:string[]):any
    /**
     * 导入JavaScript文件
     * @param src JavaScript文件路径
     * @param callback 回调函数，可接收script标签
     * @returns script标签对象
     */
    function exportJs(src:string, callback:(script:HTMLScriptElement) => void):HTMLScriptElement
    /**
     * 导入CSS文件
     * @param src CSS文件路径
     * @returns link标签对象
     */
    function exportCss(src:string):HTMLLinkElement
    /**
     * 初始化`Goals`，使用`Goals`前需使用该方法进行初始化
     * @param setting 初始化的参数设置
     */
    function init(setting:GoalsInitSetting):void
    /**
     * 打开一个页面，可以传入附加参数
     * @param url 要打开的页面，支持相对路径，绝对路径，以及http网络路径
     * @param parameter 带入页面的附加参数，附加参数会写入浏览器url中
     */
    function open(url:string, parameter?:string|object):void
    /**
     * 获取当前打开的页面`url`
     */
    function currentUrl():string
    /**
     * 根据url查找页面对象
     * @param url 页面url，相对主页面的相对路径
     */
    function findViewByUrl(url:string):GoalsPage.GoalsView
    /**
     * 获取所有页面栈
     */
    function views():GoalsPage.GoalsView[]
    /**
     * 设置组件中的默认属性，针对某些组件，开启了自定义默认值的组件，可以根据组件的文档说明配置值
     * 
     * 最好在`Goals.init`之前配置，配置方式为：
     * ```javascript
     * Goals.initComponent({
     *    'componentName': {
     *        'propertyName': 'propertyValue'
     *    }
     * })
     * ```
     * @param opts 初始化参数，根据各个组件设置
     */
    function initComponent(opts:object):void
    /**
     * 向Goals添加全局事件
     * 
     * 支持事件：
     * 
     * `hashchange`
     * 
     * @param event 事件名称
     * @param callback 回调函数
     */
    function addListener(event:'hashchange', callback:(hash:string) => void):void

    /**
     * `2.1.0`新增
     * 手动创建组件
     * @param componentName 组件名称
     * @param container 组件的容器
     * @param view 页面对象
     * @param callback 创建组件完成的回调方法，可以接收创建的组件对象
     */
    function createComponent(componentName:string, container:HTMLDivElement, view:GoalsPage.GoalsView, callback:(component:GoalsPage.GoalsComponent) => void);
}
