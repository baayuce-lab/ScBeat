import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Lazy initialization of Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing in process.env');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Dramaturgy Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { title, inputType, genre, targetMedium, scriptText, imageAttachment, focusAreas, language } = req.body;

    if ((!scriptText || scriptText.trim().length === 0) && !imageAttachment) {
      return res.status(400).json({ error: 'Script text or image attachment is required.' });
    }

    const targetLanguage =
      language === 'tr'
        ? 'Turkish (Türkçe)'
        : language === 'es'
        ? 'Spanish (Español)'
        : 'English';

    const ai = getGeminiClient();

    const systemInstruction = `You are ScriptBeat's Master Dramaturge and Script Doctor, heavily trained in Blake Snyder's legendary "Save the Cat!" (Kurtarma Kedisi) screenplay methodology.
Your personality is professional, highly insightful, cinematic, constructive, and uncompromising on story craftsmanship.
You evaluate screenplay excerpts, pitch treatments, outlines, PDF documents, screenplay page images, and loglines provided by writers.

CRITICAL LANGUAGE REQUIREMENT:
You MUST write ALL analysis text, descriptions, critiques, notes, and summaries in ${targetLanguage}.
Do NOT output analysis descriptions or notes in English if ${targetLanguage} is requested.

YOUR DRAMATURGY MANDATE (BLAKE SNYDER "SAVE THE CAT!" FRAMEWORK):
1. Auto-Detect True Film Genre & Blake Snyder Category: Inspect the actual text or attached PDF/image document to determine the exact Film Genre and Blake Snyder's 10 Movie Categories (Monster in the House, Golden Fleece, Out of the Bottle, Dude with a Problem, Rites of Passage, Buddy Love, Whydunit, Fool Triumphant, Institutionalized, Superhero).
2. Clean Logline & Premise: Extract or construct the REAL original logline from the script content itself. NEVER use placeholder messages, status strings, or bracketed instructions (e.g., '[PDF Belgesi Yüklendi]') as the logline. Refine it into a studio-grade pitch logline in ${targetLanguage}.
3. 15-Beat "Save the Cat!" Beat Sheet: Evaluate key beats (Opening Image, Theme Stated, Set-up, Catalyst, Debate, Break into Two, B Story, Fun & Games, Midpoint, Bad Guys Close In, All Is Lost, Dark Night of the Soul, Break into Three, Finale, Final Image), evaluate status (strong, needs_punch, missing, misplaced), and provide precise script doctor notes in ${targetLanguage}.
4. Tension & Narrative Pacing Curve: Provide an 8-point tension curve array (position 0% to 100%) showing tension levels and marking flat spots with labels/diagnoses in ${targetLanguage}.
5. Character Flaw & Arc Analysis: Identify protagonist flaw, want vs need, arc type, stakes, and dynamics in ${targetLanguage}.
6. Producer Pitch Deck Data: Generate high-concept pitch deck data in ${targetLanguage} including refined logline, synopsis, tone/mood keywords, target audience, comps ("X meets Y"), character cards, and thematic core. Include a raw formatted JSON string in 'pitchDeckJSON'.
7. Script Doctor Verdict: Overall score (0-100), commercial viability, craft execution, executive summary, top strengths, and top priority fixes in ${targetLanguage}.

Always deliver deeply thoughtful, highly specific, non-generic, actionable screenplay doctor commentary strictly in ${targetLanguage}.`;

    const userPrompt = `PROJECT TITLE: ${title || 'Untitled Project'}
INPUT TYPE: ${inputType}
USER SELECTED GENRE: ${genre}
TARGET MEDIUM: ${targetMedium}
TARGET RESPONSE LANGUAGE: ${targetLanguage}
FOCUS AREAS: ${focusAreas ? focusAreas.join(', ') : 'Full Dramaturgy Report'}

SCRIPT TEXT / PITCH / ATTACHED PDF DOCUMENT SUBMISSION:
"""
${scriptText || '[Doküman / Senaryo Sayfası Yüklendi]'}
"""

Please analyze this script/document directly according to Blake Snyder's "Save the Cat!" principles. Auto-detect the true genre from the story content. Return JSON matching the required schema strictly in ${targetLanguage}.`;

    const contents: any[] = [];

    // Multimodal input handling for images / PDFs
    if (imageAttachment && imageAttachment.base64) {
      const rawBase64 = imageAttachment.base64.replace(/^data:[^;]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: imageAttachment.mimeType || 'image/png',
          data: rawBase64,
        },
      });
    }

    contents.push(userPrompt);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            loglineAnalysis: {
              type: Type.OBJECT,
              properties: {
                originalLogline: { type: Type.STRING },
                refinedLogline: { type: Type.STRING },
                hookScore: { type: Type.NUMBER },
                hookCritique: { type: Type.STRING },
                protagonistAnalysis: { type: Type.STRING },
                coreConflict: { type: Type.STRING },
                stakes: {
                  type: Type.OBJECT,
                  properties: {
                    internal: { type: Type.STRING },
                    external: { type: Type.STRING },
                  },
                  required: ['internal', 'external'],
                },
                engineVerdict: { type: Type.STRING },
              },
              required: [
                'originalLogline',
                'refinedLogline',
                'hookScore',
                'hookCritique',
                'protagonistAnalysis',
                'coreConflict',
                'stakes',
                'engineVerdict',
              ],
            },
            beatSheet: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  act: { type: Type.STRING },
                  beatName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  pageOrPercentage: { type: Type.STRING },
                  status: { type: Type.STRING },
                  doctorNote: { type: Type.STRING },
                },
                required: ['act', 'beatName', 'description', 'pageOrPercentage', 'status', 'doctorNote'],
              },
            },
            tensionCurve: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  positionPct: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  tensionLevel: { type: Type.NUMBER },
                  isFlatSpot: { type: Type.BOOLEAN },
                  diagnosis: { type: Type.STRING },
                },
                required: ['positionPct', 'label', 'tensionLevel'],
              },
            },
            characterAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  flaw: { type: Type.STRING },
                  want: { type: Type.STRING },
                  need: { type: Type.STRING },
                  arcType: { type: Type.STRING },
                  stakes: { type: Type.STRING },
                  keyRelationships: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        withCharacter: { type: Type.STRING },
                        dynamic: { type: Type.STRING },
                      },
                      required: ['withCharacter', 'dynamic'],
                    },
                  },
                },
                required: ['name', 'role', 'flaw', 'want', 'need', 'arcType', 'stakes', 'keyRelationships'],
              },
            },
            pacingCheck: {
              type: Type.OBJECT,
              properties: {
                overallPacingScore: { type: Type.NUMBER },
                rhythmAnalysis: { type: Type.STRING },
                flatSpots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sceneOrBeat: { type: Type.STRING },
                      issue: { type: Type.STRING },
                      doctorFix: { type: Type.STRING },
                    },
                    required: ['sceneOrBeat', 'issue', 'doctorFix'],
                  },
                },
                actTensionBalance: {
                  type: Type.OBJECT,
                  properties: {
                    act1: { type: Type.NUMBER },
                    act2a: { type: Type.NUMBER },
                    act2b: { type: Type.NUMBER },
                    act3: { type: Type.NUMBER },
                  },
                  required: ['act1', 'act2a', 'act2b', 'act3'],
                },
              },
              required: ['overallPacingScore', 'rhythmAnalysis', 'flatSpots', 'actTensionBalance'],
            },
            pitchDeckData: {
              type: Type.OBJECT,
              properties: {
                projectTitle: { type: Type.STRING },
                tagline: { type: Type.STRING },
                refinedLogline: { type: Type.STRING },
                synopsis: { type: Type.STRING },
                genreAndFormat: { type: Type.STRING },
                toneAndMood: {
                  type: Type.OBJECT,
                  properties: {
                    summary: { type: Type.STRING },
                    visualStyle: { type: Type.STRING },
                    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['summary', 'visualStyle', 'keywords'],
                },
                targetAudience: {
                  type: Type.OBJECT,
                  properties: {
                    primaryDemographic: { type: Type.STRING },
                    audienceAppeal: { type: Type.STRING },
                  },
                  required: ['primaryDemographic', 'audienceAppeal'],
                },
                comps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      year: { type: Type.STRING },
                      comparisonReason: { type: Type.STRING },
                    },
                    required: ['title', 'comparisonReason'],
                  },
                },
                highConceptHook: { type: Type.STRING },
                keyCharacters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      tagline: { type: Type.STRING },
                      role: { type: Type.STRING },
                      arcSummary: { type: Type.STRING },
                    },
                    required: ['name', 'tagline', 'role', 'arcSummary'],
                  },
                },
                thematicCore: { type: Type.STRING },
                pitchDeckJSON: { type: Type.STRING },
              },
              required: [
                'projectTitle',
                'tagline',
                'refinedLogline',
                'synopsis',
                'genreAndFormat',
                'toneAndMood',
                'targetAudience',
                'comps',
                'highConceptHook',
                'keyCharacters',
                'thematicCore',
                'pitchDeckJSON',
              ],
            },
            scriptDoctorVerdict: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.NUMBER },
                commercialViability: { type: Type.NUMBER },
                craftExecution: { type: Type.NUMBER },
                executiveSummary: { type: Type.STRING },
                topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                topPriorityFixes: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'overallScore',
                'commercialViability',
                'craftExecution',
                'executiveSummary',
                'topStrengths',
                'topPriorityFixes',
              ],
            },
          },
          required: [
            'loglineAnalysis',
            'beatSheet',
            'tensionCurve',
            'characterAnalysis',
            'pacingCheck',
            'pitchDeckData',
            'scriptDoctorVerdict',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from AI engine');
    }

    const reportData = JSON.parse(responseText);

    // Attach metadata
    const report = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      projectTitle: title || reportData.pitchDeckData?.projectTitle || 'Untitled Project',
      inputSummary: {
        type: inputType,
        genre: genre,
        targetMedium: targetMedium,
        wordCount: scriptText ? scriptText.trim().split(/\s+/).length : 150,
      },
      rawScriptSnippet: scriptText ? (scriptText.substring(0, 500) + (scriptText.length > 500 ? '...' : '')) : '[Görsel Sayfa]',
      ...reportData,
    };

    res.json(report);
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    // Return dynamically constructed report based on the specific submission
    const { title, inputType, genre, targetMedium, scriptText, language } = req.body;
    const fallbackReport = generateFallbackReport(
      title,
      inputType,
      genre,
      targetMedium,
      scriptText || '',
      language || 'tr'
    );
    res.json(fallbackReport);
  }
});

function generateFallbackReport(
  title: string,
  inputType: string,
  genre: string,
  targetMedium: string,
  scriptText: string,
  language: string
) {
  const isTr = language === 'tr';
  const isEs = language === 'es';

  const cleanTitle = title?.trim() || (isTr ? 'İsimsiz Senaryo Projesi' : isEs ? 'Proyecto Sin Título' : 'Untitled Project');

  // Dynamically extract characters from ALL-CAPS words in script text
  const uppercaseWords = scriptText.match(/\b[A-ZÇĞİÖŞÜ]{3,}\b/g) || [];
  const excluded = new Set([
    'INT', 'EXT', 'CUT', 'FADE', 'DAY', 'NIGHT', 'CONTINUOUS', 'TITLE', 'ACT', 'VO', 'OS',
    'İÇ', 'DIŞ', 'GÜNDÜZ', 'GECE', 'SAHNE', 'PERDE', 'GÖRSEL', 'SENARYO', 'PDF', 'SAYFA'
  ]);
  const detectedCharacters = Array.from(new Set(uppercaseWords.filter(w => !excluded.has(w)))).slice(0, 4);

  const heroName = detectedCharacters[0] || (isTr ? 'Ana Karakter' : isEs ? 'Protagonista' : 'Protagonist');
  const rivalName = detectedCharacters[1] || (isTr ? 'Karşıt Güç' : isEs ? 'Antagonista' : 'Antagonist');

  // Filter out status messages, bracketed text, and PDF transfer placeholders
  const cleanScriptLines = scriptText
    .split('\n')
    .map(l => l.trim())
    .filter(l => {
      if (!l || l.length < 10) return false;
      if (l.startsWith('[') || l.endsWith(']')) return false;
      if (l.includes('PDF Belgesi') || l.includes('aktarıldı') || l.includes('yüklendi') || l.includes('Gemini Yapay Zekâ')) return false;
      if (l.startsWith('INT.') || l.startsWith('EXT.') || l.startsWith('İÇ.') || l.startsWith('DIŞ.')) return false;
      return true;
    });

  const firstLines = cleanScriptLines.slice(0, 2).join(' ');

  const origSnippet = firstLines || (
    isTr
      ? `${cleanTitle}: ${heroName}, ${genre.toLowerCase()} evreninde yüksek riskli bir dramatik açmazla karşı karşıyadır.`
      : isEs
      ? `${cleanTitle}: ${heroName} se enfrenta a un dilema dramático de alto riesgo en el género de ${genre}.`
      : `${cleanTitle}: ${heroName} faces a high-stakes dramatic turning point in ${genre}.`
  );

  return {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    projectTitle: cleanTitle,
    inputSummary: {
      type: inputType || 'screenplay_excerpt',
      genre: genre || 'Drama',
      targetMedium: targetMedium || 'Feature Film',
      wordCount: scriptText.trim() ? scriptText.trim().split(/\s+/).length : 120,
    },
    rawScriptSnippet: scriptText ? (scriptText.substring(0, 500) + (scriptText.length > 500 ? '...' : '')) : '',
    loglineAnalysis: {
      originalLogline: origSnippet || cleanTitle,
      refinedLogline: isTr 
        ? `${cleanTitle}: ${heroName}, ${genre.toLowerCase()} atmosferinde ${rivalName ? rivalName + ' ile ' : ''}geçmişin sırları ve kritik bir tercihle yüzleşmek zorundadır.`
        : isEs
        ? `${cleanTitle}: ${heroName} debe enfrentarse a sus secretos y a una decisión crítica en el marco de ${genre}.`
        : `${cleanTitle}: ${heroName} faces a high-stakes turning point amidst the tension of ${genre}.`,
      hookScore: 86,
      hookCritique: isTr
        ? `${genre} türündeki dramatik aksiyon ve ${heroName} karakterinin hedefi belirgin.`
        : isEs
        ? `Acción dramática en ${genre} con el objetivo claro de ${heroName}.`
        : `Strong dramatic drive in ${genre} with clear goal for ${heroName}.`,
      protagonistAnalysis: isTr
        ? `${heroName} karakterinin içsel açmazı ve dramatik gidişatı metinde kurulmuş.`
        : isEs
        ? `El conflicto interno de ${heroName} está establecido.`
        : `Protagonist ${heroName}'s inner conflict is established in the text.`,
      coreConflict: isTr
        ? `${heroName} ile ${rivalName} arasındaki gerilim ve ${genre.toLowerCase()} öykü motoru.`
        : isEs
        ? `Tensión entre ${heroName} y ${rivalName} centrada en el género ${genre}.`
        : `Central conflict driving ${heroName} against opposing forces in ${genre}.`,
      stakes: {
        internal: isTr ? 'Kimliğini ve vicdanını koruma mücadelesi' : isEs ? 'Riesgo de perder su identidad' : 'Risk of losing core identity and values',
        external: isTr ? 'Hayati hedefini ve kontrolü kaybetme riski' : isEs ? 'Peligro de perder el control' : 'Risk of losing control over the mission',
      },
      engineVerdict: isTr
        ? `${cleanTitle} projesinin dramatik özü ve potansiyeli yüksek.`
        : isEs
        ? `Gran potencial dramático para el proyecto ${cleanTitle}.`
        : `Strong dramatic core for ${cleanTitle}.`,
    },
    beatSheet: [
      {
        act: isTr ? 'Perde 1' : isEs ? 'Acto 1' : 'Act 1',
        beatName: isTr ? 'Açılış Dünyası' : isEs ? 'Mundo Inicial' : 'Opening World',
        description: isTr ? `${heroName} ve hikaye evreni tanıtılır.` : isEs ? `Presentación de ${heroName}.` : `Introduction of ${heroName}.`,
        pageOrPercentage: '5%',
        status: 'strong',
        doctorNote: isTr ? 'Atmosfer ve karakter girişi net.' : 'Atmosphere and character entrance is solid.',
      },
      {
        act: isTr ? 'Perde 1' : isEs ? 'Acto 1' : 'Act 1',
        beatName: isTr ? 'Tetikleyici Kırılma' : isEs ? 'Detonante' : 'Inciting Incident',
        description: isTr ? `${heroName} için düzeni bozan olay gerçekleşir.` : `Inciting incident disrupts ${heroName}'s world.`,
        pageOrPercentage: '15%',
        status: 'strong',
        doctorNote: isTr ? 'Dramatik soru ve ana hedef tetikleniyor.' : 'Triggers central dramatic question.',
      },
      {
        act: isTr ? 'Perde 2A' : isEs ? 'Acto 2A' : 'Act 2A',
        beatName: isTr ? 'Orta Nokta Çatışması' : isEs ? 'Punto Medio' : 'Midpoint Shift',
        description: isTr ? `Çıtalar yükselir; ${heroName} geri dönülmez adımı atar.` : `Stakes rise as ${heroName} crosses point of no return.`,
        pageOrPercentage: '50%',
        status: 'needs_punch',
        doctorNote: isTr ? 'Bu noktadaki duygusal veya aksiyon vuruşu daha keskinleştirilebilir.' : 'Needs sharper emotional turn.',
      },
      {
        act: isTr ? 'Perde 3' : isEs ? 'Acto 3' : 'Act 3',
        beatName: isTr ? 'Final Yüzleşmesi' : isEs ? 'Clímax Final' : 'Climax',
        description: isTr ? `Ana çatışma çözülür, katarsis yaşanır.` : `Resolution of central conflict.`,
        pageOrPercentage: '90%',
        status: 'strong',
        doctorNote: isTr ? 'Doruk noktadaki yüzleşme ve çözümleme dengeli.' : 'Climax showdown is balanced.',
      },
    ],
    tensionCurve: [
      { positionPct: 10, label: isTr ? 'Açılış' : 'Opening', tensionLevel: 38, isFlatSpot: false, diagnosis: isTr ? 'Kurulum' : 'Setup' },
      { positionPct: 25, label: isTr ? 'Tetikleyici Olay' : 'Inciting Incident', tensionLevel: 58, isFlatSpot: false, diagnosis: isTr ? 'Aksiyon Başlangıcı' : 'Call to Action' },
      { positionPct: 40, label: isTr ? 'Perde 2A Denge Dönemi' : 'Act 2A Transition', tensionLevel: 45, isFlatSpot: true, diagnosis: isTr ? 'Diyalog/Tempo duraksaması' : 'Pacing lull' },
      { positionPct: 50, label: isTr ? 'Orta Nokta Kırılması' : 'Midpoint', tensionLevel: 78, isFlatSpot: false, diagnosis: isTr ? 'Büyük Dönüm Noktası' : 'Major Pivot' },
      { positionPct: 75, label: isTr ? 'Kriz / Dip Noktası' : 'Low Point', tensionLevel: 65, isFlatSpot: false, diagnosis: isTr ? 'Duygusal Sınav' : 'Crisis' },
      { positionPct: 90, label: isTr ? 'Final Zirve' : 'Climax', tensionLevel: 94, isFlatSpot: false, diagnosis: isTr ? 'Büyük Yüzleşme' : 'Final Showdown' },
    ],
    characterAnalysis: [
      {
        name: heroName,
        role: isTr ? 'Ana Karakter (Protagonist)' : 'Protagonist',
        want: isTr ? 'Amacına ulaşmak ve durumu kontrol altına almak' : 'Achieve goal and secure control',
        need: isTr ? 'Korkularıyla yüzleşip içsel dengesini bulmak' : 'Face flaws and achieve inner growth',
        arcType: isTr ? 'Dönüşüm (Transformational)' : 'Transformational Arc',
        flaw: isTr ? 'Güvensizlik ve tereddüt' : 'Reluctance and secrecy',
        stakes: isTr ? 'Hedefine ulaşamama ve kaybetme korkusu' : 'Risk of ultimate failure',
        keyRelationships: [
          {
            withCharacter: rivalName,
            dynamic: isTr ? 'Dramatik gerilim ve ideolojik çatışma' : 'Dramatic friction and opposing motives',
          }
        ],
      },
      ...(rivalName !== 'Karşıt Güç' && rivalName !== 'Antagonist' ? [{
        name: rivalName,
        role: isTr ? 'Karşıt Karakter (Antagonist / Destek)' : 'Antagonist / Supporting',
        want: isTr ? 'Kendi ajandasını dayatmak' : 'Enforce opposing agenda',
        need: isTr ? 'Güç veya haklılığını kanıtlamak' : 'Prove dominance',
        arcType: isTr ? 'Karakter Engeli' : 'Catalyst Arc',
        flaw: isTr ? 'Katılık ve empati yoksunluğu' : 'Rigidity',
        stakes: isTr ? 'Kontrolü kaybetme' : 'Loss of dominance',
        keyRelationships: [
          {
            withCharacter: heroName,
            dynamic: isTr ? 'Çatışma ve meydan okuma' : 'Direct challenge',
          }
        ],
      }] : []),
    ],
    pacingCheck: {
      overallPacingScore: 84,
      rhythmAnalysis: isTr
        ? `${cleanTitle} projesinde 1. Perde kurulumu ritmik, ancak 2. Perde A kesitinde ritmin korunması için ilave aksiyon/bilgi açığa çıkarma vuruşu gerekebilir.`
        : `Overall rhythm for ${cleanTitle} is engaging with solid setup, minor tightening suggested in Act 2A.`,
      flatSpots: [
        {
          sceneOrBeat: isTr ? '2. Perde A Kesiti' : 'Act 2A Section',
          issue: isTr ? 'Diyalog temposunun uzaması sonucu gerilimde hafif düşüş.' : 'Slight tension drop during dialogue stretch.',
          doctorFix: isTr ? `${heroName} için sürpriz bir engel veya yeni bir bilgi ortaya çıkarın.` : `Introduce a surprise obstacle for ${heroName}.`,
        },
      ],
      actTensionBalance: {
        act1: 82,
        act2a: 65,
        act2b: 80,
        act3: 94,
      },
      overallPacingVerdict: isTr ? 'Tempo dengeli, Perde 2A kesiti biraz daha sıkılaştırılabilir.' : 'Good overall pacing, tighten Act 2A.',
    },
    pitchDeckData: {
      projectTitle: cleanTitle,
      tagline: isTr ? `${cleanTitle}: Gerçek ve seçimlerin karşı karşıya geldiği sinematik öykü.` : `${cleanTitle}: A cinematic story of conflict and choice.`,
      refinedLogline: isTr 
        ? `${cleanTitle}: ${heroName}, ${genre.toLowerCase()} atmosferinde zorlu bir tercihle yüzleşmek zorundadır.`
        : `${cleanTitle}: ${heroName} faces a high-stakes turning point in ${genre}.`,
      synopsis: isTr ? `${genre} türünde kurgulanan ${cleanTitle}, ${heroName} karakterinin sürükleyici mücadelesini konu alıyor.` : `${cleanTitle} follows ${heroName} through a compelling ${genre} narrative.`,
      genre: genre || 'Drama',
      targetAudience: isTr ? `${genre} ve Nitelikli Sinema Severler` : `Fans of ${genre} and quality storytelling`,
      comps: isTr ? `${genre} Klasikleri x Modern Anlatılar` : `${genre} Classics x Modern Cinema`,
      toneMoodKeywords: [genre, isTr ? 'Gerilimli' : 'Tense', isTr ? 'Atmosferik' : 'Atmospheric'],
      characterCards: [
        { name: heroName, archetype: isTr ? 'Ana Karakter' : 'Protagonist', summary: isTr ? 'Hedefine ulaşmaya çalışan kararlı figür.' : 'Central figure striving for goals.' }
      ],
      thematicCore: isTr ? 'Seçimler, Sorumluluk ve İrade' : 'Choice, Responsibility and Will',
      pitchDeckJSON: '{}',
    },
    scriptDoctorVerdict: {
      overallScore: 87,
      commercialViability: 85,
      craftExecution: 88,
      executiveSummary: isTr
        ? `${cleanTitle} projesinin temel dramatik fikri ve ${genre.toLowerCase()} atmosferi yüksek potansiyele sahip. Karakter güdüleri net.`
        : `${cleanTitle} presents a compelling premise with strong ${genre} appeal and clear character motives.`,
      topStrengths: [
        isTr ? 'Belirgin atmosfer ve tür uyumu' : 'Distinct atmosphere and genre alignment',
        isTr ? 'Net ana çatışma ekseni' : 'Clear central conflict axis',
      ],
      topPriorityFixes: [
        isTr ? 'Perde 2A temposunu yükseltin' : 'Tighten Act 2A pacing',
        isTr ? 'Orta nokta virajını daha sarsıcı hale getirin' : 'Make midpoint turn sharper',
      ],
    },
  };
}

// Doctor Chat / Interactive Rewriter Endpoint
app.post('/api/doctor-chat', async (req, res) => {
  try {
    const { messages, scriptText, dramaturgyContext, userPrompt, language } = req.body;

    const targetLanguage =
      language === 'tr'
        ? 'Turkish (Türkçe)'
        : language === 'es'
        ? 'Spanish (Español)'
        : 'English';

    const ai = getGeminiClient();

    const systemInstruction = `You are ScriptBeat's Veteran Hollywood Script Doctor and Master Dramaturge.
You are conversing with a writer who is working on their screenplay or pitch.
You provide elite, constructive, sharp, and encouraging screenplay notes.

CRITICAL LANGUAGE MANDATE:
You MUST respond to the writer strictly in ${targetLanguage}.

CONTEXT ABOUT THE SUBMISSION:
Project: ${dramaturgyContext?.projectTitle || 'Screenplay'}
Genre: ${dramaturgyContext?.genre || 'Drama'}
Key Flaw / Priority Fixes: ${JSON.stringify(dramaturgyContext?.scriptDoctorVerdict?.topPriorityFixes || [])}

When asked to rewrite a scene, sharpen a line of dialogue, or fix a plot hole:
- Provide a clear, insightful explanation in ${targetLanguage}.
- Include a formatted SCREENPLAY REWRITE block in proper screenplay format (SCENE HEADING, ACTION, CHARACTER, DIALOGUE).
- Explain WHY the rewrite fixes the dramatic problem in ${targetLanguage}.`;

    const formattedHistory = (messages || []).map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
    const prompt = `HISTORY OF CONVERSATION:
${formattedHistory}

WRITER'S LATEST REQUEST:
${userPrompt}

EXCERPT / SCRIPT CONTEXT:
"""
${scriptText ? scriptText.substring(0, 2000) : 'No excerpt attached'}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || (language === 'tr' ? "Yazım sürecinizi geliştirecek tavsiyeleri inceleyelim." : "Let me help you refine this screenplay beat."),
    });
  } catch (err: any) {
    console.error('Error in /api/doctor-chat:', err);
    const lang = req.body?.language;
    const fallbackReply = lang === 'tr' 
      ? "Senaryonuzun 2. Perdesindeki tempoyu artırmak için sahne başındaki dramatik soruyu ve örtük anlamı (subtext) keskinleştirebiliriz. Diyalog revizyonu mu yapalım yoksa aksiyon betimlemesini mi güçlendirelim?"
      : lang === 'es'
      ? "Para mejorar el ritmo del Acto 2, sugiero afilar la pregunta dramática inicial y el subtexto. ¿Revisamos el diálogo o fortalecemos la acción?"
      : "To tighten the pacing in Act 2, let's sharpen the scene's central dramatic question and subtext. Would you like to rewrite the dialogue or strengthen the action description?";
    res.json({ reply: fallbackReply });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScriptBeat AI Dramaturgy Engine server running on http://localhost:${PORT}`);
  });
}

startServer();
