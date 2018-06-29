<template>
    <div>
        <Row :gutter="16">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title">
                        路由树
                    </p>
                    <div>
                        <router-tree @on-select-node="refreshData"></router-tree>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="16" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title">
                        路由信息
                    </p>
                    <div>
                        <router-form :initial="routerInfo"></router-form>
                    </div>
                </Card>               
            </Col>
        </Row>
    </div>
</template>

<script>
import routerTree from './routerTree.vue';
import routerForm from './routerForm';
// import Util from '@/libs/util';

export default {
    name: 'dept-mgmt',
    components: {
        routerTree,
        routerForm
    },
    data () {
        return {
            routerInfo: {}
        };
    },
    methods: {
        refreshData (data) {
            this.routerInfo = data;
        }
    },
    mounted () {
    },
    watch: {
    }
};
</script>

