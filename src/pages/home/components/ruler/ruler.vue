<template>
    <canvas id="ruler" ref="rulerCanvas" :style="style"></canvas>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch, reactive } from "vue";
import Vuex from 'vuex'
import formatTime from "@/utils/times.js"

export default defineComponent({
    name: "topheader",
    props:{
        width:{
            type:Number,
            default:100
        }
    },
    setup(props) {
        const rulerCanvas = ref(null)
        const store = Vuex.useStore()
        let duration = computed(() => store.state.videoDuration)
        
        const height = 30
        const getSize = (num) => {
            return (2) * num;
        }
        let style = reactive({width:props.width+'px',height:height+'px'})
        const drawRuler = () => {
            const rulerCtx = rulerCanvas.value.getContext('2d');
            rulerCanvas.value.width = getSize(props.width);
            rulerCanvas.value.height = getSize(height);
            rulerCtx.fillStyle = "#aaaaaa";
            rulerCtx.font = `${getSize(8)}px Arial`;
            rulerCtx.textBaseline = 'middle';
            
            rulerCtx.textAlign = 'center';
            for (let i = 0; i < props.width; i += 10) {
                // console.log(i%100)
                if (i % 100 === 50) {
                    rulerCtx.fillRect (getSize(i), 0, getSize(1), getSize(10));
                    var text = formatTime(duration.value*(i/props.width))
                    if (text&& duration.value) {
                        
                        rulerCtx.fillText(text, getSize(i+0), getSize(25))
                    }
                } else {
                    rulerCtx.fillRect (getSize(i), 0, getSize(1), getSize(5));
                }
            }
        }

        watch(duration,(v)=>{
            // console.log(v)
            drawRuler()
        })

        onMounted(()=>{
            drawRuler()
        })
        return {
            style,
            rulerCanvas
        };
    },
});
</script>

<style lang="less">

</style>
