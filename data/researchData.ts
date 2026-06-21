interface ResearchItem {
  title: string
  description: string
  href: string
  imgSrc?: string
  meta?: string
}

const researchData: ResearchItem[] = [
  {
    title: 'Prompts as Lossy Compression',
    description: `A controlled empirical study treating a natural-language prompt as a compressed representation of software and an LLM agent as the decompressor — measuring the trade-off between prompt size and reconstruction fidelity across projects of increasing novelty.`,
    href: '/static/research/prompts-as-lossy-compression.html',
    imgSrc: '/static/images/research/prompts-as-lossy-compression.png',
    meta: 'Empirical study · 2026',
  },
]

export default researchData
