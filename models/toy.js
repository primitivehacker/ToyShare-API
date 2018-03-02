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

const {
	UserGraphQLType
} = require('./user')

const Schema = mongoose.Schema;

const toySchema = new Schema({
	category: {type: String, values: ['smmr', 'wnntr']},
	sub_category: String,
	price: Number,
	condition: String,
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	reviews: [String],
	location: String,
	availability: Boolean,
	timeLeft: String,
	updated_at: Date,
	created_at: Date,
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
	id: { type: GraphQLID },
	category: { type: GraphQLString },
	sub_category: { type: GraphQLString },
	price: { type: GraphQLFloat },
	condition: { type: GraphQLString },
	user: { type: UserGraphQLType },
	reviews: { type: new GraphQLList(GraphQLString) },
	location_lat: { type: GraphQLFloat},
	location_long: { type: GraphQLFloat},
	availability: { type: GraphQLBoolean },
	timeLeft: { type: GraphQLString }
};

const ToyInputFields = Object.assign({}, ToyFields);
<<<<<<< HEAD
ToyInputFields.user = { type: GraphQLID };
=======
ToyInputFields.user = {type: GraphQLID};
>>>>>>> 284de6c17a7fddef3b3591fc307b0a5eed056825

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
