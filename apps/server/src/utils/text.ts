export interface TextStats {
  chars: number;
  words: number;
  sentences: number;
  paragraphs: number;
}

export interface EngagementSuggestions {
  suggestions: string[];
  warnings: string[];
}

export function analyzeText(text: string): TextStats {
  const chars = text.length;
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
  
  return { chars, words, sentences, paragraphs };
}

export function generateEngagementSuggestions(text: string, stats: TextStats): EngagementSuggestions {
  const suggestions: string[] = [];
  const warnings: string[] = [];
  
  // Length checks
  if (stats.chars < 80) {
    warnings.push('Content is very short (< 80 characters). Consider adding more detail for better engagement.');
  } else if (stats.words > 300) {
    warnings.push('Content is quite long (> 300 words). Consider breaking it into shorter posts for better readability.');
  }
  
  // Hashtag analysis
  const hashtagMatches = text.match(/#\w+/g);
  const hashtagCount = hashtagMatches ? hashtagMatches.length : 0;
  
  if (hashtagCount === 0) {
    suggestions.push('Add 1-3 relevant hashtags to increase discoverability.');
  } else if (hashtagCount > 9) {
    warnings.push('Too many hashtags (> 9). Stick to 1-3 for Twitter/X or 5-9 for Instagram.');
  } else if (hashtagCount >= 1 && hashtagCount <= 3) {
    suggestions.push('Good hashtag usage! This range works well for most platforms.');
  }
  
  // CTA detection
  const ctaKeywords = ['comment', 'share', 'follow', 'like', 'subscribe', 'click', 'visit', 'check out', 'learn more'];
  const hasCTA = ctaKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasCTA) {
    suggestions.push('Add a call-to-action (e.g., "Comment below", "Share if helpful") to encourage engagement.');
  }
  
  // Readability check
  const avgWordsPerSentence = stats.words / Math.max(stats.sentences, 1);
  if (avgWordsPerSentence > 25) {
    suggestions.push('Consider breaking up long sentences for better readability.');
  }
  
  // Formatting checks
  if (text === text.toUpperCase() && text.length > 10) {
    warnings.push('Avoid writing entirely in CAPS as it can appear aggressive.');
  }
  
  const longLines = text.split('\n').filter(line => line.length > 80);
  if (longLines.length > 0) {
    suggestions.push('Consider adding line breaks for better readability on mobile devices.');
  }
  
  // Positive reinforcement
  if (stats.words >= 80 && stats.words <= 200 && hashtagCount >= 1 && hashtagCount <= 5) {
    suggestions.push('Great content length and hashtag usage! This should perform well on most platforms.');
  }
  
  return { suggestions, warnings };
}

export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
    .trim();
}

export function preserveFormatting(text: string): string {
  // Preserve paragraph breaks and basic structure
  return text
    .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
    .replace(/^\s+|\s+$/gm, '') // Trim whitespace from each line
    .trim();
}
