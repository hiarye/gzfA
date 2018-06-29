<template>
    <div>
        <Table :data="tableData" :columns="tableColumns" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="tablePage.total" :current="tablePage.current" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal
            v-model="showModalDetail"
            title="查看/修改角色">
            <role-form2 :role="role" @on-done="closeModalDetail"></role-form2>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
            v-model="showModalAuth"
            title="角色授权" 
            :closable="false"
            :mask-closable="false"> 
            <role-router :role="role" @on-done="closeModalAuth"></role-router>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="showModalDel" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>删除后将不可恢复！</p>
                <p>您是否要删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_del_loading" @click="delOk">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Util from '@/libs/util';
    import roleForm2 from './roleForm2.vue';
    import roleRouter from './roleRouter.vue';

    export default {
        components: {
            roleForm2,
            roleRouter
        },
        props: ['refresh'],
        data () {
            return {
                role: {},
                showModalDetail: false,
                showModalDel: false,
                showModalAuth: false,
                modal_del_loading: false,
                toDelId: '',
                refresh_: false,
                tableData: [],
                tablePage: {
                    total: 0,
                    current: 1
                },
                tableColumns: [
                    {
                        title: '角色名',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '是否启用',
                        key: 'enabled',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.enabled ? 'green' : 'red';
                            const text = row.enabled ? '是' : '否';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '描述',
                        key: 'describe'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showModalDetail = true;
                                            this.role = params.row;
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.confirmDel(params.row.id);
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showModalAuth = true;
                                            this.role = params.row;
                                        }
                                    }
                                }, '授权')
                            ]);
                        }
                    }
                ]
            };
        },
        mounted () {
            this.refreshData();
        },
        watch: {
            refresh: function () {
                this.refresh_ = !(this.refresh_);
            },
            refresh_: function () {
                this.refreshData();
            }
        },
        methods: {
            formatDate (date) {
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            changePage (currentPage) {
                let vm = this;
                Util.ajax.post('/role/getRolesByDeptIdAndPaged', {'currentPage': currentPage})
                    .then(function (response) {
                        let page = response.data;
                        vm.tablePage.total = page.totalCount;
                        vm.tablePage.current = page.currentPage;
                        vm.tableData = page.data;
                    });
            },
            closeModalDetail (isSave) {
                this.showModalDetail = false;
                if (isSave) {
                    this.refreshData();
                }
            },
            closeModalAuth (isSave) {
                this.showModalAuth = false;
            },
            confirmDel (id) {
                this.showModalDel = true;
                this.toDelId = id;
            },
            delOk () {
                let vm = this;
                Util.ajax.post('/role/deleteOne', {id: this.toDelId})
                    .then(function (response) {
                        let respType = response.data.type;
                        if (respType === '0') {
                            vm.refresh_ = !(vm.refresh_);
                            vm.showModalDel = false;
                            vm.$Message.info('删除成功!');
                        } else {
                            vm.showModalDel = false;
                            vm.$Message.info('删除失败!');
                        }
                    }).catch(function (error) {
                        vm.console.error(error);
                        vm.showModalDel = false;
                        vm.$Message.info('删除失败!');
                    });
            },
            refreshData () {
                let vm = this;
                Util.ajax.post('/role/getRolesPaged', {'currentPage': 1})
                    .then(function (response) {
                        let page = response.data;
                        vm.tablePage.total = page.totalCount;
                        vm.tablePage.current = page.currentPage;
                        vm.tableData = page.data;
                    });
            }
        }
    };
</script>
