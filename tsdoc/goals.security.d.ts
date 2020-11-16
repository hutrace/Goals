declare class GoalsSecurity {
    /**
     * 混淆字符串，提起偶数位倒序拼接上基数位倒序
     * @param str 需要处理的字符串
     */
    disrupt(str:string):string
    /**
     * 转换字符串，把字符串从末尾依次倒序整理
     * @param str 需要处理的字符串
     */
    invert(str:string):string
    /**
     * 使用密钥对`object`对象进行`MD5`签名
     * 
     * 解析`Object`对象，将`key`按照`ASCII`排序后，且对`value`进行`URL`编码，再进行签名
     * @param obj 签名数据
     * @param secret 密钥
     */
    sign(obj:object, secret:string):string
    /**
     * 使用密钥对字符串进行AES加密
     * @param secret 密钥
     * @param str 加密数据
     */
    aesEncode(secret:string, str:string):string
    /**
     * 使用密钥对字符串进行AES解密
     * @param secret 密钥
     * @param str 解密数据
     */
    aesDecode(secret:string, str:string):string
    /**
     * 封装的以用户名、密码换取Token的方法（也就是登陆方法）
     * 
     * 该方法将在后续被舍去，请尽量不要使用它
     * @param opt 
     * @deprecated
     */
    token(opt: {
        data:object,
        url:string,
        success:(data:object) => void,
        error:() => void
    }):void
    /**
     * 对`request`模块的`ajax`进行了封装
     * 
     * 它会获取`session`中的`token`相关信息，然后写在对应的地方
     * 
     * 也可以使用`encrypt`参数对请求数据进行加密
     * @param opts 
     */
    ajax(opts:GoalsSecurityAjaxData):void
    /**
     * `security`模块下的安全下载文件方法，它会使用用户`token`，可以在后台进行权限验证
     * 
     * 该方法仅限于服务端使用了`Authority`模块的情况下使用
     * 
     * **该方法的参数和`ajax`请求的参数一致，但是不需要`success`回调**
     * @param opts 
     */
    download(opts:GoalsSecurityAjaxData, callback:() => {}):void
}
/**
 * `security`模块下的`ajax`请求参数类
 */
declare interface GoalsSecurityAjaxData extends AjaxData {
    /**
     * `url`可以以`/`开头，也可以直接写路径，`security`会自动处理的，且`security`会自动将`Goals.common.SERVER_NAME`的值拼接在`url`的最前面
     */
    url:string
    /**
     * 是否加密请求数据，默认为`false`，不加密
     */
    encrypt?:boolean
    /**
     * 请求失败的回调
     */
    fail?():void
}
declare module Goals {
    /**
     * `http`安全访问类
     */
    var security:GoalsSecurity
}