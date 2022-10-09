<template>
    <div class="wrap" >
        <div class="item-wrap">
            <div class="split item" @click="split"></div>
        </div>
        <div class="item-wrap">
            <div class="delete item" @click="deleteF"></div>
        </div>
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
            mitt.emit("remove")
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
    }
    .item-wrap {
        padding: 3px;
        margin-right: 10px;
        border-radius: 2px;
        &:hover{
            background-color: #000;
        }
    }
    .split {

        background-image: url(./imgs/split.png);
    }
    .delete {

        background-image: url(./imgs/delete.png);
    }

</style>
