import axios from "axios";
import cheerio from "cheerio";

async function tiktok(url) {
    try {
        const response = await axios.get("https://ttdownloader.com/", {
            headers: {
                cookie: "PHPSESSID=9ut8phujrprrmll6oc3bist01t; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
            },
        });
        
        const $ = cheerio.load(response.data);
        const token = $("#token").attr("value");
        const config = {
            url: url,
            format: "",
            token: token,
        };
        
        const response2 = await axios.post("https://ttdownloader.com/search/", new URLSearchParams(Object.entries(config)), {
            headers: {
                cookie: "PHPSESSID=9ut8phujrprrmll6oc3bist01t; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
            },
        });

        const $2 = cheerio.load(response2.data);
        const nowm = $2("div:nth-child(2) > div.download > a").attr("href");
        const wm = $2("div:nth-child(3) > div.download > a").attr("href");

        return { $2, nowm, wm };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const link = await tiktok(`https://www.tiktok.com/@titokhijau/video/7262722212489301254?is_from_webapp=1&sender_device=pc&web_id=7340704638289298951`);
console.log(link.nowm)
console.log(link.wm)