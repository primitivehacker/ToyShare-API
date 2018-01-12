const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: {type: GraphQLID},
  	created_at: {type: GraphQLString},
  	email: {type: new GraphQLNonNull(GraphQLString)},
  	first_name: {type: GraphQLString},
  	last_name: {type: GraphQLString},
  	phone_number: {type: GraphQLString},
  	updated_at: {type: GraphQLString},
    toys: {
      type: new GraphQLList(ToyType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/user/${parentValue.toy}`)
      }
    }

  })
});

const ToyType = new GraphQLObjectType({
  name: 'ToyType',
  fields: () => ({
    id: { type: GraphQLString },
    category: { type: GraphQLString },
    subCategory: { type: GraphQLString },
    price: { type: GraphQLFloat },
    condition: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue, args) {
        UserMongo
      }
    }
    reviews: { type: GraphQLString },
    location: { type: LocationType },
    availability: { type: GraphQLBoolean },
    timeLeft: { type: GraphQLString }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    toy: {
      type: ToyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/toys/${args.id}`)
        .then(resp => resp.data);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/owners/${args.id}`
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addToy: {
      type: ToyType,
      args: {
        category: { type: new GraphQLNonNull(GraphQLString) },
        subCategory: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        userId: { type: GraphQLString }
      },
      resolve(parentValue, { category, subCategory, price }) {
        return axios.post('http://localhost:3000/toys', { category, subCategory, price })
          .then(res => res.data);
      }
    },
    deleteToy: {
      type: ToyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/toys/${id}`)
          .then(res => res.data);
      }
    }
    editToy: {
      type: ToyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: GraphQLString },
        subCategory: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        userId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost3000/toys/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
