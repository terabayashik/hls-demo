export const appendTimeStamp = (text: string) => {
  return `${new Date().toLocaleString("ja-JP").padStart(19, " ")} | ${text}`;
};
