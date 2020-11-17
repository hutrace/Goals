declare interface GoalsPopupSetting {
    /**
     * `Element`对象
     */
    elem:HTMLElement,
    /**
     * 弹框的动画效果，shade（渐变），left-right（从左到右），right-left（从右到左），lateral-spread（横向扩张），vertical-spread（纵向扩张）
     */
    animate?:string,
    /**
     * 点击确定的回调，可接收参数，第一个参数是隐藏弹框的方法，后面的参数依次是调用弹起框时传入的参数
     * @param arg 
     */
    okFn?(...arg:any):void
    /**
     * 点击关闭的回调，可接收参数，第一个参数是隐藏弹框的方法，后面的参数依次是调用弹起框时传入的参数
     * @param arg 
     */
    cancelFn?(...arg:any):void
}
declare module Goals {
    /**
     * 弹框类，使用示例
     * ```html
        <!--
            弹框的容器，必要属性
            class="v1-popup"
            popup属性，执行指向此弹框的标识
        -->
        <div class="v1-popup" popup="test" goals-id="test" style="width: 300px;height: 200px;">
            <!-- 弹框的标题，你也可以自定义它的类和样式 -->
            <div class="v1-popup-title">测试弹框</div>
            <!-- 弹框内容，你也可以自定义它的类和样式 -->
            <div class="v1-popup-content">
                我是一个弹框
            </div>
            <!--
                弹框的确认与关闭按钮，你也可以之定义它们的层级与样式。
                需要注意的是，确认按钮必须包含“popup-ok-btn”这个类，取消按钮必须包含“popup-cancel-btn”这个类，因为按钮的事件是通过它们绑定的。
            -->
            <div class="v1-popup-btns">
                <div class="v1-popup-ok popup-ok-btn goals-btn btn-primary">确定</div>
                <div class="v1-popup-cancel popup-cancel-btn goals-btn">关闭</div>
            </div>
        </div>
        ```
     * ```javascript
        var popup = new Goals.popup([{
            elem: self.find("g:test"),
            animate: 'shade',
            okFn: function(hide, arg0) {

            },
            cancelFn: function() {
                
            }
        }]);
        popup.test('扩展参数，可传任意数量');
        ```
     */
    class popup {
        /**
         * 弹框显示时的回调
         * @param key 弹框标识
         */
        onshow(key:string):void
        /**
         * 弹框隐藏时的回调
         * @param key 弹框标识
         */
        onhide(key:string):void
        [key:string]: any
        constructor(opts: GoalsPopupSetting[])
    }
}