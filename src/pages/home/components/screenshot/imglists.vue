<template>
    <div class="img-wrap">
        <canvas ref="imglistCanvas"  :style="{width:dwidth+'px',height:'60px'}"></canvas>
        <!-- <img :src="src" style="width:880px;height:60px;display:none"/> -->
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, computed,watch } from "vue";
import _ from "lodash"
import Vuex from 'vuex'
import mitt from "@/utils/mitt";
import cutimage from "@/utils/cutimage"

export default defineComponent({
    name: "imglists",

    props: {
        imageList:{
            type:Array,
            default:()=>[]
        },
        dwidth:{
            type:Number,
            default:0
        },
        dx:{
            type:Number,
            default:0
        }
    },
    setup(props,context) {
        const store = Vuex.useStore()
        let curDivider = computed(() => store.state.curDivider)
        const height = 60
        let width = 880


        const imageList = props.imageList

        const imglistCanvas = ref(null)
        const src = ref(null)
        let imglistOfflineCanvas = null

        mitt.on("remove",()=>{
            let c = curDivider.value
            // debugger
            var deleteWidth = Math.abs(c.dividerLeft.endX-c.dividerRight.endX)
            var oriWidth = width-c.dividerRight.endX
            console.log(width,c,oriWidth,deleteWidth)
            width = width-deleteWidth
            imglistOfflineCanvas = cutimage(width,height,c.dividerLeft.endX,c.dividerRight.endX,oriWidth,imglistOfflineCanvas)
            renderList(props.dwidth,props.dx)
        })
        const drawImgList = () => {
            // 离屏canvas
            imglistOfflineCanvas = document.createElement('canvas');
            const imglistOfflineCtx = imglistOfflineCanvas.getContext('2d');
            imglistOfflineCanvas.style.width = width
            imglistOfflineCanvas.style.height = height

            // 双倍*2 高清
            imglistOfflineCanvas.width = width*2;
            imglistOfflineCanvas.height = height*2;

            for (let i = 0 ; i < imageList.length ; i++) {
                let image = new Image()
                image.src = imageList[i]
                
                image.onload = (e)=>{
                    imglistOfflineCtx.drawImage(image,(i*80*2),0,80*2,60*2)
                }
                
            }

            setTimeout(()=>{
                renderList(props.dwidth,props.dx)
            },300)
            

        }


        const renderList = (dwidth,dx)=>{
            const imglisCtx = imglistCanvas.value.getContext('2d');

            // 双倍*2 高清
            imglistCanvas.value.width = dwidth*2;
            imglistCanvas.value.height = 120;

            imglisCtx.drawImage(imglistOfflineCanvas,dx*2,0,dwidth*2,120,0,0,dwidth*2,120)
        }

        watch(()=>[props.dwidth,props.dx], (currentValue, oldValue) => {
            // console.log(currentValue);
            renderList(currentValue[0],currentValue[1])
        },{ deep: true });

        onMounted(()=>{
            drawImgList()
        })
        return {
            src,
            imglistCanvas
        };
    },
});
</script>

<style lang="less" scoped>
.img-wrap {
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    height: 60px;
    opacity: 0.1;
}

</style>
