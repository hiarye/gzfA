<template>
    <div>
        <Button type="text" @click="openModal"><Icon type="plus-round" size="100px"></Icon></Button>
        <Modal
            v-model="showModal"
            title="新增用户">
            <user-form :dept-id="deptId" @on-done="closeModal"></user-form>
            <div slot="footer">
                
            </div>
        </Modal>
    </div>
</template>
<script>
    import userForm from './userForm.vue';
    export default {
        props: ['deptId'],
        data () {
            return {
                showModal: false
            };
        },
        components: {
            userForm
        },
        methods: {
            openModal () {
                if (!this.deptId) {
                    this.$Message.info('请先选择机构');
                    return;
                }
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
            },
            closeModal (isSave) {
                this.showModal = false;
                if (isSave) {
                    this.$emit('on-refresh-table', this.deptId);
                }
            }
        }
    };
</script>
