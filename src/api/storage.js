//封装一个存储到本地的方法

//存 需要转换成JSON
let set = (key, value) => {
  // console.log(key,value);
  if (key && value) {
    // 把value转换成JSON
    try {
      let json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error("key 和 value 必须传递");
  }
};

//取 需要转换成正常的对象

let get = (key) => {
  let res = localStorage.getItem(key);
  try {
    let result = JSON.parse(res);
    return result;
  } catch (e) {
    // console.log(e)
    return res;
  }
};

//封装删除方法
let rm = (key) => {
  localStorage.removeItem(key);
};

export default {
  get,
  set,
  rm,
};
