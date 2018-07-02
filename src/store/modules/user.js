import Cookies from 'js-cookie';

const user = {
    state: {
        user: ''
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            // Cookies.remove('password'); // hzw:不要保存密码
            // Cookies.remove('access'); // hzw:不要保存权限信息
            sessionStorage.clear();
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        login (state, username, webToken) {
            sessionStorage.user = username;
            sessionStorage.webToken = webToken;
            state.user = username;
        },
        updateUser (state) {
            state.user = sessionStorage.user ? sessionStorage.user : '未登陆用户';
        }
    }
};

export default user;
