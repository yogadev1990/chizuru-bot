const waktu = new Date();
const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Konversi ke waktu Asia/Jakarta
const waktuJakarta = new Date(waktu.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

const bulan = namaBulan[waktuJakarta.getMonth()];
const tahun = waktuJakarta.getFullYear();
const hari = waktuJakarta.toLocaleDateString('id-ID', { weekday: 'long', timeZone: 'Asia/Jakarta' });
const jam = waktuJakarta.getHours().toString().padStart(2, '0');
const menit = waktuJakarta.getMinutes().toString().padStart(2, '0');

console.log(`${hari}, ${bulan} ${tahun} ${jam}:${menit}`);
