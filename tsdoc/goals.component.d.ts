/**
 * 分页组件，该组件大大简化了分页查询的页面书写
 * 
 * 依赖：针对事件绑定，该组件依赖`jQuery`，依赖`font-awesome`图标
 * 
 * 分页组件支持很多属性，其中`url`属性为必填，其它属性见`Attr`
 * 
 * 组件使用方式
 * ```html
 *
<paging url="请求地址">

</paging>
 * ```
 */
declare namespace GoalsComponentPaging {
    
    /**
     * 分页组件的属性
     */
    interface Attr {
        /**
         * 请求地址
         */
        url?:string
        /**
         * 执行请求服务端的`ajax`方法，默认`Goals.request.ajax`
         * 
         * 你可以在初始化时更改此默认值，也可以直接在组件标签上设置它
         */
        ajax?:string
        /**
         * 请求方式，例如：GET、POST、DELETE等，默认为`GET`
         */
        method?:string
        /**
         * 排序的字段，默认`null`
         */
        orderby?:string
        /**
         * 排序的方式ASC/DESC，默认`null`
         */
        sort?:string
        /**
         * 开始查询数据的条数，默认从`0`条开始
         */
        start?:number
        /**
         * 查询多少条数据，默认查询`20`条数据
         */
        size?:number
        /**
         * 其它请求参数，默认空对象`{}`
         * 
         * **注意，该属性在组件标签中的值为`qs`字符串（`QueryString`），例如：`a=b&c=d&e=f`**
         */
        params?:object
        /**
         * 服务端响应数据中数据的`key`，例如：服务器响应`{list: [], count: 0}`，默认为`list`
         */
        listkey?:string
        /**
         * 服务端响应数据中总条数的`key`，例如：服务器响应`{list: [], count: 0}`，默认为`count`
         */
        countkey?:string
        /**
         * 该组件的页标最大数量，默认5
         */
        maxnum?:number
        /**
         * 查询表单的`goals-id`，默认`null`
         */
        searchform?:string
        /**
         * 查询按钮的`goals-id`，默认`null`
         */
        searchbtn?:string
        /**
         * 重置按钮的`goals-id`，默认`null`
         */
        resetbtn?:string
        /**
         * 是否加载改变`size`属性的选项，默认`true`
         */
        changesize?:boolean
        /**
         * 改变`size`的选项，默认`[20, 50, 100]`
         */
        sizeoptions?:number[]
    }

}