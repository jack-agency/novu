import { IS_SELF_HOSTED } from '../../../config';

export const createTranslationMarks = (newValue: string | undefined, variables: any) => {
  if (IS_SELF_HOSTED) {
    return [];
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require('@novu/ee-translation-web');

    return module.createTranslationMarks(newValue, variables);
  } catch (e) {
    /* empty */
  }

  return [];
};
