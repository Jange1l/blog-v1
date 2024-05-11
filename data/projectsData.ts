interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'NFT Builder',
    description: `Build large collections of NFT's with a small input of different layers`,
    imgSrc: '/static/images/time-machine.jpg',
    href: 'https://www.nftbldr.com/',
  },
  {
    title: 'Debriefs Search Engine',
    description: `Use the power of semantic search to find the latest news articles and news letters on the topics you want!`,
    imgSrc: '/static/images/searc-debriefs.png',
    href: 'https://search.debriefs.ai/',
  },
]

export default projectsData
