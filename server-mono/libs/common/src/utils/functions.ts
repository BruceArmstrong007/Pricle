import { validate } from 'class-validator';

export async function RequestValidator(
  condition: any,
  data: any,
): Promise<string | null> {
  const validator = new condition(data);
  const errors = await validate(validator, {
    validationError: { target: false, value: false },
    whitelist: true,
  });
  if (errors?.length > 0) return Object.values(errors[0].constraints)[0];
  return null;
}
