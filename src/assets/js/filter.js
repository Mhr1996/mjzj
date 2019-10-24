/**
 * 转换时间
 * @param {int} time 传入时间戳
 * @param {string} ff 转换日期格式 Y-m-d 等，下方有著明
 */
const formatDate = (time, ff) => {
    if (Number(time).toString().length == 10) {
        time = Number(time + "000")
    }
    time = new Date(time);
    var year = time.getFullYear();
    var month =
        time.getMonth() + 1 < 10 ?
            "0" + (time.getMonth() + 1) :
            time.getMonth() + 1;
    var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    var minute =
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    var second =
        time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    if (ff == "Y-m-d") {
        return year + "-" + month + "-" + date;
    } else if (ff == "Y-m-d H:i:s") {
        return (
            year +
            "-" +
            month +
            "-" +
            date +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            second
        );
    } else if (ff == "Y-m-d H:i") {
        return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    } else if (ff == "Y.m.d") {
        return year + "." + month + "." + date;
    } else if (ff == "Y.m.d H:i:s") {
        return (
            year +
            "." +
            month +
            "." +
            date +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            second
        );
    } else if (ff == "Y.m.d H:i") {
        return year + "." + month + "." + date + " " + hour + ":" + minute;
    }
}

export default formatDate

