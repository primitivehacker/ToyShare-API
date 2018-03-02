const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {
	graphql,
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLUnionType,
	GraphQLNonNull,
	GraphQLID,
	GraphQLEnumType,
	GraphQLSchema,
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
	GraphQLString
} = require('graphql');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	created_at: Date,
	email: {type: String, unique: true, sparse: true},
	password: String,
	first_name: String,
	last_name: String,
	avatar: String,
	phone_number: String,
	updated_at: Date
});  //possibly add { timestamps: true } before closing parenth

// on every save, add the date
userSchema.pre('save', function(next) {
	var currentDate = new Date();

	this.updated_at = currentDate;

	if (!this.created_at)
		this.created_at = currentDate;

	next();
});

var UserMongoose = mongoose.model('User', userSchema);

const UserFields = {
	id: {type: GraphQLID},
	created_at: {type: GraphQLString},
	email: {type: new GraphQLNonNull(GraphQLString)},
	first_name: {type: GraphQLString},
	last_name: {type: GraphQLString},
	phone_number: {type: GraphQLString},
	toys: {type: new GraphQLList(GraphQLID)},
	updated_at: {type: GraphQLString}
};

const UserInputFields = Object.assign({}, UserFields);

const UserGraphQLType = new GraphQLObjectType({
	name: 'user',
	fields: UserFields
})

const UserInputGraphQLType = new GraphQLInputObjectType({
	name: 'userInput',
	fields: UserInputFields
})

// make this available to our users in our Node applications
module.exports = {
	UserMongoose,
	UserGraphQLType,
	UserFields,
	UserInputFields,
	UserInputGraphQLType
};
