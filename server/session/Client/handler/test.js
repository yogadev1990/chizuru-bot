import turl from "turl";
import axios from "axios";

const cookie =
  "datr=HCTWZXWRBNleauqd7mrRCkrR; sb=QCTWZXoFEjTMSGVIFYIXQoPr; c_user=100020041126575; ps_n=1; ps_l=1; xs=29%3AXm1fFPh3xti4og%3A2%3A1712413671%3A-1%3A10952%3A%3AAcXuqhQKq8D0YJOLAcTD9rJcjm7DieOxQIdpj9G_k4Q; locale=id_ID; vpd=v1%3B496x320x2.0000000596046448; fbl_st=100633781%3BT%3A28589850; wl_cbv=v2%3Bclient_version%3A2496%3Btimestamp%3A1715391030; fr=1bUVzg0DKF9ufqQy7.AWW2cvgSmjiI2OQEWW3zmatG2dA.BmPsnJ..AAA.0.0.BmPso-.AWVXQZZiHhg; dpr=1.5; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1715391044900%2C%22v%22%3A1%7D; wd=2560x783";
const useragent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
const urlfb = 'https://fb.watch/r_w60Knb-j/';

async function facebook(videoUrl, cookie, useragent) {
  try {
    const headers = {
      "sec-fetch-user": "?1",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-site": "none",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "cache-control": "max-age=0",
      authority: "www.web.facebook.com",
      "upgrade-insecure-requests": "1",
      "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
      "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
      "user-agent":
        useragent ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      cookie:
        cookie ||
        "sb=Rn8BYQvCEb2fpMQZjsd6L382; datr=Rn8BYbyhXgw9RlOvmsosmVNT; c_user=100003164630629; _fbp=fb.1.1629876126997.444699739; wd=1920x939; spin=r.1004812505_b.trunk_t.1638730393_s.1_v.2_; xs=28%3A8ROnP0aeVF8XcQ%3A2%3A1627488145%3A-1%3A4916%3A%3AAcWIuSjPy2mlTPuZAeA2wWzHzEDuumXI89jH8a_QIV8; fr=0jQw7hcrFdas2ZeyT.AWVpRNl_4noCEs_hb8kaZahs-jA.BhrQqa.3E.AAA.0.0.BhrQqa.AWUu879ZtCw",
    };

    const response = await axios.get(videoUrl, { headers });

    const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

    let responseData = response.data;

    responseData = responseData.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

    const sdMatch =
      responseData.match(/"browser_native_sd_url":"(.*?)"/) ||
      responseData.match(/"playable_url":"(.*?)"/) ||
      responseData.match(/sd_src\s*:\s*"([^"]*)"/) ||
      responseData.match(/(?<="src":")[^"]*(https:\/\/[^"]*)/);
    const hdMatch =
      responseData.match(/"browser_native_hd_url":"(.*?)"/) ||
      responseData.match(/"playable_url_quality_hd":"(.*?)"/) ||
      responseData.match(/hd_src\s*:\s*"([^"]*)"/);
    const titleMatch = responseData.match(/<meta\sname="description"\scontent="(.*?)"/);
    const thumbMatch = responseData.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);
    var duration = responseData.match(/"playable_duration_in_ms":[0-9]+/gm);

    if (sdMatch && sdMatch[1]) {
      const result = {
        url: videoUrl,
        duration_ms: Number(duration[0].split(":")[1]),
        sd: await turl.shorten(parseString(sdMatch[1])),
        hd: hdMatch && hdMatch[1] ? await turl.shorten(parseString(hdMatch[1])) : "",
        title: titleMatch && titleMatch[1] ? parseString(titleMatch[1]) : responseData.match(/<title>(.*?)<\/title>/)?.[1] ?? "",
        thumbnail: thumbMatch && thumbMatch[1] ? parseString(thumbMatch[1]) : "",
      };
      return result;
    } else {
      throw new Error("Unable to fetch video information at this time. Please try again");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Unable to fetch video information at this time. Please try again");
  }
}

// Usage example
(async () => {
  try {
    const videoInfo = await facebook(urlfb, cookie, useragent);
    console.log(videoInfo);
  } catch (error) {
    console.error(error);
  }
})();
