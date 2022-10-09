<template>
    <div class="controls-images-container">
        <timeline :width="880" :max="max" @changeTimeline="changeTimeline" v-if="imageList.length"/>
        <ruler :width="880" :max="max"/>
        <div class="controls-images-inner" v-if="imageList.length">
            <span v-for="(item,index) in dividerList.list" :key="index" :class="curIndex == index ? 'active':''"  class="inner-item">
                <div class="divider" @click="dividerClick(index)" :style="{left:item.dividerLeft.tranX+'px',width:(item.dividerRight.tranX-item.dividerLeft.tranX)+'px',height:'60px'}">
                    <div class="divider-inner"></div>
                    <imglists :imageList="imageList" :dwidth="item.dividerRight.tranX-item.dividerLeft.tranX" :dx="item.dividerLeft.tranX"/>
                </div>
                <div class="divider-left" @mousedown="mousedownLeft(index,$event)" :style="{transform:'translateX('+item.dividerLeft.tranX+'px)'}"></div>
                <div class="divider-right" @mousedown="mousedownRight(index,$event)" :style="{transform:'translateX('+item.dividerRight.tranX+'px)'}"></div>
                
            </span>

        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, onUnmounted,toRaw,computed } from "vue";
import _ from "lodash"
import ruler from "../ruler/ruler.vue"
import timeline from "../timeline/timeline.vue"
import imglists from "./imglists.vue"
import mitt from "@/utils/mitt";
import { v4 as uuidv4 } from 'uuid';
import Vuex from 'vuex'

export default defineComponent({
    name: "screenshot",
    components:{ruler,timeline,imglists},
    props: {
        imageList:{
            type:Array,
            default:()=>[]
        },
    },
    setup(props,context) {
        const store = Vuex.useStore()
        let min = 0
        let max = ref(880)
        let curIndex = ref(0)
        let timelinex = 0
        const changeTimeline=(v,x)=>{
            timelinex = x
            context.emit('changeTimeline',v,x)
        }

        const handleCurDivider = () => {
            // let max = 880,min = 0
            let o = dividerList.list[curIndex.value]
            if (!o) return null
            o.dividerLeft.endXTime = o.dividerLeft.endX/(max.value-min)
            o.dividerRight.endXTime = o.dividerRight.endX/(max.value-min)
            return {
                ...toRaw(o),
            }
        }


        let dividerList = reactive({
            list:[]
        })

        let dividerLeft = {
            dragFlag:false,
            startX:0,
            moveX:0,
            endX:0,
            tranX:0
        }
        let dividerRight = {
            dragFlag:false,
            startX:0,
            moveX:0,
            endX:max.value,
            tranX:max.value
        }
        dividerList.list.push({dividerLeft,dividerRight,id:uuidv4()})

        store.dispatch('setCurDivider',handleCurDivider())

        mitt.on("split",()=>{
            splitD()
        })
        mitt.on("remove",()=>{
            deleteD()
        })

        const deleteD =()=>{
            
            var deleteItem = dividerList.list[curIndex.value]
            var deleteWidth = Math.abs(deleteItem.dividerLeft.endX-deleteItem.dividerRight.endX)
            for (var i = 0 ; i < dividerList.list.length ; i++) {
                var cur = dividerList.list[i]
                if (i > curIndex.value) {
                    cur.dividerLeft.endX -= deleteWidth
                    cur.dividerLeft.tranX -= deleteWidth
                    cur.dividerRight.endX -= deleteWidth
                    cur.dividerRight.tranX -= deleteWidth
                }
            }
            dividerList.list.splice(curIndex.value,1)
            max.value = max.value-deleteWidth

            setTimeout(()=>{
                curIndex.value = curIndex.value-1
                store.dispatch('setCurDivider',handleCurDivider())
                store.dispatch('addDeleteDivider',deleteItem)
            },200)
        }

        const splitD = ()=>{

            var x = timelinex
            var array = []
            for (var i = 0 ; i<dividerList.list.length ; i++) {
                var cur = dividerList.list[i]
                if (cur.dividerLeft.endX < x && cur.dividerRight.endX>x) {
                    array.push({
                        id:uuidv4(),
                        dividerLeft:{
                            dragFlag:false,
                            startX:0,
                            moveX:0,
                            endX:cur.dividerLeft.endX,
                            tranX:cur.dividerLeft.endX
                        },
                        dividerRight:{
                            dragFlag:false,
                            startX:0,
                            moveX:0,
                            endX:x,
                            tranX:x
                        }
                    })
                    array.push({
                        id:uuidv4(),
                        dividerLeft:{
                            dragFlag:false,
                            startX:0,
                            moveX:0,
                            endX:x+1,
                            tranX:x+1
                        },
                        dividerRight:{
                            dragFlag:false,
                            startX:0,
                            moveX:0,
                            endX:cur.dividerRight.endX,
                            tranX:cur.dividerRight.endX
                        }
                    })
                    curIndex.value = i
                } else {
                    array.push(cur)
                }
            }
            
            dividerList.list = array
            store.dispatch('setCurDivider',handleCurDivider())
        }


        const mousedownLeft = (index,e)=>{
            curIndex.value = index
            let dividerLeft = dividerList.list[curIndex.value].dividerLeft
            dividerLeft.dragFlag = true
            dividerLeft.startX = e.clientX
        }
        const mousedownRight = (index,e)=>{
            curIndex.value = index
            let dividerRight = dividerList.list[curIndex.value].dividerRight
            dividerRight.dragFlag = true
            dividerRight.startX = e.clientX
        }

        const mousemove = (e)=>{
            
            let dividerRight = dividerList.list[curIndex.value].dividerRight
            let dividerLeft = dividerList.list[curIndex.value].dividerLeft
            
            if (dividerLeft.dragFlag) {
                let dis = e.clientX-dividerLeft.startX
                dividerLeft.tranX = Math.min(Math.max(dis+dividerLeft.endX,min),max.value)

            }
            if (dividerRight.dragFlag) {

                let dis = e.clientX-dividerRight.startX
                dividerRight.tranX = Math.min(Math.max(dis+dividerRight.endX,min),max.value)

            }
            e.preventDefault()
            e.stopPropagation()
        }
        const mouseup = ()=>{
            
            let dividerRight = dividerList.list[curIndex.value].dividerRight
            let dividerLeft = dividerList.list[curIndex.value].dividerLeft
            
            // 以右侧拖动结束
            if (dividerRight.dragFlag == true) {
                dividerRight.dragFlag = false
                dividerRight.endX = dividerRight.tranX
                let dlNext = dividerList.list[curIndex.value+1]
                if (dlNext) {
                    dlNext.dividerLeft = {
                        dragFlag:false,
                        startX:0,
                        moveX:0,
                        endX:dividerRight.endX+1,
                        tranX:dividerRight.endX+1
                    }
                }
            }
            // 以左侧拖动结束
            if (dividerLeft.dragFlag == true) {
                dividerLeft.dragFlag = false
                dividerLeft.endX = dividerLeft.tranX
                let dlPrev = dividerList.list[curIndex.value-1]
                if (dlPrev) {
                    dlPrev.dividerRight = {
                        dragFlag:false,
                        startX:0,
                        moveX:0,
                        endX:dividerLeft.endX-1,
                        tranX:dividerLeft.endX-1
                    }
                }
            }

        }

        onMounted(() => {
            document.addEventListener('mousemove',mousemove)
            document.addEventListener('mouseup',mouseup)
        });
        onUnmounted(()=>{
            document.removeEventListener('mousemove',mousemove)
            document.removeEventListener('mouseup',mouseup)
        })

        const dividerClick = (index)=>{
            curIndex.value = index
            store.dispatch('setCurDivider',handleCurDivider())
        }


        return {
            changeTimeline,
            dividerClick,
            curIndex,
            dividerList,
            max,
            mousedownLeft,
            mousedownRight,
            handleCurDivider
        };
    },
});
</script>

<style lang="less" scoped>
.controls-images-container {
    padding-top: 40px;
    padding-bottom: 100px;
    position: relative;
    margin-top: 24px;
    flex-direction: column;
    align-items: center;
    display: flex;

    .controls-images-inner {
        position: relative;
        margin-top: 70px;
        width:880px;
        background-color: #2a2a2e;
        height: 60px;
    }

    .inner-item.active {
        .divider-inner,.divider-left,.divider-right {
            opacity:  1;
            z-index: 999;
        }
        :deep(.img-wrap) {
            opacity:  1;
        }
    }
    .divider {
        position: absolute;
        left: 0;
        top:0;
        bottom: 0px;
        right: 0;
        transform: translateX(4px);
        
        z-index: 9;
    }
    .divider-inner {
        position: absolute;
        left:0;
        right:0;
        bottom:0;
        top:0;
        z-index: 3;
        background-color: rgba(255, 0, 0, 0.19);
        
        border-top: 2px solid #00c1cd;
        border-bottom: 2px solid #00c1cd;
        border-radius: 3px;
        pointer-events: none;
        
        opacity:  0;
    }
    .divider-left {
        opacity:  0;
        width: 10px;
        position: absolute;
        top: 0;
        bottom: 0px;
        background-color: #00c1cd;
        pointer-events: all;
        cursor: ew-resize;
        box-sizing: border-box;
        z-index: 99;

        

        transform: translateX(-100%);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;

        &::before {
            background-repeat: no-repeat;
            background-position: 50%;
            content: " ";
            width: 3px;
            height: 50px;
            background-image: url(./img/divider-dot.svg);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            margin-top: 0;
        }
    }
    .divider-right {
        opacity:  0;
        width: 10px;
        position: absolute;
        left:0px;
        top: 0;
        bottom: 0px;
        background-color: #00c1cd;
        pointer-events: all;
        cursor: ew-resize;
        box-sizing: border-box;

        

        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;

        &::before {
            background-repeat: no-repeat;
            background-position: 50%;
            content: " ";
            width: 3px;
            height: 50px;
            background-image: url(./img/divider-dot.svg);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            margin-top: 0;
        }
    }
}

</style>
