<template>
    <div>
        <Table :data="tableData" :columns="tableColumns" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="tablePage.total" :current="tablePage.current" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal
            v-model="showModal"
            title="查看/修改用户">
            <user-form2 :user="user" @on-done="closeModal"></user-form2>
            <div slot="footer">
                
            </div>
        </Modal>
    </div>
</template>
<script>
    import Util from '@/libs/util';
    import userForm2 from './userForm2.vue';

    export default {
        components: {
            userForm2
        },
        props: ['deptId', 'refreshTable'],
        data () {
            return {
                user: {},
                showModal: false,
                refresh: false,
                tableData: [],
                tablePage: {
                    total: 0,
                    current: 1
                },
                tableColumns: [
                    {
                        title: '用户名',
                        key: 'username',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.username)
                            ]);
                        }
                    },
                    {
                        title: '是否管理员',
                        key: 'administrator',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.administrator ? 'red' : 'green';
                            const text = row.administrator ? '是' : '否';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '中文名称',
                        key: 'cname'
                    },
                    {
                        title: '英文名称',
                        key: 'ename'
                    },
                    {
                        title: '身份证',
                        key: 'identityCard'
                    },
                    {
                        title: '手机',
                        key: 'mobile'
                    },
                    {
                        title: '电子邮件',
                        key: 'email'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
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
                                            this.showModal = true;
                                            this.user = params.row;
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleDelete(params.row.username, this.deptId);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                    // {
                    //     title: 'Status',
                    //     key: 'status',
                    //     render: (h, params) => {
                    //         const row = params.row;
                    //         const color = row.status === 1 ? 'blue' : row.status === 2 ? 'green' : 'red';
                    //         const text = row.status === 1 ? 'Working' : row.status === 2 ? 'Success' : 'Fail';

                    //         return h('Tag', {
                    //             props: {
                    //                 type: 'dot',
                    //                 color: color
                    //             }
                    //         }, text);
                    //     }
                    // },
                    // {
                    //     title: 'Portrayal',
                    //     key: 'portrayal',
                    //     render: (h, params) => {
                    //         return h('Poptip', {
                    //             props: {
                    //                 trigger: 'hover',
                    //                 title: params.row.portrayal.length + 'portrayals',
                    //                 placement: 'bottom'
                    //             }
                    //         }, [
                    //             h('Tag', params.row.portrayal.length),
                    //             h('div', {
                    //                 slot: 'content'
                    //             }, [
                    //                 h('ul', this.tableData1[params.index].portrayal.map(item => {
                    //                     return h('li', {
                    //                         style: {
                    //                             textAlign: 'center',
                    //                             padding: '4px'
                    //                         }
                    //                     }, item);
                    //                 }))
                    //             ])
                    //         ]);
                    //     }
                    // },
                    // {
                    //     title: 'People',
                    //     key: 'people',
                    //     render: (h, params) => {
                    //         return h('Poptip', {
                    //             props: {
                    //                 trigger: 'hover',
                    //                 title: params.row.people.length + 'customers',
                    //                 placement: 'bottom'
                    //             }
                    //         }, [
                    //             h('Tag', params.row.people.length),
                    //             h('div', {
                    //                 slot: 'content'
                    //             }, [
                    //                 h('ul', this.tableData1[params.index].people.map(item => {
                    //                     return h('li', {
                    //                         style: {
                    //                             textAlign: 'center',
                    //                             padding: '4px'
                    //                         }
                    //                     }, item.n + '：' + item.c + 'People');
                    //                 }))
                    //             ])
                    //         ]);
                    //     }
                    // },
                    // {
                    //     title: 'Sampling Time',
                    //     key: 'time',
                    //     render: (h, params) => {
                    //         return h('div', 'Almost' + params.row.time + 'days');
                    //     }
                    // },
                    // {
                    //     title: 'Updated Time',
                    //     key: 'update',
                    //     render: (h, params) => {
                    //         return h('div', this.formatDate(this.tableData1[params.index].update));
                    //     }
                    // }
                ]
            };
        },
        mounted () {
        },
        watch: {
            refreshTable: function () {
                this.refresh = !(this.refresh);
            },
            refresh: function () {
                let vm = this;
                Util.ajax.post('/user/getUsersByDeptIdAndPaged', {'deptId': this.deptId, 'currentPage': 1})
                    .then(function (response) {
                        let page = response.data;
                        vm.tablePage.total = page.totalCount;
                        vm.tablePage.current = page.currentPage;
                        vm.tableData = page.data;
                    });
            }
        },
        methods: {
            // mockTableData1 () {
            //     let data = [];
            //     for (let i = 0; i < 5; i++) {
            //         data.push({
            //             name: 'Business' + Math.floor(Math.random() * 100 + 1),
            //             status: Math.floor(Math.random() * 3 + 1),
            //             portrayal: ['City', 'People', 'Cost', 'Life', 'Entertainment'],
            //             people: [
            //                 {
            //                     n: 'People' + Math.floor(Math.random() * 100 + 1),
            //                     c: Math.floor(Math.random() * 1000000 + 100000)
            //                 },
            //                 {
            //                     n: 'People' + Math.floor(Math.random() * 100 + 1),
            //                     c: Math.floor(Math.random() * 1000000 + 100000)
            //                 },
            //                 {
            //                     n: 'People' + Math.floor(Math.random() * 100 + 1),
            //                     c: Math.floor(Math.random() * 1000000 + 100000)
            //                 }
            //             ],
            //             time: Math.floor(Math.random() * 7 + 1),
            //             update: new Date()
            //         });
            //     }
            //     return data;
            // },
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
                Util.ajax.post('/user/getUsersByDeptIdAndPaged', {'deptId': this.deptId, 'currentPage': currentPage})
                    .then(function (response) {
                        let page = response.data;
                        vm.tablePage.total = page.totalCount;
                        vm.tablePage.current = page.currentPage;
                        vm.tableData = page.data;
                    });
            },
            closeModal (isSave) {
                this.showModal = false;
                if (isSave) {
                    this.$emit('on-refresh-table', this.deptId);
                }
            },
            handleDelete (username, deptId) {
                let vm = this;
                Util.ajax.post('/user/deleteOne', {username: username, deptId: deptId})
                    .then(function (response) {
                        let respType = response.data.type;
                        if (respType === '0') {
                            vm.refresh = !(vm.refresh);
                            vm.$Message.info('删除成功!');
                        } else {
                            vm.$Message.info('删除失败!');
                        }
                    }).catch(function (error) {
                        vm.console.error(error);
                        vm.$Message.info('删除失败!');
                    });
            }
        }
    };
</script>
