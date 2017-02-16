/**
 * Template tag for removes indentation from the beginning of lines for multi-
 * line strings.
 */
function ml(
  strings: TemplateStringsArray, ...values: any[],
) {
  return strings
    .map(str => str.replace(/\n\s*/g, '\n'))
    .reduce((prev, cur) => prev + (values.shift() as string) + cur)
    .trim();
}
