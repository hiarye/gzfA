<template>
    <Form ref="roleForm" :model="formItem" :label-width="80" :rules="ruleValidate">
        <FormItem label="角色名" prop="name">
            <Input v-model="formItem.name" placeholder="不超过60位的英文数字组合"></Input>
        </FormItem>
        <FormItem label="描述">
            <Input v-model="formItem.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="描述"></Input>
        </FormItem>
        <FormItem label="是否启用">
            <i-switch v-model="formItem.enabled" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('roleForm')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="handleCancel">取消</Button>
        </FormItem>
    </Form>
</template>

<script>
    import Util from '@/libs/util';

    export default {
        data () {
            return {
                formItem: {
                    name: '',
                    describe: '',
                    enabled: true
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '角色名不能为空', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        Util.ajax.post('/role/insertOne', this.formItem)
                            .then(function (response) {
                                let respType = response.data.type;
                                if (respType === '0') {
                                    vm.$emit('on-done', true);
                                    vm.$Message.info('保存成功!');
                                } else {
                                    vm.$emit('on-done');
                                    vm.$Message.info('保存失败!');
                                }
                            }).catch(function (error) {
                                this.console.log(error);
                                vm.$Message.info('保存失败!');
                            });
                    } else {
                        this.$Message.error('验证失败!');
                    }
                });
            },
            handleCancel () {
                this.$emit('on-done');
            }
        }
    };
</script>
