<template>
    <div>
        <Row :gutter="16">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title">
                        机构树
                    </p>
                    <div>
                        <dept-tree @on-select-node="refreshData"></dept-tree>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="16" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title">
                        机构信息
                    </p>
                    <div>
                        <dept-form :initial="deptInfo"></dept-form>
                    </div>
                </Card>               
            </Col>
        </Row>
    </div>
</template>

<script>
import deptTree from './deptTree.vue';
import deptForm from './deptForm';

export default {
    name: 'dept-mgmt',
    components: {
        deptTree,
        deptForm
    },
    data () {
        return {
            deptInfo: {}
        };
    },
    methods: {
        refreshData (data) {
            this.deptInfo = data;
        }
    },
    mounted () {
    },
    watch: {
    }
};
</script>

