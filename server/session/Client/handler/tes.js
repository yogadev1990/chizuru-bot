const message = `Pot: 107
LIGHT 1
DTD% 22
A% 14
S% 10
DEF% -1
MDEF% -1
DODGE -1
DODGE% -1`;

const statRegex = /([A-Z]+%?)\s+(-?\d+)/ig;

const statTranslate = {
    "A%": "ATK+%25",
    "A": "ATK",
    "M%": "MATK+%25",
    "M": "MATK",
    "S%": "STR+%25",
    "S": "STR",
    "D%": "DEX+%25",
    "D": "DEX",
    "I%": "INT+%25",
    "I": "INT",
    "V%": "VIT+%25",
    "V": "VIT",
    "AG%": "AGI+%25",
    "AG": "AGI",
    "CD%": "Critical+Damage+%25",
    "CD": "Critical+Damage",
    "CR%": "Critical+Rate+%25",
    "CR": "Critical+Rate",
    "DTF%": "%25+luka+ke+Api",
    "DTE%": "%25+luka+ke+Bumi",
    "DTW%": "%25+luka+ke+Air",
    "DTA%": "%25+luka+ke+Angin",
    "DTL%": "%25+luka+ke+Cahaya",
    "DTD%": "%25+luka+ke+Gelap",
    "ASPD": "Kecepatan+Serangan",
    "ASPD%": "Kecepatan+Serangan+%25",
    "CSPD": "Kecepatan+Merapal",
    "CSPD%": "Kecepatan+Merapal+%25",
    "FIRE": "Unsur+Api+%28no+matching%29",
    "WATER": "Unsur+Air+%28no+matching%29",
    "EARTH": "Unsur+Bumi+%28no+matching%29",
    "WIND": "Unsur+Angin+%28no+matching%29",
    "LIGHT": "Unsur+Cahaya+%28no+matching%29",
    "DARK": "Unsur+Gelap+%28no+matching%29",
    "ACC": "Accuracy",
    "DODGE": "Dodge",
    "ACC%": "Accuracy+%25",
    "DODGE%": "Dodge+%25",
    "STAB%": "Stability+%25",
    "MPIERCE%": "Magic+Pierce+%25",
    "PPIERCE%": "Penetrasi+Fisik+%25",
    "HPREGEN": "Natural+HP+Regen",
    "MPREGEN": "Natural+MP+Regen",
    "HPREGEN%": "Natural+HP+Regen+%25",
    "MPREGEN%": "Natural+MP+Regen+%25",
    "DEF": "DEF",
    "MDEF": "MDEF",
    "DEF%": "DEF+%25",
    "MDEF%": "MDEF+%25",
};

let match;
let extractedStats = [];
let negativeStats = [];
const potRegex = /Pot: (\d+)/i;
const potMatch = message.match(potRegex);
const potValue = potMatch ? parseInt(potMatch[1]) : null;

// Loop melalui setiap kecocokan regex dalam pesan
while ((match = statRegex.exec(message)) !== null) {
    let statName, statValue;

    // Ambil nama stat dan nilainya dari setiap kecocokan
    const shortName = match[1];
    const value = parseInt(match[2]);

    // Gunakan terjemahan jika ada, jika tidak gunakan singkatan asli
    statName = statTranslate[shortName] || shortName;

    // Tambahkan nilai pot jika pot ditemukan
    if (shortName.toLowerCase() === 'pot') {
        potValue = value;
    } else {
        // Tentukan apakah nilai stat negatif atau positif
        if (value < 0) {
            negativeStats.push({ stat: statName, value: "MAX" });
        } else {
            extractedStats.push({ stat: statName, value: value });
        }
    }
}

// Pastikan setiap objek memiliki 7 elemen
while (extractedStats.length < 7) {
    extractedStats.push({ stat: "", value: "MAX" });
}

while (negativeStats.length < 7) {
    negativeStats.push({ stat: "", value: "MAX" });
}

console.log("Extracted Stats:", extractedStats);
console.log("Negative Stats:", negativeStats);
console.log("Pot Value:", potValue);
