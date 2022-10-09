
import { createStore } from 'vuex'

export default createStore({
    state: {
        curDivider: {},
        deleteDivider: [],
        videoDuration: 0,
    },
    mutations: {

        setCurDivider(state, obj) {
            state.curDivider = obj
        },
        addDeleteDivider(state, obj) {
            state.deleteDivider.push(obj)
        },
        removeDeleteDivider(state, obj) {
            state.deleteDivider.pop()
        },
        setVideoDuration(state, obj) {
            state.videoDuration = obj
        }
    },
    actions: {
        setCurDivider(context, obj) {
            context.commit('setCurDivider', obj)
        },
        addDeleteDivider(context, obj) {
            context.commit('addDeleteDivider', obj)
        },
        removeDeleteDivider(context, obj) {
            context.commit('removeDeleteDivider', obj)
        },
        setVideoDuration(context, obj) {
            context.commit('setVideoDuration', obj)
        }
    }
})