<template>
    <div class="marsk" key="div" v-if="visible">
        <div class="modal-wrap">
            <div class="title">
                <slot name="title">提示</slot>
            </div>
            <div class="body">
                <slot name="body">提示内容</slot>
            </div>
            <div class="footer">
                <button class="del" @click="handleCancel">取消</button>
                <button class="confirm" @click="handleConfirm">确定</button>
            </div>
        </div>
    </div>
</template>
<script>
//封装组件的流程 slot props emit
//1.编写组件的结构
//2.设计组件

//我们的业务需求
//1.需要一个属性来控制 modal的显示和隐藏 通过visible来控制
//2.组件title body部分 内容要变的灵活 
//3.点击按钮之后 需要关闭模态框 点击按钮之后需要触发额外的业务逻辑
//4.点击确定按钮或者取消按钮 需要给用户提供添加自己代码的机会
//通过事件 confirm事件 cancel事件来触发 确定和取消按钮对应的业务逻辑

//描述一下,你是怎么封装这个组件的 周一提问

//1.背诵钩子函数 vue的钩子 + 自定义指令的钩子
//2.熟练的使用slot
//3.完成modal组件的封装
//4.预习下面的课程内容
//5.eventBus原理
export default {
    methods: {
        handleCancel() {
            //永远不要修改props 把props当成只读属性
            this.$emit('cancel')
        },
        handleConfirm() {
            this.$emit('onOk')
        }
    },
    props: {
        visible: {
            type: Boolean,
            default() {
                return false
            }
        }
    }

}
</script>
<style scoped>
.marsk {
    background-color: rgba(0, 0, 0, .6);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-wrap {
    border-radius: 10px;
    background-color: #fff;
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    /* border: 1px solid #ccc; */
}

.marsk .title,
.marsk .footer,
.marsk .body {
    margin: 20px 0
}

button {
    outline: none;
    border: 0;
    width: 100px;
    height: 40px;
    background: linear-gradient(90deg, #1596fb, #002dff);
    border-radius: .28571429rem;
    /* display: block; */

    color: #fff;
    cursor: pointer;
}

.footer {
    width: 100%;
    text-align: center;
}

.footer button {
    margin-left: 20px
}

.del {
    background-image: linear-gradient(90deg, #fb1565, #ff00cc);
}
button:hover {
    background-image: linear-gradient(90deg, #aebaac, #57da23);
}
</style>