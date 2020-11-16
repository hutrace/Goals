declare class GoalsPrompt {
    /**
     * 消息加载框，消息加载框全局只会存在一个，如果重复调用，会以最后一次调用的信息为主。
     * @param msg 提示的信息
     */
    showLoading(msg:string):void
    /**
     * 关闭loading框
     */
    hideLoading():void
    /**
     * 消息提示框，类似js的alert，它需要手动点击确认后关闭。
     * @param msg 提示的信息
     * @param callback 关闭提示框的回调
     */
    info(msg:string, callback?:() => void)
    /**
     * 成功提示框，类似js的alert，它需要手动点击确认后关闭。
     * @param msg 提示的信息
     * @param callback 关闭提示框的回调
     */
    success(msg:string, callback?:() => void)
    /**
     * 错误提示框，类似js的alert，它需要手动点击确认后关闭。
     * @param msg 提示的信息
     * @param callback 关闭提示框的回调
     */
    error(msg:string, callback?:() => void)
    /**
     * 警告提示框，类似js的alert，它需要手动点击确认后关闭。
     * @param msg 提示的信息
     * @param callback 关闭提示框的回调
     */
    warn(msg:string, callback?:() => void)
    /**
     * 自动消失提示框
     * @param type 提示框类型，`success`、`error`、`warn`、`info`
     * @param msg 提示的信息
     * @param callback 关闭提示框的回调
     */
    toast(type:string, msg:string, callback?:() => void)
    /**
     * 确认操作提示框
     * @param msg 提示的信息
     * @param onFn 点击确认后的回调
     * @param cancelFn 点击取消后的回调
     * @param height 提示框的高度，默认160
     */
    confirm(msg:string, onFn:() => void, cancelFn?:() => void, height?:number):void
}

declare module Goals {
    /**
     * 提示框类
     */
    var prompt:GoalsPrompt
}