"use client";
import { createContext, useContext } from "react";

export type BrandKit = {
  primary: string;
  accent: string;
  background: string;
  text: string;
  mutedText: string;
  fontFamily: string;
  headlineFontFamily?: string;
  logoUrl?: string;
};

export const DEFAULT_BRAND: BrandKit = {
  primary: "#0f1014",
  accent: "#6366f1",
  background: "#f7f7f9",
  text: "#0f1014",
  mutedText: "rgba(15,16,20,0.55)",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
};

const BrandContext = createContext<BrandKit>(DEFAULT_BRAND);

export function BrandProvider({
  value,
  children,
}: {
  value?: BrandKit;
  children: React.ReactNode;
}) {
  return (
    <BrandContext.Provider value={value ?? DEFAULT_BRAND}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandKit {
  return useContext(BrandContext);
}

export function brandCssVars(brand: BrandKit): React.CSSProperties {
  return {
    ["--brand-primary" as string]: brand.primary,
    ["--brand-accent" as string]: brand.accent,
    ["--brand-background" as string]: brand.background,
    ["--brand-text" as string]: brand.text,
    ["--brand-muted-text" as string]: brand.mutedText,
    ["--brand-font" as string]: brand.fontFamily,
    ["--brand-headline-font" as string]:
      brand.headlineFontFamily ?? brand.fontFamily,
  };
}

export function pickBrand<T extends string | undefined | null>(
  override: T,
  fallback: string,
): string {
  if (override === undefined || override === null) return fallback;
  if (typeof override === "string" && override.trim() === "") return fallback;
  return override;
}
