<style lang="less">
    @import '../../../views/my-components/area-linkage/area-linkage.less';
    @import '../../../styles/common.less';
</style>

<template>
    <div>
    <span>id = {{initial.id}}</span>
    <Form ref="routerForm" :model="formItem" :rules="ruleValidate" :label-width="90">
        <FormItem label="上级权限" style="margin-bottom: 10px" prop="parentTitle">
            <Input v-model="formItem.parent.title" disabled></Input>
        </FormItem>
        <FormItem label="权限命名" prop="name">
            <Input v-model="formItem.name" placeholder="权限命名"></Input>
        </FormItem>
        <FormItem label="权限标题" prop="title">
            <Input v-model="formItem.title" placeholder="权限标题"></Input>
        </FormItem>
        <FormItem label="描述" prop="describe">
            <Input v-model="formItem.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="描述"></Input>
        </FormItem>
        <FormItem label="排序" prop="sortOrder">
            <InputNumber v-model="formItem.sortOrder" placeholder="排序序号"></InputNumber>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('routerForm')">确定</Button>
            <Button type="ghost" style="margin-left: 8px" @click="handleCancel">取消</Button>
        </FormItem>
    </Form>
    </div>
</template>

<script>
    import Util from '@/libs/util';

    export default {
        props: ['initial'],
        components: {},
        data () {
            return {
                formItem: {
                    id: '',
                    name: '',
                    title: '',
                    describe: '',
                    sortOrder: 1,
                    parentId: '',
                    parent: {
                        id: '',
                        title: ''
                    }
                },
                oriItem: {},
                ruleValidate: {
                    name: [
                        { required: true, message: '权限名不能为空', trigger: 'blur' }
                    ],
                    title: [
                        { required: true, message: '权限标题不能为空', trigger: 'blur' }
                    ],
                    describe: [
                        { type: 'string', max: 20, message: '不要超过20个字', trigger: 'blur' }
                    ]
                }
            };
        },
        watch: {
            initial: function () {
                this.formItem = this.initial;
                Object.assign(this.oriItem, this.initial);
            }
        },
        mounted () {
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        Util.ajax.post('/router/saveOne', this.formItem)
                            .then(function (response) {
                                let resp = response.data;
                                vm.formItem.id = resp.id;
                                vm.$Message.info('保存成功!');
                            }).catch(function (error) {
                                console.log(error);
                            });
                    } else {
                        this.$Message.error('验证失败!');
                    }
                });
            },
            handleCancel () {
                Object.assign(this.formItem, this.oriItem);
            }
        }
    };
</script>
