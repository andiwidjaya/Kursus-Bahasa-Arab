export interface ArabicKnowledgeRule {
  id: string;
  title: string;
  category: 'NAHWU' | 'SHOROF' | 'BACA_KITAB' | 'QAWAID';
  arabicTitle: string;
  summary: string;
  content: string;
  examples: { arabic: string; indo: string; explanation: string }[];
  keywords: string[];
}

export const ARABIC_KNOWLEDGE_BASE: ArabicKnowledgeRule[] = [
  {
    id: 'rule-pembagian-kata',
    title: 'Pembagian Kata dalam Bahasa Arab (Al-Kalimah)',
    category: 'NAHWU',
    arabicTitle: 'أَقْسَامُ الكَلِمَةِ',
    summary: 'Kata dalam Bahasa Arab terbagi menjadi 3 jenis: Ism (Nomina), Fi\'il (Verba), dan Harf (Partikel).',
    content: `Dalam tata bahasa Arab (Nahwu), setiap kata (Kalimah) pasti tergolong ke dalam salah satu dari tiga kelompok utama:
1. Ism (إِسْمٌ): Kata yang menunjukkan nama orang, benda, tempat, sifat, atau konsep tanpa terikat waktu. Contoh: كِتَابٌ (Buku), مُحَمَّدٌ (Muhammad), جَمِيلٌ (Indah). Ciri Ism: diawali Al (الـ), berharakat Tanwin, atau diawali Harf Jer.
2. Fi'il (فِعْلٌ): Kata kerja yang menunjukkan suatu perbuatan dan terikat oleh waktu (Lampau/Madhi, Sekarang/Mudhari', Perintah/Amr). Contoh: كَتَبَ (Telah menulis), يَكْتُبُ (Sedang menulis), اُكْتُبْ (Tulislah!). Ciri Fi'il: bisa didahului قَدْ, سَـ, سَوْفَ, atau Ta Ta'nits (تْ).
3. Harf (حَرْفٌ): Kata tugas/partikel yang tidak memiliki makna sempurna kecuali jika digabungkan dengan Ism atau Fi'il. Contoh: فِي (Di dalam), مِنْ (Dari), إِلَى (Ke), عَلَى (Di atas).`,
    examples: [
      { arabic: 'ذَهَبَ أَحْمَدُ إِلَى المَدْرَسَةِ', indo: 'Ahmad pergi ke sekolah', explanation: 'ذَهَبَ = Fi\'il Madhi, أَحْمَدُ = Ism, إِلَى = Harf Jer, المَدْرَسَةِ = Ism majrur.' },
      { arabic: 'الكِتَابُ عَلَى المَكْتَبِ', indo: 'Buku itu di atas meja', explanation: 'الكِتَابُ = Ism (Mubtada\'), عَلَى = Harf Jer, المَكْتَبِ = Ism Majrur (Khabar Shibhul Jumlah).' }
    ],
    keywords: ['pembagian kata', 'kalimah', 'ism', 'fiil', 'harf', 'ciri ism', 'ciri fiil', 'pengertian nahwu']
  },
  {
    id: 'rule-mubtada-khabar',
    title: 'Jumlah Ismiyyah: Mubtada dan Khabar',
    category: 'NAHWU',
    arabicTitle: 'المُبْتَدَأُ وَالخَبَرُ',
    summary: 'Kalimat nominal (Jumlah Ismiyyah) terdiri dari Mubtada\' (Subjek Marfu\') dan Khabar (Predikat Marfu\').',
    content: `Jumlah Ismiyyah adalah kalimat yang diawali oleh Ism. Kalimat ini terdiri dari dua rukun utama:
1. Mubtada' (المُبْتَدَأُ): Ism Marfu' yang terletak di awal kalimat dan menjadi pokok pembicaraan. Hukum asalnya harus Ma'rifah (tertentu, misal ber-Alif Lam atau Ism Alam).
2. Khabar (الخَبَرُ): Bagian yang menyempurnakan makna Mubtada' dan menjelaskan keadaan Subjek. Hukum asalnya Marfu' dan bernilai Nakirah (umum).

Kesesuaian Mubtada' & Khabar:
Khabar harus menyesuaikan Mubtada' dalam hal Gender (Mudzakkar/Mu'annats) dan Jumlah (Mufrad/Tatsniyah/Jamak).`,
    examples: [
      { arabic: 'اللاَّعِبُ مَاهِرٌ', indo: 'Pemain itu mahir', explanation: 'اللاَّعِبُ = Mubtada\' Marfu\' dengan Dhammah. مَاهِرٌ = Khabar Marfu\' dengan Dhammah.' },
      { arabic: 'الطَّالِبَةُ مُجْتَهِدَةٌ', indo: 'Siswi itu rajin', explanation: 'Kedua kata menyesuaikan bentuk Mu\'annats (perempuan).' }
    ],
    keywords: ['mubtada', 'khabar', 'jumlah ismiyyah', 'subjek predikat', 'marfu', "ma'rifah", 'nakirah']
  },
  {
    id: 'rule-fiil-fail-maful',
    title: 'Jumlah Fi\'liyyah: Fi\'il, Fa\'il, dan Ma\'ful Bih',
    category: 'NAHWU',
    arabicTitle: 'الجُمْلَةُ الفِعْلِيَّةُ',
    summary: 'Kalimat verbal (Jumlah Fi\'liyyah) diawali oleh Fi\'il, diikuti Fa\'il (Pelaku, Marfu\') dan Ma\'ful Bih (Objek, Manshub).',
    content: `Jumlah Fi'liyyah adalah kalimat yang diawali oleh Kata Kerja (Fi'il).
Komponen Jumlah Fi'liyyah:
1. Fi'il (فِعْلٌ): Kata kerja (Madhi, Mudhari', Amr).
2. Fa'il (فَاعِلٌ): Ism Marfu' yang berada setelah Fi'il dan menunjukkan pelaku perbuatan. Hukumnya selalu Marfu' (tanda utama: Dhammah).
3. Ma'ful Bih (مَفْعُوْلٌ بِهِ): Ism Manshub yang menjadi sasaran/objek perbuatan. Hukumnya selalu Manshub (tanda utama: Fathah).

Aturan Posisi Fi'il:
Jika Fa'il berwujud Jamak, Fi'il di awal kalimat tetap bernilai Mufrad (tunggal), namun harus menyesuaikan gender (Mudzakkar / Mu'annats).`,
    examples: [
      { arabic: 'قَرَأَ الطَّالِبُ الكِتَابَ', indo: 'Siswa itu telah membaca buku', explanation: 'قَرَأَ = Fi\'il Madhi, الطَّالِبُ = Fa\'il (Marfu\' Dhammah), الكِتَابَ = Ma\'ful Bih (Manshub Fathah).' }
    ],
    keywords: ['jumlah filiyyah', 'fiil', 'fail', 'maful bih', 'pelaku', 'objek', 'kata kerja', 'fathah', 'dhammah']
  },
  {
    id: 'rule-tashrif-shorof',
    title: 'Konsep Dasar Shorof & Wazan Tashrif',
    category: 'SHOROF',
    arabicTitle: 'عِلْمُ الصَّرْفِ وَالأَوْزَانُ',
    summary: 'Ilmu Shorof mempelajari pola perubahan bentuk kata dasar (Wazan) untuk menghasilkan berbagai arti turunan.',
    content: `Ilmu Shorof (Morfologi Bahasa Arab) adalah cabang ilmu yang membahas asal-usul pembentukan kata dan perubahannya.
Dalam Shorof, standar timbangan kata dasar 3 huruf dinamakan Wazan F-A-L (ف-ع-ل):
- الفَاءُ (Fa Fi'il) = Huruf pertama
- العَيْنُ ('Ain Fi'il) = Huruf kedua
- اللاَّمُ (Lam Fi'il) = Huruf ketiga

Contoh Perubahan Pola (Tashrif Istilahiy):
Dari kata dasar كَتَبَ (Wazan فَعَلَ):
1. Fi'il Madhi: كَتَبَ (Telah menulis)
2. Fi'il Mudhari': يَكْتُبُ (Sedang menulis)
3. Mashdar: كِتَابَةً (Penulisan/Tulisan)
4. Ism Fa'il: كَاتِبٌ (Penulis/Pengetik)
5. Ism Ma'ful: مَكْتُوْبٌ (Yang ditulis/Surat)
6. Fi'il Amr: اُكْتُبْ (Tulislah!)
7. Ism Makan/Zaman: مَكْتَبٌ (Meja/Kantor/Waktu menulis)`,
    examples: [
      { arabic: 'فَتَحَ - يَفْتَحُ - فَتْحًا - فَاتِحٌ - مَفْتُوْحٌ', indo: 'Membuka - Sedang membuka - Pembukaan - Pembuka - Yang dibuka', explanation: 'Tashrif dari akar kata F-T-H.' }
    ],
    keywords: ['shorof', 'tashrif', 'wazan', 'fiil madhi', 'fiil mudhari', 'ism fail', 'ism maful', 'mashdar', 'akar kata']
  },
  {
    id: 'rule-irab-tanda-dasar',
    title: 'Empat Macam I\'rab & Tanda-Tanda Utamanya',
    category: 'NAHWU',
    arabicTitle: 'أَنْوَاعُ الإِعْرَابِ وَعَلَامَاتُهَا',
    summary: 'I\'rab adalah perubahan akhir kata karena perbedaan amil. 4 jenis I\'rab: Rafa\', Nashab, Khafadh/Jar, dan Jazam.',
    content: `I'rab adalah perubahan harakat atau bentuk akhir kata dalam bahasa Arab sesuai dengan kedudukannya dalam kalimat.
Empat Jenis I'rab:
1. Rafa' (الرَّفْعُ): Tanda aslinya Dhammah (ُ). Berlaku untuk Ism dan Fi'il Mudhari'.
2. Nashab (النَّصْبُ): Tanda aslinya Fathah (َ). Berlaku untuk Ism dan Fi'il Mudhari'.
3. Khafadh / Jer (الخَفْضُ / الجَرُّ): Tanda aslinya Kasrah (ِ). Khusus berlaku untuk Ism (tidak ada pada Fi'il).
4. Jazam (الجَزْمُ): Tanda aslinya Sukun (ْ). Khusus berlaku untuk Fi'il Mudhari' (tidak ada pada Ism).`,
    examples: [
      { arabic: 'جَاءَ زَيْدٌ (Rafa\') - رَأَيْتُ زَيْدًا (Nashab) - مَرَرْتُ بِزَيْدٍ (Jer)', indo: 'Zaid datang - Aku melihat Zaid - Aku berjalan melewati Zaid', explanation: 'Perubahan harakat akhir kata Zaid (ٌ -> ً -> ٍ) sesuai kedudukannya.' }
    ],
    keywords: ['irab', 'rafa', 'nashab', 'jer', 'khafadh', 'jazam', 'dhammah', 'fathah', 'kasrah', 'sukun']
  },
  {
    id: 'rule-tips-baca-kitab',
    title: 'Metode & Tips Membaca Kitab Gundul (Turats)',
    category: 'BACA_KITAB',
    arabicTitle: 'قِرَاءَةُ الكُتُبِ التُّرَاثِيَّةِ',
    summary: 'Langkah praktis membaca teks Arab tanpa harakat (kitab gundul) bagi penuntut ilmu.',
    content: `Membaca kitab gundul membutuhkan keterpaduan antara Nahwu (posisi akhir kata) dan Shorof (bentuk kata):
Langkah Praktis Analisis Kalimat:
1. Tentukan jenis kalimat: Apakah diawali Ism (Jumlah Ismiyyah) atau Fi'il (Jumlah Fi'liyyah)?
2. Jika Jumlah Ismiyyah: Cari mana Subjek (Mubtada') dan cari penyempurna maknanya (Khabar).
3. Jika Jumlah Fi'liyyah: Identifikasi kata kerjanya (Fi'il), lalu tanyakan "Siapa pelakunya?" (Fa'il), dan "Apa objeknya?" (Ma'ful Bih).
4. Perhatikan Harf Jer: Jika ada Harf Jer (مِنْ, فِي, عَنْ, عَلَى, بِـ, لِـ), maka kata setelahnya dipastikan Ism Majrur dengan harakat akhir Kasrah.
5. Gunakan Kamus untuk Mufrodat asing dan pastikan pemahaman konteks keilmuan (Fiqih/Aqidah/Hadits).`,
    examples: [
      { arabic: 'طَهَارَةُ المَاءِ وَاجِبَةٌ', indo: 'Penyucian air itu hukumnya wajib', explanation: 'طَهَارَةُ = Mubtada\' (Mudhaf), المَاءِ = Mudhaf Ilaih (Kasrah), وَاجِبَةٌ = Khabar (Dhammah).' }
    ],
    keywords: ['kitab gundul', 'baca kitab', 'fathul qorib', 'cara baca kitab', 'turats', 'metode baca arab', 'harakat']
  }
];
