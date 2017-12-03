const {
  GraphQLObjectType,
  GraphQLSchema,
} =  require('graphql');

const {
	user,
	users,
	userCreate,
	userRemove,
	userUpdate,
} = require('./resolvers/users');

const {
  toy,
  toys,
  toyCreate,
  toyRemove,
  toyUpdate,
} = require('./resolvers/toys');

let query = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		users,
		user,
    toys,
    toy,
	}
});

let mutation = new GraphQLObjectType({
	name: 'RootMutationType',
	fields: {
		userCreate,
		userUpdate,
		userRemove,
    toyCreate,
    toyUpdate,
    toyRemove,
	}
}); //forgot semicolon possibly

let schema = new GraphQLSchema({
  query,
  mutation
});

module.exports = schema;
