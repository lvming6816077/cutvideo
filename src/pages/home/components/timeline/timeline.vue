<template>
    <div class="wrap" :style="{width:(width)+'px'}">
        <div class="timeline-play-cursor" ref="timehd" @mousedown="mousedown">
            <div class="timeline-play-cursor-hd"  ></div>
            <div class="timeline-play-cursor-bd"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, onUnmounted } from "vue";
import _ from "lodash"

export default defineComponent({
    name: "timeline",
    props: {
        width:{
            type:Number,
            default:100
        },
        max:{
            type:Number,
            default:100
        }
    },
    setup(props,context) {
        let dragFlag = ref(false)
        let startX = 0,moveX = 0,endX = 0
        let timehd = ref(null)
        let tranX = 0
        let max = props.max,min = 0


        watch(()=>props.max, (currentValue, oldValue) => {
            max = currentValue
        },{ deep: true });
        // console.log(max)

        const mousedown = (e)=>{
            
            dragFlag.value = true

            startX = e.clientX
            
        }
        const mousemove = (e)=>{

            if (dragFlag.value) {
                moveX = e.clientX
                let dis = moveX-startX
                tranX = Math.min(Math.max(dis+endX,min),max)

                timehd.value.style.transform = 'translateX('+tranX+'px)'

                context.emit('changeTimeline',tranX/(max-min),tranX)

                e.preventDefault()
                e.stopPropagation()
                
            }
        }
        const mouseup = (e)=>{
            dragFlag.value = false
            endX = tranX
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
            mousedown,
            timehd
        };
    },
});
</script>

<style lang="less" scoped>
.timeline-play-cursor {
    bottom: 0;
    left: -7px;
    position: absolute;
    top: -7px;
    width: 10px;
    z-index: 6;
    pointer-events: auto;
}
.timeline-play-cursor-hd {
    cursor: pointer;
    background-color: #ffffffe6;
    border: 2px solid #ffffffe6;
    border-bottom: none;
    height: 12px;
    left: 0;
    position: -webkit-sticky;
    position: sticky;
    right: 0;
    top: 0;
    width: 10px;
    box-sizing: border-box;
    &::after {
        border-bottom: 2px solid #ffffffe6;
        border-right: 2px solid #ffffffe6;
        bottom: 0;
        content: "";
        display: block;
        height: 5px;
        position: absolute;
        right: 0px;
        transform: rotate(45deg) translate(2.8px,2px);
        width: 5px;
        background-color: #ffffffe6;
    }
}
.timeline-play-cursor-bd {
    background-color: #ffffffb0;
    bottom: 0;
    left: 4px;
    position: absolute;
    top: 16px;
    transform: translateX(0.5px);
    width: 1px;
    pointer-events: none;
}
.wrap {
    position: absolute;
    bottom: 0;
    z-index: 8;
    height: 271px;
    pointer-events: none;
}

</style>
