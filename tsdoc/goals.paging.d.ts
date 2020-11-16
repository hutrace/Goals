interface GoalsPagingSetting {
    /** 请求接口地址 */
    url:string
    /** 分页数据的容器 */
    dataElem:HTMLElement
    /** 分页插件的容器 */
    pageElem:HTMLElement
    /** 分页的开始条数，默认0 */
    pageStart?:number
    /** 每页多少条，默认10 */
    pageSize?:number
    /** 显示的最多页数 */
    pageNumber?:number
    /** 初始化需要的请求数据 */
    data?:object
    /** 请求接口方式，分页一般都为`get`请求，默认`get`请求 */
    type?:string
    /** 获取`list`数据的键（`key`），在你需要对返回数据重新做封装的时候需要用到，默认`list` */
    pageListKey?:string
    /** 获取`count`数据的键（`key`），在你需要对返回数据重新做封装的时候需要用到，默认`count` */
    pageCountKey?:string
}
declare module Goals {
    /**
     * 分页插件
     */
    class paging {
        /**
         * 初始的值，包含了初始化时传入的参数，它是合并默认参数后的值
         * 
         * 你可以通过修改它的`data`值来达到`setData`的效果
         * 
         * 你在`data`中设置的`pageStart`和`pageSize`是无效的
         */
        option:GoalsPagingSetting
        /**
         * 开始查询的分页条数，默认0，你可以直接修改它
         */
        pageStart:number
        /**
         * 每次查询的条数，默认10，你可以直接修改它
         */
        pageSize:number
        /**
         * 当前分页插件加载的数据缓存，你可以通过它取到你请求过的所有数据
         * 
         * 当然，如果你调用了clearBuffer方法清除过数据，请忽略上面那句话
         */
        buffer:object
        /**
         * 当前发起的请求是否是第一次发起的
         * 
         * 后台可以根据此属性判断某些数据是否随着首次请求时查询
         */
        isFirstTime:boolean
        /**
         * 回调方法，此方法需要自己实现，将`arr`数组解析成`html`代码，然后返回即可
         * @param arr 接口查询的数组数据
         */
        template(arr:any[]):string
        /**
         * 回调方法，此方法需要自己实现，才分页加载完成后的回调
         * @param data 查询出的完整数据
         */
        callback(data:object):void
        /**
         * 实现翻页的查询，可以传入数组，表示从多少条开始查询
         * @param start 开始查询的数目
         */
        run(start:number):void
        /**
         * 设置接口查询的参数，以达到设置查询数据的效果
         * 
         * 设置后会自动调用查询的执行方法，不要再次手动调用
         * 
         * **注：此处`data`中包含`pageStart`和`pageSize`是无效的**
         * @param data 
         */
        setData(data:object):void
        /**
         * 实现开始解析数据，调用`template`和`callback`的方法
         * 
         * 它的内部实现是请求接口后拿到数据调用它
         * 
         * 你可以自己封装或使用它来实现固定数据分页效果
         * @param data 
         */
        load(data:object):void
        /**
         * 开始执行请求接口获取数据
         * 
         * 它会检查是否存在加载过的缓存，如果没有缓存才会请求接口
         * 
         * 你也可以手动设置各种属性后调用它
         */
        start():void
        /**
         * 重新加载当前页数的数据
         * 
         * 它会清除缓存中的当前页的数据，再重新查询数据
         * 
         * 你也可以手动设置各种属性后调用它
         */
        reload():void
        /**
         * 清除当前分页插件的所有缓存
         */
        clearBuffer():void
        constructor(opts:GoalsPagingSetting)
    }
}