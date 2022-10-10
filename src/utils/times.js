
/**
 * @param {Number} millisecond 时间差：秒
 * @returns format as "00:00:00"
 */
 const formatTime = (seconds)=>{
    // let seconds = Math.round(millisecond / 1000);
    let result = [];
    let count = 2;
    while(count >= 0) {
        let current = Math.floor(seconds / (60 ** count));
        result.push(current);
        seconds -= current * (60 ** count);
        --count;
    }
    return result.map(item => item <= 9 ? `0${item}` : item).join(":")
}

export default formatTime