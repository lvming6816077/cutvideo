

const genImgCanvas = (width,height,startX,endX,oriWidth,image) => {
    // 离屏canvas
    let imglistOfflineCanvas = document.createElement('canvas');
    const imglistOfflineCtx = imglistOfflineCanvas.getContext('2d');
    imglistOfflineCanvas.style.width = width
    imglistOfflineCanvas.style.height = height

    // 双倍*2 高清
    imglistOfflineCanvas.width = width*2;
    imglistOfflineCanvas.height = height*2;


    let s = startX*2,w = oriWidth*2,h = height*2,ns = endX*2

    imglistOfflineCtx.drawImage(image,0,0,s,h,0,0,s,h)
    imglistOfflineCtx.drawImage(image,ns,0,w,h,s,0,w,h)


    
    var dataURL = imglistOfflineCanvas.toDataURL()
    dataURL = dataURL.replace("image/png", "image/octet-stream");
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = dataURL;
    save_link.download = "XXXX.png";

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
    
    return imglistOfflineCanvas

}

export default genImgCanvas