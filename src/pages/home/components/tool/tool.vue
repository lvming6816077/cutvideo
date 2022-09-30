<template>
    <div class="wrap" >
        <div class="split item" @click="split"></div>
        <div class="delete item" @click="deleteF"></div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, onUnmounted } from "vue";
import _ from "lodash"
import mitt from "@/utils/mitt";

export default defineComponent({
    name: "tool",
    props: {

    },
    setup(props,context) {
        const split = ()=>{
            mitt.emit("split")
        }
        const deleteF = ()=>{

        }
        return {
            split,
            deleteF
        };
    },
});
</script>

<style lang="less" scoped>
    .wrap {
        margin: 0 auto;
        display: flex;
        width: 880px;
        margin-top: 30px
    }
    .item {
        cursor: pointer;
        width:25px;
        height: 25px;
        background-size:cover;
        margin-right: 10px;
    }
    .split {

        background-image: url(./imgs/split.png);
    }
    .delete {

        background-image: url(./imgs/delete.png);
    }

</style>
