<style lang="less">
    @import '../../../views/my-components/area-linkage/area-linkage.less';
    @import '../../../styles/common.less';
</style>

<template>
    <div>
    <span>id = {{formItem.id}}  and {{formItem.parent}} and {{formItem.parentCode}}</span>
    <Form ref="deptForm" :model="formItem" :rules="ruleValidate" :label-width="90">
        <FormItem label="上级机构" style="margin-bottom: 10px" prop="parentName">
            <Input v-model="formItem.parent.name" disabled></Input>
        </FormItem>
        <FormItem label="机构代码" prop="code">
            <Input v-model="formItem.code" disabled></Input>
        </FormItem>
        <FormItem label="机构名称" prop="name">
            <Input v-model="formItem.name" placeholder="机构名称"></Input>
        </FormItem>
        <FormItem label="描述" prop="describe">
            <Input v-model="formItem.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="描述"></Input>
        </FormItem>
        <FormItem label="是否机构" prop="isOrg">
            <i-switch v-model="formItem.isOrg" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </FormItem>
        <FormItem label="金融机构编码" prop="financialCode">
            <Input v-model="formItem.financialCode" placeholder="金融机构编码"></Input>
        </FormItem>
        <FormItem label="地区" style="padding:0px" prop="areaCode">
            <Row>
                <Col>
                <al-selector 
                    v-model="resDefault"
                    :searchable="true"
                    level="2"
                    data-type="code"
                    />
                </Col>
                <Col><span>{{formItem.areaCode}}: {{resDefault}}</span></Col>
            </Row>
            
        </FormItem>
        <FormItem label="创建/修改时间" prop="createDate">
            <DatePicker :value="formItem.createDate" format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px" disabled></DatePicker>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('deptForm')">确定</Button>
            <Button type="ghost" style="margin-left: 8px">取消</Button>
        </FormItem>
    </Form>
    </div>
</template>

<script>
    import alSelector from '../../../views/my-components/area-linkage/components/al-selector.vue';
    import alCascader from '../../../views/my-components/area-linkage/components/al-cascader.vue';
    import Util from '@/libs/util';

    export default {
        props: ['initial'],
        components: {
            alSelector,
            alCascader
        },
        data () {
            return {
                formItem: {
                    id: '',
                    code: '',
                    createDate: '',
                    describe: '',
                    name: '',
                    parentId: '',
                    parentCode: '',
                    parent: {
                        id: '',
                        name: '',
                        title: '',
                        code: ''
                    },
                    finantialCode: '',
                    areaCode: '',
                    isOrg: ''
                },
                resDefault: [],
                oriItem: {},
                ruleValidate: {
                    name: [
                        { required: true, message: '机构名称不能为空', trigger: 'blur' }
                    ],
                    describe: [
                        { type: 'string', max: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ]
                }
            };
        },
        watch: {
            initial: function () {
                this.formItem = this.initial;
                Object.assign(this.oriItem, this.initial);
                this.resDefault = this.res;
                console.log('init: ' + this.resDefault);
            },
            resDefault: function () {
                console.log(this.resDefault);
            }
        },
        computed: {
            res: function () {
                let areaCode = this.formItem.areaCode;
                let arr = [];
                if (areaCode && areaCode.length === 6) {
                    if (areaCode.substr(2, 4) === '0000') {
                        arr.push(areaCode);
                    } else if (areaCode.substr(4, 2) === '00') {
                        let level0 = `${areaCode.substr(0, 2)}0000`;
                        arr.push(level0);
                        arr.push(areaCode);
                    } else {
                        let level0 = `${areaCode.substr(0, 2)}0000`;
                        let level1 = `${areaCode.substr(0, 4)}00`;
                        arr.push(level0);
                        arr.push(level1);
                        arr.push(areaCode);
                    }
                }
                return arr;
            }
        },
        mounted () {
        },
        methods: {
            fromResToCode (res = ['430000', '430100', '430102']) {
                this.formItem.areaCode = res[2];
            },
            fromCodeToRes (code = '430102') {
                let level0 = `${code.substr(0, 2)}0000`;
                let level1 = `${code.substr(0, 4)}00`;
                let arr = [];
                arr.push(level0);
                arr.push(level1);
                arr.push(code);
                return arr;
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        if (!!(this.resDefault) && this.resDefault.length !== 0) {
                            let len = this.resDefault.length;
                            this.formItem.areaCode = this.resDefault[len - 1];
                        }
                        Util.ajax.post('/dept/saveOne', this.formItem)
                            .then(function (response) {
                                vm.formItem.id = response.data.id;
                                vm.formItem.title = response.data.name;
                                vm.$Message.info('保存成功!');
                            }).catch(function (error) {
                                this.console.log(error);
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
