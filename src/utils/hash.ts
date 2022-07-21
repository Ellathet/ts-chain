import { BinaryLike, createHash } from 'crypto';
import { Block } from '../blockchain';

export const hashPayload = (
  payload : Block['payload'],
) => createHash('sha256').update(JSON.stringify(payload)).digest('hex');

export const hash = (
  value : BinaryLike,
) => createHash('sha256').update(value).digest('hex');

export const validatedHash = (
  {
    hashToValidate,
    difficulty = 4,
    prefix = '0',
  } : {
    hashToValidate: string,
    difficulty: number,
    prefix: string
  },
) => {
  const check = prefix.repeat(difficulty);
  return hashToValidate.startsWith(check);
};
