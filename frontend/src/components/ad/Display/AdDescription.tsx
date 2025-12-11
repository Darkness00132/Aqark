export default function AdDescription({
  description,
}: {
  description: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        <h2 className="text-2xl font-bold text-gray-900">وصف العقار</h2>
      </div>
      <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
