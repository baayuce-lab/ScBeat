import { InputType, Genre, TargetMedium } from '../types';
import { Language } from '../i18n';

export interface SamplePreset {
  id: string;
  title: string;
  genre: Genre;
  inputType: InputType;
  targetMedium: TargetMedium;
  tagline: string;
  scriptText: string;
}

export function getSamplePresets(lang: Language = 'tr'): SamplePreset[] {
  if (lang === 'tr') {
    return [
      {
        id: 'memory-broker',
        title: 'Hafıza Tüccarı',
        genre: 'Sci-Fi',
        inputType: 'screenplay_excerpt',
        targetMedium: 'Feature Film',
        tagline: 'Bilim Kurgu Kara Film • Yüksek Konsept • Zihin Özütleme',
        scriptText: `DIŞ. NEO-İSTANBUL - GECE (2088)

Yağmurla kaplı neon ışıklar kızıla çalan su birikintilerine yansıyor. KALE (40'larında), ıslak trençkotlu, siberneik gözü kehribar renginde parıldayan, SİNAPS KULÜBÜ'nün arkasındaki dar sokağa adım atar.

Bir sigara yakar. Eli hafifçe titremektedir.

KALE (DIŞ SES)
Benim mesleğimde ölüler konuşur. Yalnızca nöral yollar çürümeden önce bellek sürücüsünü çıkaracak birine ihtiyaçları var. Ölüm sonrası otuz dakika. Fırsat penceresi bu.

Kale, bir çöp konteynerine yaslanmış İtalyan takım elbiseli ölü bir şirket yöneticisinin yanında çömelir. Boynunun arkasındaki temiz iğne deliğinden kan süzülmektedir.

Pirinç kaplama NÖRAL HARVESTER cihazını kemerinden çıkarır. İkiz optik probları uzatır.

KALE
(cesede fısıldayarak)
Bakalım neyden kaçıyordun Vance.

Kale probu yöneticinin boyun girişine yerleştirir. Cihaz düşük frekanslı bir Titreşimle mırıldanır. Kale'nin bilek monitöründe holografik bir döküm belirir.

VERİ AKIŞI - HAFIZA PARÇASI #0492

- FLAŞ: SİYAH GÜNEŞ arması işlenmiş çelik bir kasa kapısı.
- FLAŞ: Küçük bir kız çocuğunun çığlığı: "Beni içeri kilitlemeyin!"
- FLAŞ: Gümüş bir küllükte yakılmış doğum belgesi. Belgedeki isim: KALE VANCE.

Kale donakalır. Sigara dudağından düşer.

KALE
(nefessiz)
Hayır. Bu... bu benim sesim.

Sibernektik gözü KIRMIZI parlar. Gözbebeğinde bir SİSTEM UYARISI belirir: [YETKİSİZ ARŞİV KEŞFEDİLDİ - 60 SANİYE İÇİNDE SİSTEM SİLME].

Islak sokakta yankılanan AYAK SESLERİ. Ağır, metalik.

KADIN SESİ (D.S.)
Vance'e veriyi önce senin çıkaracağını söylemiştim Kale. Unutulmuş çocukluğuna her zaman fazla meraklıydın.

Kale hızla döner, ağır susturuculu Magnum'unu çeker.

Buharın içinden ELENA (30'larında) çıkar; çene çizgisinde zarif siberneik implantlar vardır, elinde taktiksel bir kesici tabanca tutmaktadır.

ELENA
Sürücüyü bırak kardeşim. Yoksa geçmişinden geriye ne kaldıysa sileceğim.`
      },
      {
        id: 'mirror-room',
        title: 'Ayna Oda (Mirror Room)',
        genre: 'Psychological Thriller',
        inputType: 'pitch_concept',
        targetMedium: 'Feature Film',
        tagline: 'Psikolojik Gerilim • Akustik Korku • Karakter Odaklı',
        scriptText: `BAŞLIK: AYNA ODA (MIRROR ROOM)
PİTCH KONSEPTİ VE DRAFT ÖZETİ

LOGLINE HİPOTEZİ:
Geçirdiği gizemli el titremesi yüzünden kariyeri bitme noktasına gelen mükemmeliyetçi bir piyanist, kayalık bir uçuruma inşa edilmiş akustik harikası bir sığınakta deneysel bir ses terapisini kabul eder. Ancak frekanslar zihnini değiştirdikçe, ölen rakibinin hiç kaydedilmemiş bestelerini duymaya başlar ve evin onun zihnini çıldırtmadan önce son başyapıtını tamamlaması için akort ettiğinden şüphelenir.

PROTAGONİST:
CLARA CHEN (34) - Carnegie Hall'daki kapalı gişe solo konserinde açıklanamayan bir el titremesi yaşayan dünyaca ünlü klasik piyanist. Teknik mükemmellik tutkusuyla yanıp tutuşmakta ve rakibi JULIAN VANE'in trajik ölümünden derin suçluluk duymaktadır.

ANTAGONİST / KATALİZÖR:
DR. ARLO STRAND (50'lerinde) - Gizemli bir akustik mimar ve eski askeri ses mühendisi. "Yankı Odası" adını verdiği, tamamen rezonanslı kuvars kristali ve kavisli sedirden yapılmış evi tasarlamıştır.

PERDE I:
- Clara, sözleşmesi feshedilmeden önce son bir şans için ıssız sahil sığınağına gelir.
- Dr. Strand evin akustik özelliklerini tanıtır: Her duvar belirli notalarla rezonansa girmektedir.
- Başlatıcı Olay: İlk gece seansında Clara salondaki Steinway piyanosunda uyumsuz bir Do-minör akoru çalar. Ev sesi yankılatmaz, Julian'ın ölmeden saatler önce bestelediği bir karşı melodiyle yanıt verir.

PERDE II:
- Orta Nokta Kırılması: Clara duvarların arkasına gizlenmiş ses kayıt diyaframlarını keşfeder. Strand onu tedavi etmemektedir; Julian'ın bitmemiş 'Ölüm Sonatı'nı deşifre etmek için Clara'nın duygusal beyin frekansını kullanmaktadır.
- Clara çalmaya devam ettikçe titremeler durur fakat gerçeklikle bağı kopar. Piyanoda Julian'ın yansımasını görür.

PERDE III:
- Doruk Noktası (Climax): Clara, Sonat'ın son bölümünün uçurumdaki cam yapıyı tuzla buz edecek ölümcül bir rezonans frekansı içerdiğini anlar. Ya müziğin yıkıcı dehasına teslim olacak ya da bilerek kusurlu bir nota çalarak ses döngüsünü kıracaktır.`
      },
      {
        id: 'the-last-harvest',
        title: 'Son Hasat (The Last Harvest)',
        genre: 'Drama',
        inputType: 'outline',
        targetMedium: 'Feature Film',
        tagline: 'Sert Drama • Aile Dinamikleri • Tarımsal Çatışma',
        scriptText: `SON HASAT - SİNEMA PRAGMATİK ÖZETİ

MEKAN: Napa Vadisi, Kaliforniya - Günümüz (Tarihi Kuraklık Sezonu)

LOGLINE:
Eşi benzeri görülmemiş bir kuraklık ve borç yüküyle karşı karşıya kalan boyun eğmez bir bağ sahibi, atasından kalan araziyi acımasız bir şirkete satmak ya da küs olduğu biyolog kızıyla radical bir toprak canlandırma yöntemine güvenmek arasında seçim yapmak zorundadır.

KARAKTERLER:
1. MARGARET ROSSI (62) - İnatçı, dürüst, üçüncü kuşak üzüm üreticisi. Geleneğe ve emek birliğine inanır.
2. MAYA ROSSI (28) - Margaret’ın kızı. Eski agritech araştırmacısı. Annesinin onayını ararken onun inatçılığıyla savaşır.
3. HARRISON VANE (50'lerinde) - Apex Global İçecek A.Ş. Başkan Yardımcısı. Tarihi bağı lüks turizm tesisine dönüştürmek için 12 milyon dolar teklif eder.

PERDE VURUŞLARI:
- Başlatıcı Olay: Margaret sulama birliğinden tahliye ve su kesim ihbarı aldığı gün, Maya elinde laboratuvar ekipmanları ve biyo-çar örnekleriyle çıkagelir.
- Birinci Perde Sonu: Margaret şirketin teklifini reddeder ve Maya'nın 30 günlük toprak aşılama deneyine kuruyan tek bir dönümlük Cabernet bağını test alanı olarak verir.
- Orta Nokta: Maya'nın özel mikropları kuruyan alanı bir gecede çiçeklendirir ancak şirket yerel tarım kuruluna sahte sızıntı raporları sızdırır.
- Her Şey Kaybedildi: Müfettiş test alanının yakılmasına karar verir. Margaret, Maya'yı utanç içinde San Francisco'ya kaçmaya çalışırken yakalar.
- Zirve (Climax): Margaret ve küçük çiftçiler müfettişin dozerlerinin önünde durur. Yapılan canlı toprak analiziyle Maya'nın yönteminin tüm vadinin yeraltı su tablasını kurtardığı kanıtlanır.`
      }
    ];
  }

  if (lang === 'es') {
    return [
      {
        id: 'memory-broker',
        title: 'El Traficante de Memorias',
        genre: 'Sci-Fi',
        inputType: 'screenplay_excerpt',
        targetMedium: 'Feature Film',
        tagline: 'Ciencia Ficción Noir • Alto Concepto • Extracción de Memoria',
        scriptText: `EXT. NEO-CHICAGO - NOCHE (2088)

Luces de neón reflejadas en charcos carmesí. KALE (40s), gabardina húmeda, ojo cibernético ámbar, camina hacia el callejón detrás de EL CLUB SINOPSIS.

Enciende un cigarrillo. Le tiembla ligeramente la mano.

KALE (V.O.)
En mi trabajo, los muertos sí hablan. Solo necesitan a alguien que extraiga el disco antes de que las vías neuronales se degraden. Veinte minutos post-mortem. Esa es la ventana.

Kale se agacha junto a un ejecutivo corporativo muerto en traje italiano.

KALE
(susurrando al cadáver)
Veamos de qué estabas huyendo, Vance.`
      },
      {
        id: 'mirror-room',
        title: 'Sala de Espejos (Mirror Room)',
        genre: 'Psychological Thriller',
        inputType: 'pitch_concept',
        targetMedium: 'Feature Film',
        tagline: 'Thriller Psicológico • Terror Acústico • Guiado por Personajes',
        scriptText: `TÍTULO: SALA DE ESPEJOS (MIRROR ROOM)
CONCEPTO DE PITCH Y TRATAMIENTO

PREMISA DEL LOGLINE:
Cuando una pianista de concierto perfeccionista que sufre de temblor en las manos se retira a un santuario acústico construido en un acantilado, acepta una terapia de sonido experimental. A medida que las frecuencias alteran su percepción neural, comienza a escuchar composiciones no grabadas de su difunto rival...`
      },
      {
        id: 'the-last-harvest',
        title: 'La Última Cosecha',
        genre: 'Drama',
        inputType: 'outline',
        targetMedium: 'Feature Film',
        tagline: 'Drama Intenso • Dinámica Familiar • Conflicto Agrícola',
        scriptText: `LA ÚLTIMA COSECHA - ESQUEMA DE LARGOMETRAJE

LOGLINE:
Enfrentando una sequía sin precedentes y una deuda abrumadora, la dueña de un viñedo debe elegir entre vender la propiedad ancestral a una corporación o confiar en su hija distanciad para probar un método radical de regeneración del suelo.`
      }
    ];
  }

  // English default
  return [
    {
      id: 'memory-broker',
      title: 'The Memory Broker',
      genre: 'Sci-Fi',
      inputType: 'screenplay_excerpt',
      targetMedium: 'Feature Film',
      tagline: 'Sci-Fi Noir • High Concept • Memory Extraction',
      scriptText: `EXT. NEO-CHICAGO - NIGHT (2088)

Rain slicked neon reflected in crimson puddles. KALE (40s), trenchcoat damp, cibernetica eye gleaming amber, steps into the alley behind THE SYNAPSE CLUB.

He lights a cigarette. Hand trembles slightly. 

KALE (V.O.)
In my line of work, dead men do tell tales. They just need someone to harvest the drive before the neural pathways decay. Thirty minutes post-mortem. That’s the window.

Kale crouches beside a dead corporate executive in an Italian suit, slumped against a dumpster. Blood trickling from a clean needle entry at the nape of his neck.

Kale pulls a brass-plated NEURAL HARVESTER from his belt. Extends the twin optic probes.

KALE
(whispering to the corpse)
Let’s see what you were running from, Vance.

Kale inserts the probe into the executive’s neck port. The device HUMS with low-frequency resonance. A holographic readout flickers over Kale’s wrist monitor.

DATA STREAM - MEMORY FRAGMENT #0492

- FLASH: A steel vault door, etched with a BLACK SUN crest.
- FLASH: A young girl’s voice crying out, "Don't lock me in!"
- FLASH: A birth certificate burned in a silver ashtray. Name on certificate: KALE VANCE.

Kale freezes. Cigarette drops from his lip.

KALE
(breathless)
No. That’s... that’s my voice. 

His cybernetic eye flares RED. A SYSTEM WARNING blinks across his iris: [UNAUTHORIZED ARCHIVE DISCOVERED - SYSTEM PURGE IN 60 SECONDS].

FOOTSTEPS echoing down the damp alley. Heavy, metallic.

FEMALE VOICE (O.S.)
I told Vance you’d extract it first, Kale. You always were too curious about your forgotten childhood.

Kale whips around, drawing his heavy suppressed Magnum. 

Out of the steam steps ELENA (30s), sleek cybernetic implants along her jawline, holding a tactical disrupter pistol.

ELENA
Drop the drive, brother. Or I delete the rest of who you were.`
    },
    {
      id: 'mirror-room',
      title: 'Mirror Room',
      genre: 'Psychological Thriller',
      inputType: 'pitch_concept',
      targetMedium: 'Feature Film',
      tagline: 'Psychological Thriller • Acoustic Horror • Character Driven',
      scriptText: `TITLE: MIRROR ROOM
PITCH CONCEPT & TREATMENT OUTLINE

LOGLINE PREMISE:
When a perfectionist concert pianist suffering from debilitating stage tremor retreats to an isolated, acoustics-engineered sanctuary built into a cliffside, she agrees to an experimental sonic therapy. But as the sound frequencies alter her neural perception, she begins hearing the unrecorded compositions of her deceased rival—and suspects the house is tuning her mind to finish his final masterpiece before it drives her mad.

PROTAGONIST:
CLARA CHEN (34) - World-renowned classical pianist whose career collapsed following a unexplained hand tremor during a sold-out Carnegie Hall solo. Driven by an obsessive need for technical perfection and consumed by guilt over the tragic death of her rival and former lover, JULIAN VANE.

ANTAGONIST / CATALYST:
DR. ARLO STRAND (50s) - An enigmatic acoustic architect and former sound engineer for secret military bio-research. He created the "Echo Chamber"—a house built entirely of resonant quartz crystal and curved cedar that amplifies specific neural brainwaves through sub-harmonic frequencies.

ACT I:
- Clara arrives at the solitary coastal retreat, desperate for a breakthrough before her final contract is terminated.
- Dr. Strand introduces the house's acoustic properties: every wall resonates to specific notes.
- Inciting Incident: During her first late-night session, Clara plays a dissonant C-minor chord on the parlor Steinway. The house doesn't echo her notes—it responds with a counter-melody Julian composed hours before he died.

ACT II:
- Midpoint Shift: Clara discovers hidden audio recording diaphragms embedded behind the plaster walls. Strand isn't treating her—he is using her brain's emotional frequency to decode Julian's unfinished 'Death Sonata'.
- As Clara continues playing, the tremors stop, but her grip on reality breaks. She sees Julian's reflection in the piano's polished lid guiding her hands.

ACT III:
- Climax: Clara realizes the final movement of the Sonata contains a lethal resonant pitch designed to shatter the glass structure over the cliff. She must choose: surrender to the destructive genius of the music, or intentionally play a flawed, imperfect note that breaks the sonic feedback loop and destroys Strand's trap.`
    },
    {
      id: 'the-last-harvest',
      title: 'The Last Harvest',
      genre: 'Drama',
      inputType: 'outline',
      targetMedium: 'Feature Film',
      tagline: 'Grit Drama • Family Dynamics • Agricultural Conflict',
      scriptText: `THE LAST HARVEST - FEATURE OUTLINE

SETTING: Napa Valley, California - Present Day (Record Drought Season)

THE LOGLINE:
Facing an unprecedented multi-year drought and crippling debt, an unyielding second-generation vineyard owner must choose between selling her ancestral estate to a predatory corporate winery or entrusting the land to her estranged daughter, a disgraced Silicon Valley bio-hacker advocating a radical, unproven soil regeneration method.

CHARACTERS:
1. MARGARET ROSSI (62) - Proud, stubborn, third-generation grape grower. Believes in tradition, sweat, and legacy above all else. Her pride is her fortress and her trap.
2. MAYA ROSSI (28) - Margaret’s daughter. Ex-agritech researcher ousted for whistleblower activities. Highly intelligent, guarded, seeking her mother's unspoken approval while fighting her stubbornness.
3. HARRISON VANE (50s) - Executive VP of Apex Global Beverage. Charming, ruthless, offering $12M to convert the historical vineyard into luxury tourist villas.

ACT BARKER BEATS:
- Inciting Incident: Margaret receives an eviction & water shut-off notice from the irrigation district on the exact day Maya unexpectedly returns home carrying a backpack of lab equipment and bio-char samples.
- Lock In (End of Act 1): Margaret refuses Apex Global’s initial buyout offer, agreeing to give Maya’s 30-day soil inoculation experiment ONE acre of dying Cabernet vines as a test plot.
- Midpoint: Maya’s experimental soil microbe culture brings the dead test plot back to bloom overnight, but Apex Global leaks false reports of soil contamination to the local agricultural board, threatening a county-wide quarantine.
- Low Point / All is Lost: The local inspector orders the test plot burned. Margaret catches Maya preparing to flee back to San Francisco out of shame and failure.
- Climax: Margaret stands in front of the inspector’s bulldozers alongside local small farmers, proving through a live public soil sample test that Maya’s bio-char restored the water table for the entire valley.`
    }
  ];
}
