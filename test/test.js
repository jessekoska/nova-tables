import Vue from 'vue';
import VueResource from 'vue-resource';
import VueResourceMocker from 'vue-resource-mocker';

// PhantomJS doesn't have Promises, so we need to supply them. But if it ever
// gets them, this should let us seamlessly use the native ones.
if (!global.Promise) {
    global.Promise = require('promise');
}

Vue.use(VueResource);
Vue.httpMocker = new VueResourceMocker();
Vue.use(Vue.httpMocker);

/**
 * The transition-group tag in Vue.js causes delayed effects that are very 
 * hard to test. This replaces it entirely for the tests. Now 
 * <transition-group> is acts like a <slot> that can have its tag type 
 * defined by the `tag` prop.
 */
Vue.component('transition-group', {
    props: ['tag'],
    render(createElement) {
        return createElement(this.tag || this.$vnode.data.tag || 'span', this.$slots.default);
    },
});

/**
 * In many tests we have to wait for more than one call to nextTick() before 
 * a Vue component is in the state we need. This makes it easy.
 * @param  number n how many times to wait
 * @return Promise  calls `then` after two tick cycles
 */
Vue.waitTicks = function (n) {
    var promise = this.nextTick();
    for (var i = 1; i < n; i++) {
        promise = promise.then(() => this.nextTick());
    }
    return promise;
};

// Require all test files using special Webpack feature
// https://webpack.github.io/docs/context.html#require-context
var testsContext = require.context('./', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
