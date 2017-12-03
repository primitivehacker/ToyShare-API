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

const toySchema = new Schema({
	created_at: Date,
	email: {type: String, unique: true, sparse: true},
	first_name: String,
	last_name: String,
	phone_number: String,
	toys_id: ID,
	current
	updated_at: Date,
});

// on every save, add the date
toySchema.pre('save', function(next) {
	var currentDate = new Date();

	this.updated_at = currentDate;

	if (!this.created_at)
		this.created_at = currentDate;

	next();
});

var ToyMongoose = mongoose.model('Toy', toySchema);

const ToyFields = {
	id: { type: GraphQLString },
	category: { type: GraphQLString },
	subCategory: { type: GraphQLString },
	price: { type: GraphQLFloat },
	condition: { type: GraphQLString },
	owner: { type: GraphQLID },
	reviews: { type: GraphQLString },
	location: { type: GraphQLString},
	availability: { type: GraphQLBoolean },
	timeLeft: { type: GraphQLString }
};

const ToyInputFields = Object.assign({}, ToyFields);

const ToyGraphQLType = new GraphQLObjectType({
	name: 'toy',
	fields: ToyFields
})

const ToyInputGraphQLType = new GraphQLInputObjectType({
	name: 'toyInput',
	fields: ToyInputFields
})

// make this available to our toys in our Node applications
module.exports = {
	ToyMongoose,
	ToyGraphQLType,
	ToyFields,
	ToyInputFields,
	ToyInputGraphQLType
};
