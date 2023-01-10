let setlocaL = (key, data = "", expiration = 12) => {
  let storedata = {
    // createTime:new Date().getTime(),
    createTime: Date.now(),
    data,
    expiration: expiration * 1000 * 60 * 60, // 默认设置过期时间：7天
  };
  // let storedata = JSON.stringify(storedata)
  localStorage.setItem(key, JSON.stringify(storedata));
};

let getlocaL = (key, defaultValue = "") => {
  let storedata = localStorage.getItem(key);
  if (storedata) {
    storedata = JSON.parse(storedata);
    let ctime = Date.now() - storedata.createTime;
    if (ctime > 0 && ctime < storedata.expiration) {
      defaultValue = storedata.data;
    }
  }

  return defaultValue;
};

let rmLocal = (key) => {
  localStorage.removeItem(key);
};

let xml2json = (xml, arrkeys = []) => {};

let objtoArr = (data) => {
  return data?.constructor === Object ? [data] : data;
};

const getArrDifference = (arr1, arr2) => {
  return arr1.concat(arr2).filter((v, i, arr) => {
    return arr.indexOf(v) === arr.lastIndexOf(v);
  })
}
————————————————
版权声明：本文为CSDN博主「.ToString()°」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_47809584/article/details/124734865

export default {
  setlocaL,
  getlocaL,
  rmLocal,
  xml2json,
  objtoArr,
};
