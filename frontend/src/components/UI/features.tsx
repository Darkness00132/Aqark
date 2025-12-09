"use client";

import { motion } from "framer-motion";
import {
  FiSearch,
  FiHome,
  FiShield,
  FiZap,
  FiMapPin,
  FiMessageCircle,
} from "react-icons/fi";

const features = [
  {
    icon: FiSearch,
    title: "بحث ذكي",
    description:
      "استخدم أدوات البحث المتقدمة للعثور على العقار المناسب لك بسهولة وسرعة",
    color: "primary",
  },
  {
    icon: FiHome,
    title: "عرض سهل",
    description:
      "اعرض عقارك بسهولة ووصل مع العملاء المحتملين مباشرة بدون وسطاء",
    color: "secondary",
  },
  {
    icon: FiShield,
    title: "آمن وموثوق",
    description:
      "جميع بياناتك محمية بالكامل مع نظام إبلاغ متقدم لضمان جودة الإعلانات",
    color: "accent",
  },
  {
    icon: FiZap,
    title: "سريع وفعال",
    description:
      "وفر وقتك مع تجربة مستخدم سلسة وسريعة تمكنك من إيجاد ما تبحث عنه",
    color: "primary",
  },
  {
    icon: FiMapPin,
    title: "تغطية شاملة",
    description: "نغطي جميع المناطق والمدن لنوفر لك أكبر قاعدة بيانات عقارية",
    color: "secondary",
  },
  {
    icon: FiMessageCircle,
    title: "تواصل مباشر",
    description: "تواصل مباشرة مع أصحاب العقارات بدون رسوم إضافية أو عمولات",
    color: "accent",
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary" },
  accent: { bg: "bg-accent/10", text: "text-accent" },
};

export default function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge badge-secondary px-4 py-2 mb-4 font-medium">
            المميزات
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-balance">
            لماذا تختار <span className="gradient-text">عقارك</span>؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نقدم لك أفضل تجربة للبحث عن العقارات أو عرضها مع مميزات فريدة
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="card bg-card border border-border/50 shadow-sm hover:shadow-xl transition-shadow p-8 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-5 mx-auto`}
                >
                  <feature.icon className={`w-8 h-8 ${colors.text}`} />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
