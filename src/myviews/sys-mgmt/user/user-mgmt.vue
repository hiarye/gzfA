<template>
    <div>
        <Row :gutter="16">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title">
                        机构树
                    </p>
                    <div>
                        <org-tree @on-select-dept="refreshData"></org-tree>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="16" :style="{marginBottom: '10px'}">
                <Row>
                    <Card>
                        <p slot="title">
                            用户列表
                        </p>
                        <div slot="extra">
                            <user-add :dept-id="deptId" @on-refresh-table="refreshData"></user-add>
                        </div>
                        <div>
                            <user-table :refresh-table="refreshTable" :dept-id="deptId" @on-refresh-table="refreshData"></user-table>
                        </div>
                    </Card>
                </Row>
                <br>
                <!-- <Row>
                    <Card>
                        <p slot="title">
                            用户信息
                        </p>
                        <div>
                            <user-form></user-form>
                        </div>
                    </Card>
                </Row> -->
            </Col>
        </Row>
    </div>
</template>

<script>
import orgTree from '@/myviews/common-components/orgTree.vue';
import userTable from './userTable.vue';
import userAdd from './userAdd.vue';

export default {
    name: 'user-mgmt',
    components: {
        orgTree,
        userTable,
        userAdd
    },
    data () {
        return {
            deptId: '',
            refreshTable: false
        };
    },
    methods: {
        addUser () {

        },
        refreshData (deptId) {
            this.deptId = deptId;
            this.refreshTable = !(this.refreshTable);
        }
    },
    mounted () {
    },
    watch: {
    }
};
</script>

