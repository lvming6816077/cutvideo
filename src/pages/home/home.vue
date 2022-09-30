<template>
    <div class="home-container">
        <topheader />
        <div class="uploader-container"   v-show="!duration">
            <div class="uploader-wrap" @click="goUpload">
                <div class="uploader"></div>
                <p class="title">点击上传视频文件.mp4</p>
                <input
                    style="display:none;"
                    type="file"
                    accept="video/*"
                    name=""
                    id="uploader"
                    @change="changeFile"
                    class="form-control"
                    required
                    ref="inputFile"
                />
            </div>
        </div>

        <div class="video-container" v-show="duration">
            
            <video
                class="video-prev"
                :src="videoSrc"
                ref="videoRef"
                @loadedmetadata="loadedmetadata"
            />
        </div>
        <div class="tool-container">
            <tool></tool>
        </div>

        <div class="screenshot-container">
            <screenshot :imageList="imageList" @changeTimeline="changeTimeline"/>
        </div>
        

    </div>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { defineComponent, ref, onMounted, reactive } from "vue";
import topheader from "./components/topheader/topheader.vue"
import tool from "./components/tool/tool.vue"
import screenshot from "./components/screenshot/screenshot.vue"

import _ from "lodash"
export default defineComponent({
    name: "Home",
    components:{topheader,screenshot,tool},
    setup() {
        // app state
        const ffmpeg = createFFmpeg({
            log: true,
        });

        const message = ref("Click Start to Transcode");
        let videoSrc = ref(null);
        let videoRef = ref(null);
        let duration = ref(0);
        let imageList = reactive([])//reactive(['http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg']);
        let initFfmpegFlag = ref(false)
        const inputFile = ref(null);
        const imgCount = 11;
        

        const loadedmetadata = () => {

            duration.value = videoRef.value.duration;
            let file = inputFile.value.files[0]
            var unit = duration.value / imgCount;
            transcodeImg(file,unit);
        };
        const goUpload = ()=>{
            inputFile.value.click()
        }
        const changeFile = () => {
            
            let videoFile = inputFile.value.files[0];
            videoSrc.value = URL.createObjectURL(videoFile);
            
        };

        const changeTimeline = _.throttle((v)=>{
            videoRef.value.currentTime = duration.value * v
        },30)


        // ffmpeg -i cv.mp4 -vf fps=0.2 F:\ffmpegTest\img\out%d.png
        // await ffmpeg.run('-i', name, '-vf', 'fps=0.2','output.mp4');

        async function transcodeImg(file,unit) {
            var inname = "test.mp4";
            var endStr = "testout.png";
            var outname = "a%d" + endStr;

            ffmpeg.FS("writeFile", inname, await fetchFile(file));
            
            await ffmpeg.run(
                "-i",
                inname,
                "-vf",
                "fps=1/" + unit + "",
                "-q:v",
                "2",
                "-f",
                "image2",
                outname
            );

            const fileList = ffmpeg.FS("readdir", "/");

            fileList.forEach((item) => {
                if (item.endsWith(endStr)) {
                    const imgdata = ffmpeg.FS("readFile", item);
                    const src = URL.createObjectURL(
                        new Blob([imgdata.buffer], { type: "image/png" })
                    );
                    imageList.push(src);
                }
            });
        }

        async function initFfmpeg(){
            await ffmpeg.load();
            initFfmpegFlag.value = true
            console.log('ffmpeg加载成功完成')
        }
        onMounted(()=>{
            initFfmpeg()
        })
        return {
            videoSrc,
            loadedmetadata,
            videoRef,
            inputFile,
            imageList,
            message,
            duration,
            goUpload,
            changeTimeline,
            changeFile,
        };
    },
});
</script>

<style lang="less">
.home-container {
    background-color: #202023;;
}
.uploader-wrap {
    margin-top: 30px;
    width: 700px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .title {
        color:#ffffff99;
        font-size: 14px;
    }
    &:hover {
        background-color: #f0f5ff0f;
        border: 1px dashed #ffffff66;
    }
}
.uploader-container {
    background-color: #202023;;
    display: flex;
    justify-content: center;
    padding-bottom: 100px;
    padding-top: 40px;
    height: 480px;
    box-sizing: border-box;
}
.video-container {
    padding-bottom: 100px;
    padding-top: 40px;
    height: 480px;
    box-sizing: border-box;
    .video-prev {
        width: 600px;
    }
}
.uploader {
    width: 150px;
    height: 150px;
    background-image: url(./img/upload.svg);
    background-size: cover;
}
.tool-container {
    border-top: 2px solid #121212;
}

.screenshot-container {
    min-height: 300px;
}

</style>
