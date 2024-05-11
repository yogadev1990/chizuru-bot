import turl from "turl";
import axios from "axios";

const urlfb = 'https://fb.watch/r_w60Knb-j/';

async function facebook(videoUrl) {
  try {
    const headers =  {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      Cookie: "sb=xBTMY3ADrH81vmJc-PYH-jC4; datr=xBTMY3m-IHA2QOdyxxKjaO7z; ps_n=1; ps_l=1; fr=1TXxHKy4MkJ4oXvwR.AWUTswl2pnQzI-h_xDlk7jR0TwY.BmPt5u..AAA.0.0.BmPt5u.AWVK0aMBp6A; dpr=1.5; wd=1280x150",
      Dpr: "1.5",
      Priority: "u=0, i",
      "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
      "Sec-Ch-Ua-Full-Version-List": "\"Chromium\";v=\"124.0.6367.158\", \"Google Chrome\";v=\"124.0.6367.158\", \"Not-A.Brand\";v=\"99.0.0.0\"",
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Model": "\"\"",
      "Sec-Ch-Ua-Platform-Version": "\"15.0.0\"",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
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
    const videoInfo = await facebook(urlfb);
    console.log(videoInfo);
  } catch (error) {
    console.error(error);
  }
})();
