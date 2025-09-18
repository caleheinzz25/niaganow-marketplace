export const dateFormat = (rawDate: string |undefined) => {
  const parsedDate = rawDate ? new Date(rawDate) : null;
  return parsedDate && !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Tanggal tidak tersedia";
};

export const formatToRupiah = (value: number | undefined): string => {
  if (typeof value !== "number" || isNaN(value)) {
    return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};