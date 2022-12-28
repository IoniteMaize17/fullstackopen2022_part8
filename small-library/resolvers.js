const BookModel = require('./models/book')
const AuthorModel = require('./models/author')
const UserModel = require('./models/user')
const { GraphQLError } = require('graphql')
const { ApolloServerErrorCode } = require('@apollo/server/errors')
const jwt = require('jsonwebtoken')
const config = require('./config')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Author: {
    name: (root) => root.name,
    id: (root) => root.id,
    born: (root) => root.born ? root.born : null,
    bookCount: (root) => root.books.length
  },
  Query: {
    bookCount: () => BookModel.collection.countDocuments(),
    authorCount: () => AuthorModel.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = AuthorModel.find({name: args.author}).populate('author')
        return await BookModel.find({author: author}).populate('author')
      }
      if (args.genre) {
        return await BookModel.find({genres: args.genre}).populate('author')
      }
      return BookModel.find({}).populate('author');
    },
    allAuthors: async () => {
      return await AuthorModel.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    allGenres: async () => {
      const books = await BookModel.find({});
      const lstButton = []
      books.forEach(book => {
        book.genres.forEach((genre) => {
          if (!lstButton.includes(genre)) lstButton.push(genre)
        })
      });
      return lstButton
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      try {
        let authorFind = await AuthorModel.findOne({name: args.author})
        if (!authorFind) {
          authorFind = new AuthorModel({
            name: args.author,
            books: []
          });
          await authorFind.save();
        }
        const bookNew = new BookModel({
          ...args,
          author: authorFind._id
        });
        await bookNew.save();
        authorFind.books = authorFind.books.concat(bookNew._id)
        await authorFind.save();
        const detailBookNew = await bookNew.populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: detailBookNew })
        return detailBookNew;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, args }
        });
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const authorFind = await AuthorModel.findOne({name: args.name})
      if (authorFind) {
        authorFind.born = args.setBornTo
        try {
          await authorFind.save();
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, args }
          });
        }
        return authorFind;
      }
      return null
    },
    createUser: async (root, args) => {
      const user = new UserModel({
        username: args.username,
        favouriteGenre: args.favouriteGenre
      });
      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, args }
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await UserModel.findOne({ username: args.username })
  
      if ( !user || args.password !== config.PASSWORD_DEFAULT ) {

        throw new GraphQLError("wrong credentials", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT }
        });
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, config.SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers