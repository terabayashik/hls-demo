export const appendTimeStamp = (text: string) => {
  return `${new Date().toLocaleString("ja-JP").padStart(19, " ")} | ${text}`;
};

const SizeUnit = {
  Byte: "B",
  KiloByte: "kB",
  MegaByte: "MB",
  GigaByte: "GB",
} as const;
type SizeUnit = typeof SizeUnit[keyof typeof SizeUnit];

interface FormattedSize {
  size: number;
  sizeInBytes: number;
  sizeStr: string;
  sizeStrInBytes: string;
  unit: SizeUnit;
}

export const formatByteValue = (sizeInBytes: number): FormattedSize => {
  const [scaledSize, unit] =
    sizeInBytes < 1024
      ? [sizeInBytes, SizeUnit.Byte]
      : sizeInBytes < 1024 ** 2
      ? [Math.round((sizeInBytes / 1024) * 10) / 10, SizeUnit.KiloByte]
      : sizeInBytes < 1024 ** 3
      ? [Math.round((sizeInBytes / 1024 ** 2) * 10) / 10, SizeUnit.MegaByte]
      : [Math.round((sizeInBytes / 1024 ** 3) * 10) / 10, SizeUnit.GigaByte];
  return {
    size: scaledSize,
    sizeInBytes: sizeInBytes,
    sizeStr: `${scaledSize} ${unit}`,
    sizeStrInBytes: `${sizeInBytes} ${SizeUnit.Byte}`,
    unit: unit,
  };
};
