import { notFound } from "next/navigation"
import { getDoc } from "@/lib/docs"
import { DocsShell } from "@/components/docs/docs-shell"

export default function DocsIntroductionPage() {
  const doc = getDoc("introduction")
  if (!doc) notFound()
  return <DocsShell doc={doc} />
}
