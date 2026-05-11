/** Luxary Realtor™ */
import { Market } from '@/types/models';
export const markets: Market[] = [
  { code:'ES', country:'Spain', currency:'EUR', defaultLanguage:'es', languages:['es','en','ar','fr'] },
  { code:'AE', country:'UAE', currency:'AED', defaultLanguage:'ar', languages:['ar','en','hi','ru'] },
  { code:'MC', country:'Monaco', currency:'EUR', defaultLanguage:'fr', languages:['fr','en','it','ar'] },
  { code:'US', country:'USA', currency:'USD', defaultLanguage:'en', languages:['en','es','zh','ar'] },
  { code:'GB', country:'United Kingdom', currency:'GBP', defaultLanguage:'en', languages:['en','ar','zh','fr'] },
  { code:'MA', country:'Morocco', currency:'MAD', defaultLanguage:'ar', languages:['ar','fr','en','es'] },
  { code:'QA', country:'Qatar', currency:'QAR', defaultLanguage:'ar', languages:['ar','en','hi','ur'] },
  { code:'SA', country:'Saudi Arabia', currency:'SAR', defaultLanguage:'ar', languages:['ar','en','ur','hi'] },
  { code:'SG', country:'Singapore', currency:'SGD', defaultLanguage:'en', languages:['en','zh','ms','ta'] }
];
