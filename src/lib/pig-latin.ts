// Pig Latin translation rules
const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']

export function toPigLatin(text: string): string {
  return text.split(/(\s+|[.,!?;:'"()-])/).map(word => {
    // Skip whitespace and punctuation
    if (!word.match(/[a-zA-Z]/)) return word
    
    const isCapitalized = word[0] === word[0].toUpperCase()
    const lowerWord = word.toLowerCase()
    
    let result: string
    
    // Rule 1: Words starting with vowels - add "yay"
    if (vowels.includes(lowerWord[0])) {
      result = lowerWord + 'yay'
    }
    // Rule 2: Words starting with consonants - move consonant cluster to end + "ay"
    else {
      let consonantCluster = ''
      let i = 0
      
      // Special handling for 'qu'
      while (i < lowerWord.length && !vowels.slice(0, 5).includes(lowerWord[i])) {
        consonantCluster += lowerWord[i]
        i++
        // Handle 'qu' as a unit
        if (consonantCluster.endsWith('q') && lowerWord[i] === 'u') {
          consonantCluster += 'u'
          i++
        }
      }
      
      // If entire word is consonants, just add "ay"
      if (i === lowerWord.length) {
        result = lowerWord + 'ay'
      } else {
        result = lowerWord.slice(i) + consonantCluster + 'ay'
      }
    }
    
    // Restore capitalization
    if (isCapitalized) {
      result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
    }
    
    return result
  }).join('')
}

export function fromPigLatin(text: string): string {
  return text.split(/(\s+|[.,!?;:'"()-])/).map(word => {
    if (!word.match(/[a-zA-Z]/)) return word
    
    const isCapitalized = word[0] === word[0].toUpperCase()
    const lowerWord = word.toLowerCase()
    
    let result: string
    
    // Check for "yay" ending (vowel words)
    if (lowerWord.endsWith('yay')) {
      result = lowerWord.slice(0, -3)
    }
    // Check for "ay" ending
    else if (lowerWord.endsWith('ay')) {
      const withoutAy = lowerWord.slice(0, -2)
      const vowelList = ['a', 'e', 'i', 'o', 'u']
      
      // Try to find consonant cluster at end
      let i = withoutAy.length - 1
      while (i >= 0 && !vowelList.includes(withoutAy[i])) {
        i--
      }
      
      if (i >= 0) {
        const consonants = withoutAy.slice(i + 1)
        const rest = withoutAy.slice(0, i + 1)
        result = consonants + rest
      } else {
        result = withoutAy
      }
    } else {
      result = lowerWord
    }
    
    if (isCapitalized) {
      result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
    }
    
    return result
  }).join('')
}

// Example translations for dictionary view
export function getExamples(): Array<{ english: string; pigLatin: string }> {
  const examples = [
    'hello', 'world', 'pig', 'latin', 'translator', 'apple', 'banana',
    'computer', 'string', 'question', 'school', 'friend', 'happy',
    'smile', 'love', 'beautiful', 'programming', 'awesome', 'rhythm'
  ]
  
  return examples.map(word => ({
    english: word,
    pigLatin: toPigLatin(word)
  }))
}
