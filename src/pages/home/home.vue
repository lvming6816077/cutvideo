<template>
    <div class="home-container">
        <topheader />
        <div class="uploader-container">
            <div class="uploader-wrap" @click="goUpload" v-show="!duration">
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
        <div class="tool-container">

        </div>
        <div class="video-container" v-show="duration">
            
            <video
                class="video-prev"
                :src="videoSrc"
                ref="videoRef"
                @loadedmetadata="loadedmetadata"
            />
        </div>

        <div class="controls-images-container">
            <div class="controls-images-inner">
                <div class="divider-left">

                </div>
                <div class="divider-right">

                </div>
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
    </div>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { defineComponent, ref, onMounted, reactive } from "vue";
import topheader from "./components/topheader/topheader.vue"

export default defineComponent({
    name: "Home",
    components:{topheader},
    setup() {
        // app state
        const ffmpeg = createFFmpeg({
            log: true,
        });

        const message = ref("Click Start to Transcode");
        let videoSrc = ref(null);
        let videoRef = ref(null);
        let duration = ref(0);
        let imageList = reactive(['http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg','http://localhost:8080/img/upload.6f6dfc9a.svg']);
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
            // await ffmpeg.load();
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
}
.video-container {
    margin-top: 30px;
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

.controls-images-container {
    border-top: 2px solid #121212;
    padding-top: 40px;
    padding-bottom: 40px;
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .img-item {
        width: 80px;
    }
    .controls-images-inner {
        position: relative;
    }
    .divider-left {
        width: 10px;
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: #00c1cd;
        pointer-events: all;
        cursor: ew-resize;
        box-sizing: border-box;

        

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
        width: 10px;
        position: absolute;
        left:30px;
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
