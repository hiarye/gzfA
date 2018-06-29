<template>
    <div>
        <Button type="text" @click="openModal"><Icon type="plus-round" size="100px"></Icon></Button>
        <Modal
            v-model="showModal"
            title="新增节点"
            @on-ok="ok"
            @on-cancel="cancel">
            <router-form></router-form>
        </Modal>
    </div>
</template>
<script>
    import routerForm from './routerForm.vue';
    export default {
        data () {
            return {
                showModal: false
            };
        },
        components: {
            routerForm
        },
        methods: {
            openModal () {
                this.showModal = true;
                // TODO 清空form中的值
            },
            ok () {
                // this.$Message.info('Clicked ok');
                // TODO 调用axios服务，保存数据
            },
            cancel () {
                // this.$Message.info('Clicked cancel');
                // TODO 清空form中的值
            }
        }
    };
</script>
