
import axios from "axios";

async function mangasearch2(query) {
  try {
      const response = await axios.get(`https://api.jikan.moe/v4/${query}/manga`);
      let mangaDetails = `*Daftar Manga*\n`;

      if (query === 'top') {
          const mangaList = response.data.data;
              mangaList.forEach((manga, index) => {
        const title = manga.title;
        const type = manga.type;
        const status = manga.status;
        const synopsis = manga.synopsis;
        const link = manga.url;
  
        mangaDetails += `\n*${index + 1}. ${title}*\n`;
        mangaDetails += `_Type:_ ${type}\n`;
        mangaDetails += `_Status:_ ${status}\n`;
        mangaDetails += `_Link:_ ${link}\n`;
        mangaDetails += `_Synopsis:_ ${synopsis}\n`;
      });
      } else if (query === 'recommendations') {
        const recommendations = response.data.data;
			  recommendations.slice(0, 15).forEach(recommendation => {
				const recommender = recommendation.user.username;
				  recommendation.entry.forEach(anime => {
					const title = anime.title;
					const url = anime.url;
	
					mangaDetails += `\n*Direkomendasikan oleh:* ${recommender}\n`;
					mangaDetails += `[${title}](${url})\n`;
				});
			});
      } else if (query === 'random') {
        const animeData = response.data.data;
  
        mangaDetails += `
*Judul:* ${animeData.title}
*Genre:* ${animeData.genres.map(genre => genre.name).join(', ')}
*Author:* ${animeData.authors.map(author => author.name).join(', ')}
*Tipe:* ${animeData.type}
*Volume:* ${animeData.volumes}
*Jumlah Chapter:* ${animeData.chapters}
*Status:* ${animeData.status}
*Tanggal Publikasi:* ${animeData.published.string}
*Peringkat:* #${animeData.rank}
*Popularitas:* #${animeData.popularity}
*Link:* ${animeData.url}
*Sinopsis:*
${animeData.synopsis}`;
      }

      return mangaDetails;
  } catch (error) {
      console.error('Terjadi kesalahan:', error.message);
      return 'Terjadi kesalahan dalam pencarian.';
  }
}

console.log(await mangasearch2("recommendations"));