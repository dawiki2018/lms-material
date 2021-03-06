/**
 * LMS-Material
 *
 * Copyright (c) 2018 Craig Drummond <craig.p.drummond@gmail.com>
 * MIT license.
 */
 
var bus = new Vue();

function formatSeconds(secs) {
    var sec_num = parseInt(secs, 10)    
    var hours   = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    if (hours>0) {
        return [hours,minutes,seconds]
                 .map(v => v < 10 ? "0" + v : v)
                 .filter((v,i) => v !== "00" || i > 0)
                 .join(":");
    }
    return (minutes<1 ? "00:" : "") +
           [minutes,seconds]
             .map(v => v < 10 ? "0" + v : v)
             .filter((v,i) => v !== "00" || i > 0)
             .join(":");
}

function formatTime(secs, twentyFour) {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    if (twentyFour) {
        return [hours,minutes]
                 .map(v => v < 10 ? "0" + v : v)
                 .join(":");
    } else {
        return (hours%12 || 12)+":"+(minutes<10 ? "0" : "")+minutes+" "+(hours<12 ? "AM" : "PM");
    }
}

function formatDate(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

function resolveImage(icon, image) {
    if (!icon && !image) {
        return null;
    }
    if (image) {
        if (image.includes("://") && !(image.startsWith('/imageproxy') || image.startsWith('imageproxy'))) {
            return image;
        }
        if (image.startsWith("/")) {
            return lmsServerAddress+image; //+"/image_100x100_o";
        }
        return lmsServerAddress+"/"+image; //+"/image_100x100_o";
    }
    if (icon.includes("://") && !(icon.startsWith('/imageproxy') || icon.startsWith('imageproxy'))) {
        return icon;
    }
    
    var idx = icon.lastIndexOf(".png");
    if (idx>0) {
        icon = icon.substring(0, idx)+"_50x50.png";
    }
    if (icon.startsWith("/")) {
        return lmsServerAddress+icon;
    }
    if (idx<0 && /^[0-9a-fA-F]+$/.test(icon)) {
        icon="music/"+icon+"/cover50x50_o";
    }
    return lmsServerAddress+"/"+icon;
}

function titleSort(a, b) {
    var titleA = a.title.toUpperCase();
    var titleB = b.title.toUpperCase();
    if (titleA < titleB) {
        return -1;
    }
    if (titleA > titleB) {
        return 1;
    }
    return 0;
}

function itemSort(a, b) {
    var at = "group"==a.type ? 0 : "track"==a.type ? ("music_note"==a.icon ? 1 : 2) : 3;
    var bt = "group"==b.type ? 0 : "track"==b.type ? ("music_note"==b.icon ? 1 : 2) : 3;
    if (at!=bt) {
        return at<bt ? -1 : 1;
    }
    return titleSort(a, b);
}

function favSort(a, b) {
    var at = a.isFavFolder ? 0 : 1;
    var bt = b.isFavFolder ? 0 : 1;
    if (at!=bt) {
        return at<bt ? -1 : 1;
    }
    return titleSort(a, b);
}

function setScrollTop(el, val) {
    // https://popmotion.io/blog/20170704-manually-set-scroll-while-ios-momentum-scroll-bounces/
    el.style['-webkit-overflow-scrolling'] = 'auto';
    el.scrollTop=val;
    el.style['-webkit-overflow-scrolling'] = 'touch';
}

const LS_PREFIX="lms-material::";

function getLocalStorageBool(key, def) {
    var val = localStorage.getItem(LS_PREFIX+key);
    return undefined!=val ? "true" == val : def;
}

function getLocalStorageVal(key, def) {
    var val = localStorage.getItem(LS_PREFIX+key);
    return undefined!=val ? val : def;
}

function setLocalStorageVal(key, val) {
    localStorage.setItem(LS_PREFIX+key, val);
}

function isMobile() {
    return navigator.userAgent.indexOf("Mobile") !== -1 ||
           navigator.userAgent.indexOf("iPhone") !== -1 ||
           navigator.userAgent.indexOf("Android") !== -1 ||
           navigator.userAgent.indexOf("Windows Phone") !== -1;
}

