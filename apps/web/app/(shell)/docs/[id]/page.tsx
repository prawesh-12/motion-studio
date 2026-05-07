import { notFound } from "next/navigation"
import { compositions } from "@workspace/compositions/registry"
import { getDoc } from "@/lib/docs"
import { DocsShell } from "@/components/docs/docs-shell"

export function generateStaticParams() {
  return compositions.map((c) => ({ id: c.id }))
}

export default async function ComponentDocsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const doc = getDoc(id)
  if (!doc) notFound()
  return <DocsShell doc={doc} />
}
