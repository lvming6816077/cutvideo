<template>
    <div class="top-nav"></div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive } from "vue";

export default defineComponent({
    name: "topheader",
    setup() {

        return {

        };
    },
});
</script>

<style lang="less">
    .top-nav {
        background-color: #202023;
        height: 48px;
        border-bottom: 2px solid #121212;
    }
</style>
