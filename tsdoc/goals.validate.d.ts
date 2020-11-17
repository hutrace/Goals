declare module Goals {
    type StrObj = {
        [key:string]:any
    }
    /**
     * 表单验证插件类
     */
    class validate {
        data:any
        /**
         * 传入的`Element`对象
         */
        elem:HTMLElement
        /**
         * 重新绑定表单验证，针对表单内容改变后使用
         */
        rebind():void
        /**
         * 清除表单的所有数据，select选择框选择至第一个。
         */
        clear():void
        /**
         * 验证表单并获取数据
         * 
         * 它会判断需要验证的表单，如果有验证不通过的，则光标移出对应的输入框
         * 
         * @returns 如果验证通过，返回data数据，否则返回null
         */
        verify():StrObj|null
        /**
         * 将特殊字符串转义，避免XSS
         * @param str 
         */
        esc(str:string):string
        [key:string]: any
        constructor(elem:HTMLElement|Element)
    }
}