import lz from './lazyimg'

const lazyimg = {
    install:function(Vue) {
        Vue.component('lazyimg',lz)
    }
}

export default lazyimg