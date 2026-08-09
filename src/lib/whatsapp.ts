// رقم الواتساب الرسمي — عدّله من هنا فقط
export const WHATSAPP_NUMBER = "966556006142";
export const PHONE_LOCAL = "0556006142";
export const CONTACT_EMAIL = "openloop2030@gmail.com";

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
