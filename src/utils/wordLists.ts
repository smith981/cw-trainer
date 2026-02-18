import type { Difficulty } from '../types';
import { DIFFICULTY_CONFIGS } from './config';

const WORDS_BY_LENGTH: Record<number, string[]> = {
  3: [
    'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER',
    'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'HAD', 'HAS', 'HIS', 'HOW', 'ITS',
    'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'WAY', 'WHO', 'BOY', 'DID', 'GET',
    'LET', 'SAY', 'SHE', 'TOO', 'USE', 'CAT', 'DOG', 'RUN', 'SIT', 'TOP',
  ],
  4: [
    'THAT', 'WITH', 'HAVE', 'THIS', 'WILL', 'YOUR', 'FROM', 'THEY', 'BEEN',
    'CALL', 'COME', 'EACH', 'FIND', 'GIVE', 'GOOD', 'HAND', 'HIGH', 'KEEP',
    'LAST', 'LONG', 'MAKE', 'MANY', 'MOST', 'NAME', 'OVER', 'PART', 'PLAY',
    'PULL', 'PUSH', 'READ', 'SAID', 'SAME', 'SOME', 'TAKE', 'TELL', 'THAN',
    'THEM', 'THEN', 'TURN', 'WALK', 'WANT', 'WORD', 'WORK', 'YEAR', 'HELP',
  ],
  5: [
    'ABOUT', 'AFTER', 'AGAIN', 'BEING', 'BELOW', 'COULD', 'EVERY', 'FIRST',
    'FOUND', 'GREAT', 'HOUSE', 'LARGE', 'LEARN', 'LIGHT', 'MIGHT', 'NEVER',
    'OTHER', 'PLACE', 'PLANT', 'POINT', 'RIGHT', 'SMALL', 'SOUND', 'SPELL',
    'STILL', 'STUDY', 'THEIR', 'THERE', 'THESE', 'THING', 'THINK', 'THREE',
    'UNDER', 'WATER', 'WHERE', 'WHICH', 'WORLD', 'WOULD', 'WRITE', 'YOUNG',
  ],
  6: [
    'BEFORE', 'CHANGE', 'FOLLOW', 'LETTER', 'MOTHER', 'NUMBER', 'PEOPLE',
    'PLEASE', 'SCHOOL', 'SHOULD', 'SIMPLE', 'SOCIAL', 'SYSTEM', 'TRAVEL',
    'TWENTY', 'GROUND', 'ANSWER', 'FAMILY', 'FRIEND', 'HAPPEN', 'IMPORT',
    'ISLAND', 'LISTEN', 'MARKET', 'MINUTE', 'MODERN', 'NATION', 'NOTICE',
    'OBJECT', 'ORANGE', 'PERIOD', 'REASON', 'RECORD', 'REMAIN', 'REPORT',
    'RETURN', 'SEASON', 'SECOND', 'SIGNAL', 'SINGLE', 'SQUARE', 'STREET',
  ],
  7: [
    'AGAINST', 'ALREADY', 'ANOTHER', 'BECAUSE', 'BETWEEN', 'BROUGHT',
    'CERTAIN', 'CHAPTER', 'COMPANY', 'COUNTRY', 'CURRENT', 'DEVELOP',
    'DOLPHIN', 'ENGLISH', 'EXAMPLE', 'GENERAL', 'HISTORY', 'HIMSELF',
    'HOWEVER', 'IMAGINE', 'INCLUDE', 'KITCHEN', 'MACHINE', 'MILLION',
    'MORNING', 'NOTHING', 'PATTERN', 'PICTURE', 'PRESENT', 'PROBLEM',
    'PRODUCE', 'PROGRAM', 'PROJECT', 'PROVIDE', 'QUARTER', 'READING',
    'SCIENCE', 'SECTION', 'SEVERAL', 'SOCIETY', 'STUDENT', 'SUBJECT',
  ],
  8: [
    'ALTHOUGH', 'AMERICAN', 'ANYTHING', 'BACKWARD', 'BUILDING', 'BUSINESS',
    'CHILDREN', 'COMPLETE', 'CONSIDER', 'CONTINUE', 'CRITICAL', 'DECEMBER',
    'DESCRIBE', 'DISCOVER', 'ECONOMIC', 'ELECTION', 'EVERYONE', 'EXERCISE',
    'EXPECTED', 'FEBRUARY', 'FOOTBALL', 'FUNCTION', 'GENERATE', 'HOSPITAL',
    'IDENTIFY', 'INDUSTRY', 'INTEREST', 'LANGUAGE', 'MAGAZINE', 'MATERIAL',
    'MOUNTAIN', 'NATIONAL', 'PLATFORM', 'POLITICS', 'POSITION', 'POSSIBLE',
    'PRACTICE', 'PRESSURE', 'PROBABLY', 'PROGRESS', 'PROPERTY', 'PROVINCE',
  ],
  9: [
    'ADVENTURE', 'AFTERNOON', 'ATTENTION', 'BEAUTIFUL', 'CHARACTER',
    'CHOCOLATE', 'COMMUNITY', 'CONDITION', 'CONFIDENT', 'COUNTRIES',
    'DANGEROUS', 'DETERMINE', 'DIFFERENT', 'DIFFICULT', 'DIRECTION',
    'EDUCATION', 'EFFECTIVE', 'ESTABLISH', 'EXCELLENT', 'EXECUTIVE',
    'EXPENSIVE', 'FOLLOWING', 'FURNITURE', 'GENERALLY', 'GUARANTEE',
    'HAPPENING', 'IMPORTANT', 'INCLUDING', 'INTRODUCE', 'KNOWLEDGE',
    'OTHERWISE', 'POLITICAL', 'PRESIDENT', 'PRINCIPLE', 'QUESTIONS',
    'RECOGNIZE', 'REPRESENT', 'SECRETARY', 'SELECTION', 'SITUATION',
  ],
  10: [
    'ABSOLUTELY', 'BACKGROUND', 'BASKETBALL', 'COLLECTION', 'COMMISSION',
    'COMMERCIAL', 'DEPARTMENT', 'EVERYTHING', 'EXPERIENCE', 'GENERATION',
    'GOVERNMENT', 'IMPOSSIBLE', 'INDIVIDUAL', 'INVESTMENT', 'LEADERSHIP',
    'MANAGEMENT', 'PARTICULAR', 'PERCENTAGE', 'PHILOSOPHY', 'POPULATION',
    'PROFESSION', 'PROTECTION', 'RESTAURANT', 'REVOLUTION', 'SUGGESTION',
    'TECHNOLOGY', 'TELEVISION', 'THEMSELVES', 'UNDERSTAND', 'NEWSPAPERS',
  ],
  11: [
    'ANNIVERSARY', 'APPLICATION', 'COMFORTABLE', 'COMMUNICATE',
    'COMPETITION', 'COMPLICATED', 'DEVELOPMENT', 'ENVIRONMENT',
    'ESTABLISHED', 'FURTHERMORE', 'IMMEDIATELY', 'INDEPENDENT',
    'INFORMATION', 'INSTRUCTION', 'INTERESTING', 'MATHEMATICS',
    'OPPORTUNITY', 'PERFORMANCE', 'PERSONALITY', 'PHOTOGRAPHY',
    'SIGNIFICANT', 'TEMPERATURE', 'TRADITIONAL', 'UNDERGROUND',
  ],
  12: [
    'ACCIDENTALLY', 'ACCOMPLISHED', 'ACHIEVEMENTS', 'ACKNOWLEDGED',
    'APPRECIATION', 'ARCHITECTURE', 'CHAMPIONSHIP', 'CIRCUMSTANCE',
    'CONSERVATION', 'CONSIDERABLE', 'CONSTRUCTION', 'CONTRIBUTION',
    'CONVERSATION', 'DISAPPOINTED', 'ENCYCLOPEDIA', 'ENTERTAINMENT',
    'EXPERIMENTAL', 'INDEPENDENCE', 'INTRODUCTION', 'INTELLIGENCE',
    'KINDERGARTEN', 'NEIGHBORHOOD', 'PROFESSIONAL', 'RELATIONSHIP',
    'SIGNIFICANCE', 'TRANSMISSION', 'UNIVERSITIES',
  ],
};

function totalAvailable(lengths: number[]): number {
  return lengths.reduce((sum, len) => sum + (WORDS_BY_LENGTH[len]?.length ?? 0), 0);
}

export function selectWords(difficulty: Difficulty, count: number): string[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const validLengths: number[] = [];
  for (let len = config.minLength; len <= config.maxLength; len++) {
    if (WORDS_BY_LENGTH[len]) {
      validLengths.push(len);
    }
  }

  const result: string[] = [];
  const used = new Set<string>();
  const maxAvailable = totalAvailable(validLengths);

  while (result.length < count && used.size < maxAvailable) {
    const length = validLengths[Math.floor(Math.random() * validLengths.length)];
    const pool = WORDS_BY_LENGTH[length];
    const word = pool[Math.floor(Math.random() * pool.length)];
    if (!used.has(word)) {
      used.add(word);
      result.push(word);
    }
  }

  return result;
}
