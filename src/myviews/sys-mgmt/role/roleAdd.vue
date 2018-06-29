<template>
    <div>
        <Button type="text" @click="openModal"><Icon type="plus-round" size="100px"></Icon></Button>
        <Modal
            v-model="showModal"
            title="新增角色">
            <role-form @on-done="closeModal"></role-form>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>
<script>
    import roleForm from './roleForm.vue';
    export default {
        data () {
            return {
                showModal: false
            };
        },
        components: {
            roleForm
        },
        methods: {
            openModal () {
                this.showModal = true;
            },
            closeModal (isSave) {
                this.showModal = false;
                if (isSave) {
                    this.$emit('on-refresh-table');
                }
            }
        }
    };
</script>
