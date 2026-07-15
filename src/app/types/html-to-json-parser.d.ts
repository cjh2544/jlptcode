declare module "html-to-json-parser" {
  export function HTMLToJSON(html: string, stringify?: boolean): Promise<string | unknown>;
}
