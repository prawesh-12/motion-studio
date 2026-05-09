export type PrimitiveField =
  | { kind: "text"; key: string; label: string; placeholder?: string }
  | { kind: "textarea"; key: string; label: string; rows?: number }
  | { kind: "number"; key: string; label: string; min?: number; max?: number }
  | { kind: "color"; key: string; label: string }
  | { kind: "image"; key: string; label: string; placeholder?: string }
  | {
      kind: "select";
      key: string;
      label: string;
      options: { value: string; label: string }[];
    };

export type ShapeField =
  | { kind: "chat"; key: string; label: string }
  | { kind: "composition"; key: string; label: string; exclude?: string[] }
  | {
      kind: "slots";
      key: string;
      label: string;
      layoutKey: string;
      counts: Record<string, number>;
      exclude?: string[];
    };

export type Field = PrimitiveField | ShapeField;

/**
 * brandMode controls whether a composition inherits the project Brand Kit:
 *   - "branded" (default): accent / background / font fall back to the brand
 *     when the per-clip prop is omitted or empty.
 *   - "locked": the composition impersonates a real product (Twitter,
 *     WhatsApp, Slack, Discord, iMessage, etc.) and ignores the brand kit
 *     to keep the look authentic.
 */
export type BrandMode = "branded" | "locked";

export type CompositionInfo<P extends Record<string, unknown>> = {
  id: string;
  title: string;
  description: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps: P;
  fields: Field[];
  brandMode?: BrandMode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCompositionInfo = CompositionInfo<any>;

export type EditorProps<T> = {
  value: T;
  onChange: (next: T) => void;
};
