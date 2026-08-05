// رقم الواتساب الرسمي — عدّله من هنا فقط
export const WHATSAPP_NUMBER = "966500000000";

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
