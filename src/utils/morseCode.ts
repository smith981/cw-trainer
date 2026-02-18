import type { MorseElement } from '../types';

export const CHAR_TO_MORSE: Record<string, string> = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',
  'E': '.',     'F': '..-.',  'G': '--.',   'H': '....',
  'I': '..',    'J': '.---',  'K': '-.-',   'L': '.-..',
  'M': '--',    'N': '-.',    'O': '---',   'P': '.--.',
  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',
  'Y': '-.--',  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
};

export const MORSE_TO_CHAR: Record<string, string> = Object.fromEntries(
  Object.entries(CHAR_TO_MORSE).map(([char, morse]) => [morse, char])
);

export function decodeMorseElements(elements: MorseElement[]): string | null {
  if (elements.length === 0) return null;
  const morseStr = elements.map(e => e === 'dit' ? '.' : '-').join('');
  return MORSE_TO_CHAR[morseStr] ?? null;
}

export function getMorseForChar(char: string): string | null {
  return CHAR_TO_MORSE[char.toUpperCase()] ?? null;
}
