declare class GoalsUtils {

    /**
     * 判断参数是否为`null`
     * @param arg 
     */
    isNull(arg:any):boolean
    /**
     * 判断参数是否为`undefined`
     * @param arg 
     */
    isUndefined(arg:any):boolean
    /**
     * 判断参数是否是`string`（字符串）类型
     * @param arg 
     */
    isString(arg:any):boolean
    /**
     * 判断参数是否是`number`（数字）类型
     * @param arg 
     */
    isNumber(arg:any):boolean
    /**
     * 判断参数是否是`boolean`（布尔）类型
     * @param arg 
     */
    isBoolean(arg:any):boolean
    /**
     * 判断参数是否是`function`（方法）
     * @param arg 
     */
    isFunction(arg:any):boolean
    /**
     * 判断参数是否是`date`（时间）类型
     * @param arg 
     */
    isDate(arg:any):boolean
    /**
     * 判断参数是否是`array`（数组）类型
     * @param arg 
     */
    isArray(arg:any):boolean
    /**
     * 判断参数是否是`object`（对象）类型
     * @param arg 
     */
    isObject(arg:any):boolean
    /**
     * 判断参数是否是`reg`（正则表达式）类型
     * @param arg 
     */
    isRegExp(arg:any):boolean
    /**
     * 获取`URI`链接的参数，如果没有，则返回null
     * @param name 你需要获取的参数名
     */
    getURIParameter(name:string):string
    /**
     * 格式化时间
     * @param date 可以是date类型、字符串、或者数字类型的时间戳
     * @param format 你需要得到的时间格式（yyyyMMddhhmmss）
     */
    dateFormat(date:string|Date|number, format:string):string
    /**
     * 获取元素下所有包含`name`属性的`input`、`select`、`textarea`的值
     * @param selector 需要获取数据的公共父级元素
     */
    getTagNameData(selector:HTMLElement|Element):object
    /**
     * 设置元素下所有包含`name`属性的`input`、`select`、`textarea`的值，以`name`与`data`的`key`做匹配
     * @param selector 需要设置数据的公共父级元素
     * @param data 数据
     */
    setTagNameData(selector:HTMLElement|Element, data:object):void
    /**
     * 针对某些浏览器在事件触发时没有`event`值，可以通过此方法直接获取
     */
    event():Event
    /**
     * 类似`jQuery`的`on`方法
     * @param selector `Element`对象
     * @param bubbling 需要绑定事件的`class`
     * @param event 事件名称
     * @param fn 执行回调方法
     */
    on(selector:HTMLElement, bubbling:string, event:string, fn:(elem:HTMLElement) => void):void
    /**
     * 给元素绑定hover事件的方法，它和jQuery的hover方法类似
     * @param selector `Element`对象
     * @param inFn 移入的回调
     * @param outFn 移出的回调
     */
    hover(selector:HTMLElement, inFn:() => void, outFn:() => void)
    /**
     * 绑定`checkbox`的全选/全不选，依赖`jQuery`
     * @param elem 全选/全不选的`checkbox`对象
     * @param pelem 需要被选中的全局父元素`Element`对象
     * @param clazs 所有需要被选的`checkbox`的共同`class`
     */
    bindCheckbox(elem:HTMLElement, pelem:HTMLElement, clazs:string):void
    /**
     * 获取某个`Element`下所有`class`属性为`clazs`且被选中的元素
     * 
     * 返回元素`Element`对象数组，依赖`jQuery`
     * @param pelem 需要被获取的父元素`Element`对象
     * @param clazs 需要被获取的`checkbox`的共同`class`
     */
    getCheckedElems(pelem:HTMLElement, clazs:string):HTMLElement[]
    /**
     * 获取某个`Element`下所有`class`属性为`clazs`且被选中元素的下标`index`
     * 
     * 返回下标数组，依赖`jQuery`
     * @param pelem 需要被获取的父元素`Element`对象
     * @param clazs 需要被获取的`checkbox`的共同`class`
     */
    getCheckedIndexs(pelem:HTMLElement, clazs:string):number[]
    /**
     * 联想下拉选择框
     * @param elem 搜索的输入框元素`Element`对象
     * @param array 完整的数据数组
     * @param fields 需要作用于查询的字段
     * @param setting 其它设置参数
     */
    pulldown(elem:HTMLElement, array:object[], fields:string[], setting:GoalsUtilsPulldownSetting):void
}
/**
 * `pulldown`下拉选择框的参数类
 */
declare interface GoalsUtilsPulldownSetting {
    /**
     * 显示数据区域的`top`值，默认是`input`输入框的高度以及距离顶部的距离，不需要加`px`单位
     */
    top?:number
    /**
     * 显示数据区域的`left`值，默认是`input`输入框距离左侧的距离，不需要加`px`单位
     */
    left?:number
    /**
     * 显示数据区域的`width`值，默认是`input`输入框的宽度，不需要加`px`单位
     */
    width?:number
    /**
     * 显示数据区域的固定`height`值，如果不设置它，会使用`maxHeight`属性
     */
    height?:number
    /**
     * 显示数据区域的最大高度，默认300
     */
    maxHeight?:number
    /**
     * 当搜索输入框的数据为空时是否全部检索，默认为`false`不检索
     */
    nullValueShow?:boolean
    /**
     * 是否高亮显示查询的数据，默认为`true`高亮显示
     */
    highlight?:boolean
    /**
     * 自定义底部的`html`字符串
     * 
     * **预留值，当前版本未实现此功能**
     */
    bottomHTML?:string
    /**
     * 当查询多个字段时，连接显示的字符串
     */
    joint?:string
    /**
     * 光标移出的回调，可以接收`data`值，如果存在，则是选中，否则是直接移出
     * @param data 
     */
    blurFn?(data:object):void
    /**
     * 光标移入的回调
     */
    focusFn?():void
    /**
     * 输入时按键弹起的回调
     */
    keyupFn?(event:Event):void
}
declare module Goals {
    /**
     * 提示框类
     */
    var utils:GoalsUtils
}