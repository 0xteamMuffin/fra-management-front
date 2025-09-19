"use client";

import { useTranslation } from "@/app/i18n/client";
import { languages } from "@/app/i18n/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLng: string) => {
    const newPath = pathname.replace(`/${lng}`, `/${newLng}`);
    router.push(newPath);
  };

  return (
    <Select value={lng} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("selectLanguage")} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {t(lang)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 