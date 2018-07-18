<template>
    <div>
        <Tree ref="deptTree" :data="depts" :load-data="loadData" :render="renderContent" class="ivu-article" ></Tree>
        <Modal v-model="showModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>删除后将不可恢复！</p>
                <p>您是否要删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="delOk">删除</Button>
            </div>
        </Modal>
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
            currentData: {},
            showModal: false,
            modal_loading: false
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
                obj.id = rootNode.id;
                obj.parentId = rootNode.parentId;
                obj.parent = {id: '', title: '', name: '', code: ''};
                obj.parentCode = '';
                obj.name = rootNode.name;
                obj.code = rootNode.code;
                obj.createDate = rootNode.createDate;
                obj.describe = rootNode.describe;
                obj.financialCode = rootNode.financialCode;
                obj.areaCode = rootNode.areaCode;
                obj.isOrg = rootNode.isOrg;
                obj.title = rootNode.name;
                obj.expand = true;
                obj.selected = true;
                obj.loading = false;
                obj.render = this.renderContentRoot;
                if (!!rootNode.children && rootNode.children.length !== 0) {
                    obj.children = this.getTreeNodes(rootNode.children, obj);
                } else {
                    obj.children = [];
                }
            }
            arr.push(obj);
            return arr;
        },
        // 格式化子节点数据
        getTreeNodes (nodes = [], parentNode = {}) {
            let arr = [];
            if (!!nodes && nodes.length !== 0) {
                nodes.forEach(item => {
                    let obj = {};
                    obj.id = item.id;
                    obj.parentId = item.parentId;
                    obj.parent = {id: obj.parentId, title: parentNode.title, name: parentNode.name, code: parentNode.code};
                    obj.parentCode = parentNode.code;
                    obj.name = item.name;
                    obj.code = item.code;
                    obj.createDate = item.createDate;
                    obj.describe = item.describe;
                    obj.financialCode = item.financialCode;
                    obj.areaCode = item.areaCode;
                    obj.isOrg = item.isOrg;
                    obj.title = item.name;
                    obj.expand = false;
                    obj.selected = false;
                    obj.loading = false;
                    obj.children = this.getTreeNodes(item.children, obj); // 递归调用
                    arr.push(obj);
                });
            }
            return arr;
        },
        clickTarget (root, node, data) {
            // 保存当前选中的节点信息
            this.rootNode = root;
            this.currentNode = node;
            this.currentData = data;
            // 发送当前选中的节点信息到本组件的on-select-node事件
            this.$emit('on-select-node', data);
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
            // if (item.title !== 'appended node') { // 不是新增节点，才取下级节点信息
            Util.ajax.post('/dept/getChildrenDepts', {deptId: item.id})
                .then(function (response) {
                    let respDepts = response.data;
                    data = vm.getTreeNodes(respDepts, item);
                    callback(data);
                });
            // }
        },
        // 渲染根节点
        renderContentRoot (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'ios-folder-outline'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        marginLeft: '16px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-plus-empty',
                            type: 'primary'
                        }),
                        class: 'ivu-btn-small',
                        style: {
                            width: '52px'
                        },
                        on: {
                            click: () => { this.append(root, node, data); }
                        }
                    })
                ])
            ]);
        },
        // 渲染子节点
        renderContent (h, { root, node, data }) {
            let vm = this;
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'ios-paper-outline'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', {
                        class: [
                            'ivu-tree-title',
                            {
                                'ivu-tree-title-selected': data.selected
                            }
                        ],
                        on: {
                            click: (event) => {
                                event.preventDefault();
                                if (data.disabled) return;
                                vm.$refs['deptTree'].$emit('on-selected', data.nodeKey);
                                vm.clickTarget(root, node, data);
                            }
                        }
                    }, data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        marginLeft: '16px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-plus-empty'
                        }),
                        class: 'ivu-btn-small',
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => { this.append(root, node, data); }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-minus-empty'
                        }),
                        class: 'ivu-btn-small',
                        on: {
                            click: () => { this.remove(root, node, data); }
                        }
                    })
                ])
            ]);
        },
        append (root, node, data) {
            let vm = this;
            Util.ajax.post('/dept/getChildrenDepts', {deptId: data.id})
                .then(function (response) {
                    let respDepts = response.data;
                    let children = vm.getTreeNodes(respDepts);
                    children.push({
                        title: 'appended node',
                        expand: false,
                        id: '',
                        parentId: data.id,
                        parentCode: data.code,
                        parent: {id: data.id, name: data.name, code: data.code}
                    });
                    vm.$set(data, 'children', children);
                    data.expand = true;
                });
            // const children = data.children || [];
            // children.push({
            //     title: 'appended node',
            //     expand: true
            // });
            // this.$set(data, 'children', children);
        },
        remove (root, node, data) {
            // const parentKey = root.find(el => el === node).parent;
            this.showModal = true;
            this.rootNode = root;
            this.currentNode = node;
            this.currentData = data;
        },
        delOk () {
            this.modal_loading = true;
            const parentKey = this.currentNode.parent;
            const parent = this.rootNode.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(this.currentData);
            let vm = this;
            Util.ajax.post('/dept/deleteOne', {deptId: vm.currentData.id})
                .then(function (response) {
                    let respType = response.data.type;
                    let respData = response.data.data;
                    if (respType === '0') {
                        parent.children.splice(index, 1);
                        vm.modal_loading = false;
                        vm.showModal = false;
                        vm.$Message.info('删除成功');
                    } else {
                        vm.modal_loading = false;
                        vm.showModal = false;
                        vm.$Message.info('删除失败' + respData);
                    }
                })
                .catch(function (error) {
                    // console.log(error);
                    vm.modal_loading = false;
                    vm.showModal = false;
                    vm.$Message.info('删除失败' + error);
                    vm.$router.push({
                        name: 'login'
                    });
                });
        }
    }
};
</script>
