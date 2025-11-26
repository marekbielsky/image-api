import {
  isNumber,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AspectRatio<T extends object>(
  widthProperty: keyof T,
  options?: { min?: number; max?: number } & ValidationOptions,
) {
  const { min = 0.25, max = 4, ...validationOptions } = options || {};

  return function (object: T, propertyName: keyof T) {
    registerDecorator({
      name: 'AspectRatio',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [widthProperty, min, max],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [widthProp, minRatio, maxRatio] = args.constraints as [keyof T, number, number];

          const obj = args.object as T;

          const width = obj[widthProp];
          const height = value;

          if (!isNumber(width) || !isNumber(height)) {
            return true;
          }

          const ratio = width / height;
          return ratio >= minRatio && ratio <= maxRatio;
        },
        defaultMessage(args: ValidationArguments): string {
          const [widthProp, minRatio, maxRatio] = args.constraints as [keyof T, number, number];
          return `Aspect ratio (${String(
            widthProp,
          )}/${String(args.property)}) must be between ${minRatio} and ${maxRatio}`;
        },
      },
    });
  };
}
