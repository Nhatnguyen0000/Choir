/**
 * Merge class names. Zero external deps so it always resolves.
 * Use with Tailwind; later class overrides earlier when same utility applies.
 */
export type ClassValue = string | number | boolean | undefined | null | ClassValue[] | { [k: string]: boolean | undefined | null };

function flatten(inputs: ClassValue[]): string[] {
  const out: string[] = [];
  for (const x of inputs) {
    if (x == null) continue;
    if (typeof x === 'string') out.push(x);
    else if (typeof x === 'number' && !Number.isNaN(x)) out.push(String(x));
    else if (typeof x === 'boolean') continue;
    else if (Array.isArray(x)) out.push(...flatten(x));
    else if (typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) if (v) out.push(k);
    }
  }
  return out;
}

export function cn(...inputs: ClassValue[]): string {
  return flatten(inputs).filter(Boolean).join(' ');
}
