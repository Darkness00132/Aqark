import { ReactNode } from "react";

export default function StatusCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="card shadow-md border border-base-300 bg-base-100 rounded-2xl">
      <div className="card-body flex flex-row items-center justify-between">
        <div className={`text-3xl`}>{icon}</div>
        <div className="text-right">
          <h2 className="font-bold text-base sm:text-lg">{title}</h2>
          <p className="text-2xl sm:text-3xl font-extrabold">{value}</p>
        </div>
      </div>
    </div>
  );
}
