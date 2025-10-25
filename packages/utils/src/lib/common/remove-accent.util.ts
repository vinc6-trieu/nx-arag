export function removeAccents(str: string): string {
  return str
    .normalize('NFD') // decompose combined letters into letter + accent
    .replace(/[\u0300-\u036f]/g, '') // remove all accent marks
    .replace(/đ/g, 'd') // handle Vietnamese đ
    .replace(/Đ/g, 'D');
}
