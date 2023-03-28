export function encodeURLParam(param: string) {
  console.log(param);
  return param.replaceAll(".", "~");
}

export function decodeURLParam(param: string) {
  return param.replaceAll("~", ".");
}
