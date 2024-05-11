import turl from "turl";
import getFbVideoInfo from "fb-downloader-scrapper"
const cookie = "datr=HCTWZXWRBNleauqd7mrRCkrR; sb=QCTWZXoFEjTMSGVIFYIXQoPr; c_user=100020041126575; ps_n=1; ps_l=1; xs=29%3AXm1fFPh3xti4og%3A2%3A1712413671%3A-1%3A10952%3A%3AAcXuqhQKq8D0YJOLAcTD9rJcjm7DieOxQIdpj9G_k4Q; locale=id_ID; vpd=v1%3B496x320x2.0000000596046448; fbl_st=100633781%3BT%3A28589850; wl_cbv=v2%3Bclient_version%3A2496%3Btimestamp%3A1715391030; fr=1bUVzg0DKF9ufqQy7.AWW2cvgSmjiI2OQEWW3zmatG2dA.BmPsnJ..AAA.0.0.BmPso-.AWVXQZZiHhg; dpr=1.5; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1715391044900%2C%22v%22%3A1%7D; wd=2560x783"
const useragent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
const url = 'https://fb.watch/r_w60Knb-j/';
const data = await getFbVideoInfo(url, cookie, useragent);
const turl1 = await turl.shorten(data.sd);
const turl2 = await turl.shorten(data.hd);

console.log('Data:', data);
console.log('SD:', turl1);
console.log('HD:', turl2);
