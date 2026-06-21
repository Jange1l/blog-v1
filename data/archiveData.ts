interface ArchiveItem {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const archiveData: ArchiveItem[] = [
  {
    title: '3D Snake Game',
    description: `A fully 3D Snake game built with React Three Fiber and Three.js, with sign-in and a global leaderboard.`,
    imgSrc: '/static/images/snake-game.png',
    href: '/snake-game',
  },
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

export default archiveData
