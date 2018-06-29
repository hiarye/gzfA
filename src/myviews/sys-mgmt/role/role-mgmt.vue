<template>
    <div>
        <Card>
            <p slot="title">
                角色列表
            </p>
            <div slot="extra">
                <role-add @on-refresh-table="refreshTable"></role-add>
            </div>
            <div>
                <role-table :refresh="refresh"></role-table>
            </div>
        </Card>
    </div>
</template>

<script>
import roleTable from './roleTable.vue';
import roleAdd from './roleAdd.vue';
import roleForm from './roleForm.vue';

export default {
    name: 'role-mgmt',
    components: {
        roleTable,
        roleAdd,
        roleForm
    },
    data () {
        return {
            refresh: false
        };
    },
    methods: {
        refreshTable () {
            this.refresh = !(this.refresh);
        }
    },
    mounted () {
    },
    watch: {
    }
};
</script>

