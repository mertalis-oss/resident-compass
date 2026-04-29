// src/components/TrustBar.tsx
import { Shield, Globe, UserCheck } from "lucide-react";
import { useDomainScope } from "@/hooks/useDomainScope";

const EN_ITEMS = [
  { icon: Shield, label: "15+ Years International Experience", mobile: true },
  { icon: Globe, label: "Multi-Country Execution", mobile: false },
  { icon: UserCheck, label: "Private Advisory Model", mobile: true },
];

const TR_ITEMS = [
  { icon: Shield, label: "15+ Yıl Uluslararası Deneyim", mobile: true },
  { icon: Globe, label: "Çok Ülkeli Operasyon", mobile: false },
  { icon: UserCheck, label: "Özel Danışmanlık Modeli", mobile: true },
];

export default function TrustBar() {
  const scope = useDomainScope();
  const items = scope === "tr" ? TR_ITEMS : EN_ITEMS;

  return (
    <div className="w-full bg-primary/5 border-b border-border/30">
      <div className="container flex items-center justify-center gap-6 md:gap-10 h-10 text-xs tracking-[0.1em] text-muted-foreground">
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-1.5${item.mobile ? "" : " hidden sm:flex"}`}>
            <item.icon className="h-3 w-3 text-primary" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
