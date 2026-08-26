type CodeDetailValueLocale = {
  ja?: string | null,
  en?: string | null,
  cn?: string | null,
  my?: string | null,
}

type CodeDetail = {
  code: string,
  key: string,
  value: string,
  value_locale?: CodeDetailValueLocale | null,
  sort: number,
  levels?: string[],
  classification?: string,
}