<template>
    <!-- Form -->
    <!-- <el-button type="text" @click="dialogvisible = true">打开嵌套表单的 Dialog</el-button> -->

    <el-dialog title="增加项目" :visible="dialogvisible">
    <el-form :model="form">
        <el-form-item label="床号" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择项目" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogOpen">确 定</el-button>
    </div>
    </el-dialog>
</template>

<script>
  export default {
    props:{
        dialogvisible:{
                type:Boolean,
                default(){
                    return false
                }
        },
    },
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      };
    },
    computed: {
        
    },
    methods: {
        dialogClose(){//dialog关闭时触发的回调
            console.log('999');
            //通过父组件传递下来的方法,关闭dialog
            this.$emit('cancel')

        },
        dialogOpen(){
            console.log('1111');
            this.$emit('ok')
        },
       
    }
  };