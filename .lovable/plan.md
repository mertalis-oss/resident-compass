## Sorun
`src/pages/Index.tsx` içine yanlışlıkla `index.html` markup'ı (`<!doctype html>...`) yazılmış. TS/SWC bunu TSX olarak parse edemiyor → `TS1434: Unexpected keyword or identifier`.

Kök `index.html` doğru ve sağlam — tek bozuk dosya `Index.tsx`. Git HEAD'te orijinal React component intakt duruyor.

## Düzeltme (tek adım)
`src/pages/Index.tsx` dosyasını git HEAD'teki orijinal içerikle değiştir:

```tsx
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import FocusedNavbar from '@/components/FocusedNavbar';
import TrustBar from '@/components/TrustBar';
import ConciergeButton from '@/components/ConciergeButton';
import PlanBForm from '@/components/PlanBForm';
import Hero from '@/components/home/Hero';
import Philosophy from '@/components/home/Philosophy';
import Portals from '@/components/home/Portals';
import TrustSignals from '@/components/home/TrustSignals';
import CTASection from '@/components/home/CTASection';
import Testimonials from '@/components/home/Testimonials';

export default function Index() {
  // ... ana sayfa render (Hero, Philosophy, Portals, TrustSignals, Testimonials, CTASection, PlanBForm, Footer, ConciergeButton)
}
```

Tam dosya içeriği git HEAD'ten birebir geri yüklenecek. Başka hiçbir dosyaya dokunulmayacak.

## Doğrulama
- Vite dev-server `Index.tsx` hatasını temizleyecek
- `/` route render olacak (Hero + diğer ana sayfa bölümleri)
- `notlar`: i18n.ts içinde `defaultValue` kullanımı eski koddan geliyor; ayrı bir hijyen turu olarak ileride temizlenebilir, ama bu fix scope'una dahil değil.