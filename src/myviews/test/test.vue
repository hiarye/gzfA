<template>
    <div>
        {{message}}
        <Button type="primary" @click="test()"></Button>
    </div>
</template>

<script>
import Util from '@/libs/util';

export default {
    name: 'test',
    components: {
    },
    data () {
        return {
            message: 'hello'
        };
    },
    methods: {
        test () {
            Util.ajax.get('/checkJwt')
                .then(function (response) {
                    console.log(response);
                });
        }
    },
    mounted () {
        Util.ajax.get('/getJwt')
            .then(function (response) {
                let bean = response.data;
                console.log(response);
                if (response.status === 200) { // 成功
                    localStorage.token = bean.data;
                }
            });
    },
    watch: {
    }
};
</script>

