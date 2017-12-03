const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    location: { type: GraphQLString },
    rating: { type: GraphQLString
    toys: {
      type: new GraphQLList(ToyType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/owners/${parentValue.id}/toys`)
          .then(res => res.data);
      }
    }

  })
});

const ToyType = new GraphQLObjectType({
  name: 'Toy',
  fields: () => ({
    id: { type: GraphQLString },
    category: { type: GraphQLString },
    subCategory: { type: GraphQLString },
    price: { type: GraphQLFloat },
    condition: { type: GraphQLString },
    description: { type: GraphQLString },
    owner: {
      type: OwnerType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/toys/${parentValue.ownerId}`)
          .then(res => res.data);
      }
    }
    reviews: { type: GraphQLString },
    location: { type: GraphQLString},
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
    }
    owner: {
      type: OwnerType,
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
        ownerId: { type: GraphQLString }
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
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
