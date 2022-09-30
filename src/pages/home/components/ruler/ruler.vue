<template>
    <canvas id="ruler" ref="rulerCanvas"></canvas>
</template>

<script>
import { defineComponent, ref, onMounted, reactive } from "vue";

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
        const getSize = (num) => {
            return (1) * num;
        }
        const drawRuler = () => {
            const height = 30
            const rulerCtx = rulerCanvas.value.getContext('2d');
            rulerCanvas.value.width = getSize(props.width);
            rulerCanvas.value.height = getSize(height);
            rulerCtx.fillStyle = "#aaaaaa";
            rulerCtx.font = `${getSize(8)}px Arial`;
            rulerCtx.textBaseline = 'middle';
            
            rulerCtx.textAlign = 'center';
            for (let i = 0; i < props.width; i += 10) {
                if (i % 100 === 0) {
                rulerCtx.fillRect (getSize(i), 0, getSize(1), getSize(10));
                if (i) {
                    rulerCtx.fillText(i, getSize(i), getSize(25))
                }
                } else {
                rulerCtx.fillRect (getSize(i), 0, getSize(1), getSize(5));
                }
            }
        }

        onMounted(()=>{
            drawRuler()
        })
        return {
            rulerCanvas
        };
    },
});
</script>

<style lang="less">

</style>
