export function encodeURLParam(param: string) {
  return param.replaceAll(".", "~");
}

export function decodeURLParam(param: string) {
  return param.replaceAll("~", ".");
}
