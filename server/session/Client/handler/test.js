import axios from 'axios';
import cheerio from 'cheerio';
import querystring from 'qs';

const fetchData = async (query) => {
  const apiUrl = 'https://v3.saveig.app/api/ajaxSearch';
  const requestData = {
    q: query,
    t: 'media',
    lang: 'en',
  };
  const requestHeaders = {
    Accept: '*/*',
    Origin: 'https://saveig.app',
    Referer: 'https://saveig.app/en',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Sec-Ch-Ua': '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183',
    'X-Requested-With': 'XMLHttpRequest',
  };

  try {
    const axiosConfig = { headers: requestHeaders };
    const axiosInstance = axios.create(axiosConfig);
    const response = await axiosInstance.post(apiUrl, querystring.stringify(requestData));
    console.log(response);
    const responseData = response.data;
    //console.log(responseData.data)
    const $ = cheerio.load(responseData.data);
    const downloadItems = $('.download-items');
    const results = [];

    // Iterate over download items
    downloadItems.each((index, element) => {
      const thumbnail = $(element).find('.download-items__thumb > img').attr('src');
      const downloadLink = $(element).find('.download-items__btn > a').attr('href');
      const item = {
        thumbnail_link: thumbnail,
        download_link: downloadLink,
      };
      results.push(item);
    });

    return results;
  } catch (error) {
    throw error;
  }
};

// Contoh pemanggilan fungsi fetchData dengan query URL Instagram reel
fetchData('https://www.instagram.com/reel/C3zIabFh6E0/?utm_source=ig_web_copy_link');
