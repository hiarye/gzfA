<template>
    <div>
        <Tree ref="tree" :data="routers" show-checkbox></Tree>
        <Button type="primary" @click="handleSubmit('tree')">提交</Button>
        <Button type="ghost" style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
</template>
<script>
import Util from '@/libs/util';
import axios from 'axios';

export default {
    props: ['role'],
    data () {
        return {
            routers: [],
            oriRouters: []
        };
    },
    mounted () {
    },
    watch: {
        role: function () {
            this.buildTree();
        }
    },
    methods: {
        // 格式化节点数据
        getTreeNodes (nodes = [], auth = []) {
            let arr = [];
            if (!!nodes && nodes.length !== 0) {
                nodes.forEach(item => {
                    let obj = {};
                    obj.id = item.id;
                    obj.title = item.title;
                    obj.name = item.name;
                    obj.describe = item.describe;
                    obj.parentId = item.parentId;
                    obj.checked = this.toChecked(obj.id, auth);
                    // console.log(obj.checked);
                    obj.expand = true;
                    obj.selected = false;
                    obj.children = this.getTreeNodes(item.children, auth); // 递归调用
                    arr.push(obj);
                });
            }
            return arr;
        },
        toChecked (id, auth = []) {
            if (!!auth && auth.length !== 0) {
                return auth.some(item => {
                    return item.routerId === id;
                })
            } else {
                return false;
            }
        },
        // 初始化树的根节点
        buildTree () {
            let vm = this;
            axios.all([
                Util.ajax.post('/router/getAllTree'),
                Util.ajax.post('/role/getRoleRouter', {roleId: this.role.id})
            ]).then(axios.spread(function (treeResponse, authResponse) {
                let treeResponseType = treeResponse.data.type;
                let treeResponseData = treeResponse.data.data;
                let authResponseType = authResponse.data.type;
                let authResponseData = authResponse.data.data;
                if (treeResponseType === '0' && authResponseType === '0') {
                    vm.routers = vm.getTreeNodes(treeResponseData, authResponseData);
                    vm.oriRouters = vm.copyData(vm.routers);
                } else {
                    vm.$Message.error('获取信息失败');
                }
            }));

            // Util.ajax.post('/role/getAuthTree', {roleId: this.role.id})
            //     .then(function (response) {
            //         let respType = response.data.type;
            //         let respData = response.data.data;
            //         if (respType === '0') {
            //             vm.routers = vm.getTreeNodes(respData);
            //             vm.oriRouters = vm.copyData(vm.routers);
            //         } else {
            //             vm.$Message.error('获取信息失败');
            //         }
            //     });
        },
        handleSubmit (name) {
            let checkedNodes = this.$refs[name].getCheckedNodes();
            let vm = this;
            let checkedIds = [];
            if (!!checkedNodes && checkedNodes.length > 0) {
                checkedNodes.forEach(item => {
                    checkedIds.push(item.id);
                });
            }
            Util.ajax.post('/role/saveRoleRouter', {roleId: this.role.id, checkedIds: checkedIds})
                .then(function (response) {
                    let respType = response.data.type;
                    let respData = response.data.data;
                    if (respType === '0') {
                        vm.$emit('on-done');
                        vm.oriRouters = vm.copyData(vm.routers);
                        vm.$Message.error('保存成功');
                    } else {
                        vm.$Message.error('保存失败');
                    }
                });
            console.log(checkedNodes);
        },
        handleCancel () {
            this.routers = this.oriRouters;
            this.$emit('on-done');
        },
        copyData (sourceArr) {
            let arr = [];
            if (!!sourceArr && sourceArr.length !== 0) {
                sourceArr.forEach(item => {
                    let obj = {};
                    Object.assign(obj, item);
                    obj.children = this.copyData(item.children); // 递归调用
                    arr.push(obj);
                });
            }
            return arr;
        }
    }
};
</script>
