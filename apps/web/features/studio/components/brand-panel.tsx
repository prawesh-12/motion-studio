"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { BrandKit } from "@workspace/compositions/brand";
import { DEFAULT_BRAND } from "@workspace/compositions/brand";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

type Props = {
  brand: BrandKit | undefined;
  onPatch: (patch: Partial<BrandKit>) => void;
  onReset: () => void;
  onClose: () => void;
};

const FONT_PRESETS: { label: string; value: string }[] = [
  {
    label: "System default",
    value:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
  },
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Geist", value: "Geist, system-ui, sans-serif" },
  { label: "Roboto", value: "Roboto, system-ui, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Georgia (serif)", value: "Georgia, 'Times New Roman', serif" },
];

export function BrandPanel({ brand, onPatch, onReset, onClose }: Props) {
  const value = brand ?? DEFAULT_BRAND;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Brand kit</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Applied to every branded clip in the project.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close panel"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
        </Button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        <Section title="Colors">
          <ColorRow
            id="brand-primary"
            label="Primary"
            value={value.primary}
            onChange={(v) => onPatch({ primary: v })}
          />
          <ColorRow
            id="brand-accent"
            label="Accent"
            value={value.accent}
            onChange={(v) => onPatch({ accent: v })}
          />
          <ColorRow
            id="brand-background"
            label="Background"
            value={value.background}
            onChange={(v) => onPatch({ background: v })}
          />
          <ColorRow
            id="brand-text"
            label="Text"
            value={value.text}
            onChange={(v) => onPatch({ text: v })}
          />
        </Section>

        <Section title="Typography">
          <FontField
            id="brand-font"
            label="Body font"
            value={value.fontFamily}
            onChange={(v) => onPatch({ fontFamily: v })}
          />
          <FontField
            id="brand-headline-font"
            label="Headline font (optional)"
            value={value.headlineFontFamily ?? ""}
            onChange={(v) =>
              onPatch({ headlineFontFamily: v.trim() === "" ? undefined : v })
            }
          />
        </Section>

        <Section title="Logo">
          <div className="space-y-1.5">
            <Label htmlFor="brand-logo" className="text-[12px]">
              Logo URL
            </Label>
            <Input
              id="brand-logo"
              value={value.logoUrl ?? ""}
              placeholder="https://example.com/logo.png"
              onChange={(e) =>
                onPatch({
                  logoUrl:
                    e.target.value.trim() === "" ? undefined : e.target.value,
                })
              }
            />
          </div>
        </Section>

        <Section title="Locked compositions">
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Compositions that impersonate real apps (Twitter, WhatsApp, Slack,
            Discord, iMessage) ignore the brand kit so their look stays
            authentic.
          </p>
        </Section>
      </div>

      <footer className="shrink-0 border-t border-border px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onReset}
        >
          Reset to defaults
        </Button>
      </footer>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ColorRow({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const looksHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
  const swatchValue = looksHex ? value : "#ffffff";

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[12px]">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <label
          className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-full border border-border transition-shadow hover:ring-2 hover:ring-ring/40"
          style={{ background: swatchValue }}
          title="Pick color"
        >
          <input
            type="color"
            aria-label={`${label} color`}
            value={swatchValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function FontField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[12px]">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="font-family value"
      />
      <div className="flex flex-wrap gap-1.5 pt-1">
        {FONT_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(preset.value)}
            className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
