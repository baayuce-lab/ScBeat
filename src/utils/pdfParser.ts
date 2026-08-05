import * as pdfjsLib from 'pdfjs-dist';

// Use reliable worker CDN URL
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('Unable to set workerSrc, using fallback parser', e);
}

function sanitizeExtractedText(text: string): string {
  // Filter out lines that look like raw PDF stream metadata (/XObject, /Subtype, /Group, /Filter, /FlateDecode, stream, endstream, obj)
  const lines = text.split('\n');
  const validLines = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    if (
      trimmed.startsWith('/') ||
      trimmed.includes('/XObject') ||
      trimmed.includes('/Subtype') ||
      trimmed.includes('/ProcSet') ||
      trimmed.includes('/FlateDecode') ||
      trimmed.includes('<<') ||
      trimmed.includes('>>') ||
      trimmed.includes('endobj') ||
      trimmed.includes('endstream') ||
      trimmed.includes('/BBox')
    ) {
      return false;
    }
    return true;
  });

  return validLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    try {
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: true 
      });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY: number | null = null;
        let pageText = '';
        
        for (const item of textContent.items as any[]) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n';
          }
          pageText += (item.str || '') + ' ';
          lastY = item.transform[5];
        }
        
        fullText += pageText + '\n\n';
      }
      
      const cleaned = sanitizeExtractedText(fullText);
      if (cleaned.length > 30) {
        return cleaned;
      }
    } catch (pdfErr) {
      console.warn('pdfjsLib primary parse failed, trying binary text stream extraction fallback...', pdfErr);
    }

    // Fallback: direct binary stream regex text extractor for PDF streams
    const bytes = new Uint8Array(await file.arrayBuffer());
    let rawStr = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      rawStr += String.fromCharCode.apply(null, Array.from(chunk));
    }

    const textMatches: string[] = [];
    const tjRegex = /\(([^)]+)\)\s*T[jJ]/g;
    let match;
    while ((match = tjRegex.exec(rawStr)) !== null) {
      const extracted = match[1].trim();
      if (extracted.length > 1 && !extracted.startsWith('/') && !extracted.includes('/XObject')) {
        textMatches.push(extracted);
      }
    }

    if (textMatches.length > 0) {
      const cleanedFallback = sanitizeExtractedText(textMatches.join(' '));
      if (cleanedFallback.length > 30) {
        return cleanedFallback;
      }
    }

    return '';
  } catch (err) {
    console.error('PDF parsing error:', err);
    return '';
  }
}

