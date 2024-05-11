import cheerio from "cheerio";
import axios from "axios";
import turl from "turl";

const url = 'https://fb.watch/r_w60Knb-j/';

async function facebook(url) {
  try {
    const params = new URLSearchParams();
    params.append('URLz', url);

    const response = await axios.post('https://www.fdown.net/download.php', params, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8,ar;q=0.7,ms;q=0.6',
        'Cache-Control': 'max-age=0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': '_ga=GA1.1.1890950555.1715398826; cf_clearance=n7zNyJmnmv.RyRWU9UzizOZqRuUEN57.dfHqnNKEFuY-1715398826-1.0.1.1-nToIrdmXHszhP_9JBJp5wwzbkOQ4qUYd5BBHZGYznNl7JQEqaE4ZYKrhOzaQi1hEpmAZ3mxJd8Rj08e6RT1xrw; __gads=ID=bf429288d74a0d7d:T=1715398826:RT=1715399236:S=ALNI_Mbq8t5yfOhAwsLPmunsgyAw0cUKJA; __gpi=UID=00000e16d84b9d3d:T=1715398826:RT=1715399236:S=ALNI_MZEigB8ZGBUosnvvzsdscEA85Ft4A; __eoi=ID=11c9a6dc659e2680:T=1715398826:RT=1715399236:S=AA-AfjaDsV35uF8O-YH6WgWLqF69; FCNEC=%5B%5B%22AKsRol_sNiJjG6s9ojB8jVa088kWjjlhixjXOHBABXIH3UXE_e1mCFD9JDlrNYgLl4ARPUQmmY2j7JpI02FrZ1F-2YMKP-8uFn28uvLwzflW6kwtVJbW13dPPRiCo3gT6rLFLW3QC1Ajx1Brqv9-NHcRCJcCpEF1dA%3D%3D%22%5D%5D; _ga_82ERN9JZD3=GS1.1.1715398825.1.1.1715399565.58.0.0',
        'Origin': 'https://www.fdown.net',
        'Priority': 'u=0, i',
        'Referer': 'https://www.fdown.net',
        'Sec-Ch-Ua': '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
      },
    });
    const $ = cheerio.load(response.data);

    const downloadLinks = {
      sd: await turl.shorten($("a#sdlink").attr("href")),
      hd: await turl.shorten($("a#hdlink").attr("href"))
    };

    return { downloadLinks };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async () => {
  try {
    const videoInfo = await facebook(url);
    console.log(videoInfo);
  } catch (error) {
    console.error(error);
  }
})();
