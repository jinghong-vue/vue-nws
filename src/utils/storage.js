//  封装一个存储到本地的方法
//  存储需要转化为JSON

let set = (key,value) => {
    if(key && value){
        // 将value转换为JSON
        try {
            let json = JSON.stringify(value)
            localStorage.setItem(key,json)
        } catch(e){
            console.error(e);
        }

        
    }
}

let get = key => {
    let res = localStorage.getItem(key)
    try {
        // 取需要转换成js对象的json对象
        let result = JSON.parse(res)
        return result
    } catch(e){
        return res
    }
}


let rm = key => {
    localStorage.removeItem(key)
}


export default {
    get,
    set,
    rm
}