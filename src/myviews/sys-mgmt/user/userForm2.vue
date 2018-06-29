<template>
    <Form ref="userForm" :model="formItem" :label-width="80" :rules="ruleValidate">
        <FormItem label="用户名" prop="username" >
            <Input v-model="formItem.username" placeholder="不超过60位的英文数字组合" disabled></Input>
        </FormItem>
        <FormItem label="是否启用">
            <i-switch v-model="formItem.enabled" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </FormItem>
        <FormItem label="用户密码">
            <Input value="****************" disabled></Input>
            <Button type="primary" @click="resetPassword()">重置密码</Button>
        </FormItem>
        <FormItem label="中文名称">
            <Input v-model="formItem.cname" placeholder="不超过30位中文字符"></Input>
        </FormItem>
        <FormItem label="英文名称">
            <Input v-model="formItem.ename" placeholder="不超过60位英文字符"></Input>
        </FormItem>
        <FormItem label="身份证">
            <Input v-model="formItem.identityCard" placeholder="18位号码"></Input>
        </FormItem>
        <FormItem label="电子邮件">
            <Input v-model="formItem.email" placeholder="样例：xx@xx.com"></Input>
        </FormItem>
        <FormItem label="手机">
            <Input v-model="formItem.mobile" placeholder="11位号码"></Input>
        </FormItem>
        <FormItem label="创建时间">
            <DatePicker :value="formItem.createDate" format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px" disabled></DatePicker>
        </FormItem>
        <FormItem label="修改时间">
            <DatePicker :value="formItem.modifyDate" format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px" disabled></DatePicker>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('userForm')">提交</Button>
            <Button type="info" @click="resetForm">重置</Button>
            <Button type="ghost" style="margin-left: 8px" @click="handleCancel">取消</Button>
        </FormItem>
    </Form>
</template>

<script>
    import Util from '@/libs/util';
    import moment from 'moment';

    export default {
        props: ['user'],
        data () {
            return {
                formItem: {
                    username: '',
                    enabled: true,
                    cname: '',
                    ename: '',
                    identityCard: '',
                    email: '',
                    mobile: ''
                },
                oriItem: {},
                ruleValidate: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ]
                }
            };
        },
        watch: {
            user: function () {
                Object.assign(this.formItem, this.user);
                Object.assign(this.oriItem, this.user);
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        let createDate = moment(this.formItem.createDate).format('YYYY-MM-DD HH:mm:ss');
                        this.formItem.createDate = createDate;
                        Util.ajax.post('/user/updateOne', {formItem: this.formItem})
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
            },
            resetForm () {
                Object.assign(this.formItem, this.oriItem);
            },
            resetPassword () {
                let vm = this;
                Util.ajax.post('/user/resetPassword', {username: this.formItem.username})
                    .then(function (response) {
                        let respType = response.data.type;
                        if (respType === '0') {
                            vm.$Message.info('密码重置成功!');
                        } else {
                            vm.$Message.error('密码重置失败失败!');
                        }
                    }).catch(function (error) {
                        this.console.log(error);
                        vm.$Message.error('密码重置失败!');
                    });
            }
        }
    };
</script>
