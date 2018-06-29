<template>
    <div>
        <Tree :data="depts" :load-data="loadData" @on-select-change="clickTarget"></Tree>
    </div>
</template>
<script>
import Util from '@/libs/util';

export default {
    data () {
        return {
            depts: [],
            rootNode: {},
            currentNode: {},
            currentData: {}
        };
    },
    mounted () {
        this.initTree();
    },
    watch: {
    },
    methods: {
        // 格式化根节点数据
        getTreeRoot (rootNode) {
            let obj = {};
            let arr = [];
            if (rootNode) {
                obj.title = rootNode.name;
                obj.expand = true;
                obj.selected = false;
                obj.loading = false;
                obj.id = rootNode.id;
                obj.parentId = rootNode.parentId;
                if (!!rootNode.children && rootNode.children.length !== 0) {
                    obj.children = this.getTreeNodes(rootNode.children);
                }
            }
            arr.push(obj);
            return arr;
        },
        // 格式化子节点数据
        getTreeNodes (nodes = []) {
            let arr = [];
            if (!!nodes && nodes.length !== 0) {
                nodes.forEach(item => {
                    let obj = {};
                    obj.title = item.name;
                    obj.expand = false;
                    obj.selected = false;
                    obj.loading = false;
                    obj.id = item.id;
                    obj.parentId = item.parentId;
                    obj.children = this.getTreeNodes(item.children); // 递归调用
                    arr.push(obj);
                });
            }
            return arr;
        },
        clickTarget (data) {
            if (data.length === 1) {
                // 发送当前选中的节点信息到上级组件
                this.$emit('on-select-dept', data[0].id);
            }
        },
        // 初始化树的根节点
        initTree () {
            let vm = this;
            Util.ajax.post('/dept/getRootNodeByUser')
                .then(function (response) {
                    let respDept = response.data;
                    vm.depts = vm.getTreeRoot(respDept);
                });
        },
        // 异步加载子节点
        loadData (item, callback) {
            let data = [];
            let vm = this;
            Util.ajax.post('/dept/getChildrenDepts', {deptId: item.id})
                .then(function (response) {
                    let respDepts = response.data;
                    data = vm.getTreeNodes(respDepts);
                    callback(data);
                });
        }
    }
};
</script>
