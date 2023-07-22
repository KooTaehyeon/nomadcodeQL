import { ApolloServer, gql } from 'apollo-server';

// const { ApolloServer, gql } = require('apollo-server');

let tweets = [
  {
    id: 1,
    text: 'hello',
    // ,author:
    userId: 1,
  },
  {
    id: 2,
    text: 'hello2',
    userId: 2,
    // ,author:
  },
];
let users = [
  {
    id: 1,
    firstName: 'koo',
    lastName: 'taehyeon',
  },
  {
    id: 2,
    firstName: 'koo2',
    lastName: 'taehyeon2',
  },
];
const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    fullName: String
  }
  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query {
    allMovies: [Movie]
    allUsers: [User]
    allTweets: [Tweet]
    tweet(id: ID): Tweet
    movie(id: String): Movie
  }
  type Mutation {
    postTweet(text: String, UserId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet({ id }: any) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log('allUsers called!');
      return users;
    },
    allMovies: async () => {
      const response = await fetch(
        'https://yts.torrentbay.to/api/v2/list_movies.json',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data.data.movies;
    },
    // movie: async (_: any, { id }: any) => {
    //   const r = await fetch(
    //     `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
    //   );
    //   const json = await r.json();
    //   return json.data.movie;
    // },
  },
  Mutation: {
    postTweet({ text, userId }: any) {
      const newTweet: any = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet({ id }: any) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }: any) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }: any) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
