<template>
    <div class="controls-images-container">
        <timeline :width="880" @changeTimeline="changeTimeline" v-if="imageList.length"/>
        <ruler :width="880"/>
        <div class="controls-images-inner" v-if="imageList.length">
            <span v-for="(item,index) in dividerList.list" :key="index" :class="curIndex == index ? 'active':''">
                <div class="divider" :style="{left:item.dividerLeft.tranX+'px',width:(item.dividerRight.tranX-item.dividerLeft.tranX)+'px'}" @click="curIndex = index"></div>
                <div class="divider-left" @mousedown="mousedownLeft(index,$event)" :style="{transform:'translateX('+item.dividerLeft.tranX+'px)'}"></div>
                <div class="divider-right" @mousedown="mousedownRight(index,$event)" :style="{transform:'translateX('+item.dividerRight.tranX+'px)'}"></div>
            </span>
            <div class="images">
                <img
                    v-for="(item, index) in imageList"
                    :key="index"
                    class="img-item"
                    :src="item"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, onUnmounted } from "vue";
import _ from "lodash"
import ruler from "../ruler/ruler.vue"
import timeline from "../timeline/timeline.vue"
import mitt from "@/utils/mitt";

export default defineComponent({
    name: "screenshot",
    components:{ruler,timeline},
    props: {
        imageList:{
            type:Array,
            default:()=>[]
        },
    },
    setup(props,context) {
        const max = 880-4,min = 0
        let curIndex = ref(0)
        let timelinex = 0
        const changeTimeline=(v,x)=>{
            timelinex = x
            context.emit('changeTimeline',v)
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
            endX:max,
            tranX:max
        }
        dividerList.list.push({dividerLeft,dividerRight})

        mitt.on("split",()=>{
            split()
        })

        const split = ()=>{

            var x = timelinex
            var array = []
            for (var i = 0 ; i<dividerList.list.length ; i++) {
                var cur = dividerList.list[i]
                if (cur.dividerLeft.endX < x && cur.dividerRight.endX>x) {
                    array.push({
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
            
            console.log(dividerList.list)
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
                dividerLeft.tranX = Math.min(Math.max(dis+dividerLeft.endX,min),max)

            }
            if (dividerRight.dragFlag) {

                let dis = e.clientX-dividerRight.startX
                dividerRight.tranX = Math.min(Math.max(dis+dividerRight.endX,min),max)

            }
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


        return {
            changeTimeline,
            curIndex,
            dividerList,
            split,
            mousedownLeft,
            mousedownRight
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
    .img-item {
        width: 80px;
        float: left;
        height: 60px;
        object-fit: cover;
        user-select: none;
        opacity: 0.8;
    }
    .images {
        overflow: hidden;
        user-select: none;
    }
    .controls-images-inner {
        position: relative;
        margin-top: 70px;
    }
    span.active {
        .divider,.divider-left,.divider-right {
            opacity:  1;
            z-index: 999;
        }
    }
    .divider {
        position: absolute;
        left: 0;
        top:0;
        bottom: 0;
        border-top: 2px solid #00c1cd;
        border-bottom: 2px solid #00c1cd;
        opacity:  0;
        border-radius: 3px;
        transform: translateX(4px);
    }
    .divider-left {
        opacity:  0;
        width: 10px;
        position: absolute;
        top: 0;
        bottom: 0;
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
        bottom: 0;
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
