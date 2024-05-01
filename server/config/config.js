const menu = {
    toram: ["lvlchar", "lvlbs", "lvlalc", "finditem", "findmonster", "slotprice", "bagupgrade", "livecode", "infomats", "ninja", "bufffood", "toramdictionary", "lvlpet", "arrowelement", "build", "mt"],
    general: [],
    tool: ["fetch", "ssweb", "rvo", "blackbox", "ai", "diffusion", "animediffusion", ],
    download: ["tiktok", "instagram", "facebook", "drive", "imgur", "mediafire", "pinterest", "twitter", "ytv", "yta", "apk", "spotify"],
    admin: ["sticker", "toimage","hidetag", "add", "welcome", "leaving", "setprofile", "setname", "linkgroup"],
    superadmin: ["eval", "exec", "mute", "public", "setprofile", "setname", "help", "speed", "owner", "sc", "ping", "quoted"],
 }
 
 const limit = {
    free: 15,
    premium: 150,
    VIP: "Infinity",
    download: {
       free: 50000000, // use byte
       premium: 350000000, // use byte
       VIP: 1130000000, // use byte
    }
 }
 
 export default {
    limit,
    menu,
 
    APIs: {
       xfarr: {
          baseURL: 'https://api.xfarr.com',
          Key: "buy on https://api.xfarr.com/pricing"
       }
    },
 
    options: {
       public: true,
       antiCall: true, // reject call
       database: "database.json", // End .json when using JSON database or use Mongo URI
       owner: ["625159199040"], // set owner number on here
       sessionName: "session_1", // for name session
       prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i,
       pairingNumber: "" // Example Input : 62xxx
    },
 
    // Set pack name sticker on here
    Exif: {
       packId: "https://revandastore.my.id",
       packName: `Sticker Ini Dibuat Oleh :`,
       packPublish: "Chizuru",
       packEmail: "uchiihitoo@gmail.com",
       packWebsite: "https://revandastore.my.id",
       androidApp: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
       iOSApp: "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
       emojis: [],
       isAvatar: 0,
    },
 
    // message  response awikwok there
    msg: {
       owner: "Fitur hanya digunakan oleh baginda Revanda",
       group: "Fitur hanya bisa diakses di grup!",
       private: "Fitur hanya bisa diakses di private chat!",
       admin: "Fitur hanya bisa diakses oleh admin!",
       botAdmin: "Bot bukan admin, tidak bisa menggunakan fitur!",
       bot: "Fitur hanya bisa diakses oleh bot",
       media: "Balas media...",
       query: "Tidak ada query?",
       error: "Terjadi kesalahan yang tidak diketahui, silakan ulangi kembali perintah anda",
       quoted: "Balas pesan...",
       wait: "Tunggu beberapa saat...",
       urlInvalid: "Url tidak valid",
       notFound: "Tidak ditemukan!",
       premium: "Fitur hanya untuk premium!",
       vip: "Fitur VIP Only!",
       dlFree: `File lebih dari ${formatSize(limit.download.free)} hanya bisa diakses oleh pengguna premium`,
       dlPremium: `WhatsApp tidak dapat mengirim file lebih dari ${formatSize(limit.download.premium)}`,
       dlVIP: `WhatsApp tidak dapat mengirim file lebih dari ${formatSize(limit.download.VIP)}`
    }
 }
 
 
 function formatSize(bytes, si = true, dp = 2) {
    const thresh = si ? 1000 : 1024;
 
    if (Math.abs(bytes) < thresh) {
       return `${bytes} B`;
    }
 
    const units = si
       ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
       : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;
 
    do {
       bytes /= thresh;
       ++u;
    } while (
       Math.round(Math.abs(bytes) * r) / r >= thresh &&
       u < units.length - 1
    );
 
    return `${bytes.toFixed(dp)} ${units[u]}`;
 }