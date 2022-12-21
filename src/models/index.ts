import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// The PrismaClient is a higher-level API that provides a simple, powerful interface for interacting with the database.
// It exposes methods for performing CRUD operations on the types defined in the schema, as well as for executing raw SQL queries.
// The PrismaClient is designed to be easy to use and require minimal setup, making it a convenient choice for interacting with the database in your application.
// const prisma = new PrismaClient()

// async function main() {
//   // You can use the `.source` method on the PrismaClient to perform CRUD operations on the Source type.
//   // For example, the following code creates a new Source:
//   const newSource = await prisma.source.create({
//     data: {
//       sourceName: 'CNN',
//     },
//   })
//   console.log(newSource)

//   // You can also use the `.channel` method to perform CRUD operations on the Channel type, and the `.article` method to perform CRUD operations on the Article type.
//   // For example, the following code creates a new Channel and a new Article:
//   const newChannel = await prisma.channel.create({
//     data: {
//       channelName: 'CNN News',
//     },
//   })
//   console.log(newChannel)

//   const newArticle = await prisma.article.create({
//     data: {
//       articleTitle: 'Breaking news: major event occurs',
//       articleUrl: 'https://cnn.com/breaking-news',
//       published: new Date(),
//       contentLength: 1000,
//       source: {
//         connect: {
//           id: newSource.id,
//         },
//       },
//       channel: {
//         connect: {
//           id: newChannel.id,
//         },
//       },
//     },
//   })
//   console.log(newArticle)

//   // The PrismaClient also provides methods for querying the database.
//   // For example, the following code retrieves all articles from a specific source:
//   const articlesFromSource = await prisma.article.findMany({
//     where: {
//       source: {
//         sourceName: 'CNN',
//       },
//     },
//   })
//   console.log(articlesFromSource)

//   // You can also use the `.executeRaw` method to execute raw SQL queries if needed.
//   const rawSqlResult = await prisma.executeRaw`SELECT * FROM Article WHERE contentLength > 1000`
//   console.log(rawSqlResult)

//   // Don't forget to close the database connection when you're finished!
//   await prisma.disconnect()
// }

// main().catch(e => console.error(e))

export default db