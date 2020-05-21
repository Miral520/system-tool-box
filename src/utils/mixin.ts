export default {
    // 获取地址栏参数
    getUrlSearch(name: string) {
        // 未传参，返回空
        if (!name) return null;
        // 查询参数：先通过search取值，如果取不到就通过hash来取
        let after = window.location.search;
        after = after.substr(1) || window.location.hash.split('?')[1];
        // 地址栏URL没有查询参数，返回空
        if (!after) return null;
        // 如果查询参数中没有"name"，返回空
        if (after.indexOf(name) === -1) return null;

        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // 当地址栏参数存在中文时，需要解码，不然会乱码
        let r = decodeURI(after).match(reg);
        // 如果url中"name"没有值，返回空
        if (!r) return null;

        return r[2];
    },

    // 16进制色值转换为RGB(A)
    hexToRgba(hex: string, opacity: number) {
        let methodStr = '';
        let opacityStr = '';
        if (opacity) {
            methodStr = 'rgba';
            opacityStr = ', ' + opacity;
        }
        else {
            methodStr = 'rgb';
        }
        return `${methodStr}(${parseInt("0x" + hex.slice(1, 3))}, ${parseInt("0x" + hex.slice(3, 5))}, ${parseInt("0x" + hex.slice(5, 7))}${opacityStr})`; 
    },

    // 判断对象不为空
    isObjectNull(obj: object) {
        if(obj instanceof Object) {
            if(obj) {
                if(JSON.stringify(obj) === '{}') {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
        else {
            return obj;
        }
    },

    // 提取整数
    getIntegerNumber(str: string) {
        str += '';
        return parseInt(str.replace(/[^-?\d]/g,''));
    },

    // 提取数字
    getNumber(str: string) {
        str += '';
        return parseFloat(str.replace(/[^(-?\d+)(\.\d+)?]/g,''));
    },

    // 保存cookie(cookieDates 有效期/天)
    saveCookie(cookieName: string, cookieValue: string, cookieDates: number = 30){
        let d = new Date();
        d.setDate(d.getDate() + cookieDates);
        document.cookie = `${cookieName}=${cookieValue};expires=${d.toUTCString()}`;
    },

    // 读取cookie
    getCookie(cookieName: string){
        let cookieStr = unescape(document.cookie);
        let arr = cookieStr.split('; ');
        let cookieValue = '';
        for(let i = 0; i < arr.length; i++){
            let temp = arr[i].split('=');
            if(temp[0] === cookieName){
                cookieValue = temp[1];
                break;
            }
        }
        return cookieValue;
    },

    // 删除cookie
    removeCookie(cookieName: string) {
        document.cookie = `${encodeURIComponent(cookieName)}=; expires=${new Date()}`;
    }, 
}