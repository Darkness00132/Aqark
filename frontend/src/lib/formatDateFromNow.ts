import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";

dayjs.extend(relativeTime);
dayjs.locale("ar");

export default function formatDateFromNow(dateString: string): string {
  if (!dateString) return "غير معروف";
  const date = dayjs(dateString);
  return date.isValid() ? date.fromNow() : "غير صالح";
}
