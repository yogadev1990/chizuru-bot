import cheerio from "cheerio";
import axios from "axios";
import turl from "turl";

const url = 'https://www.instagram.com/reel/C6vPjsnPUkE/?utm_source=ig_web_copy_link';

async function instagram(url) {
  try {
    const params = new URLSearchParams();
    params.append('q', url);
    params.append('recaptchaToken', '');
    params.append('lang', 'en');
    params.append('t', 'media');

    const response = await axios.post('https://v3.igdownloader.app/api/ajaxSearch', params, {
      headers: {
        "authority": "v3.igdownloader.app",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8,ar;q=0.7,ms;q=0.6",
        "Content-Length": "121",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://igdownloader.app",
        "Priority": "u=1, i",
        "Referer": "https://igdownloader.app/",
        "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0"
      },
    });
    const $ = cheerio.load(response.data.data);
    const downloadLinks = {
       link: $("a.abutton").attr("href")
    };

    return downloadLinks;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async () => {
  try {
    const videoInfo = await instagram(url);
    console.log(videoInfo);
  } catch (error) {
    console.error(error);
  }
})();
