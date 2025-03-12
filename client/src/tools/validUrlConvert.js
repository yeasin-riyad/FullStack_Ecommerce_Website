export const validUrlConvert = (name) => {
  const url = name
    .replaceAll(" ", "-")
    .replaceAll("/", "")
    .replaceAll(",", "-")
    .replaceAll("&", "-");
    return url;
};
