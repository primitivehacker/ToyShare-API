const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean
} =  require('graphql');

const mongoose = require('mongoose');

const {
  ToyGraphQLType,
  ToyMongoose,
  ToyFields,
  ToyInputFields,
} = require('../models/toy');


////////////////////////////////////
//            Queries             //
////////////////////////////////////

const toys = {
    type: new GraphQLList(ToyGraphQLType),
    args: {
        ids: {
            type: new GraphQLList(GraphQLID),
            description: `A List of toy IDs`
        }
    },
    resolve: function(obj, args, context) {
        return new Promise((resolve, reject) => {
            let query = {}
            if (args.ids) {
                query = {_id: {$in: args.ids.map(id => new mongoose.Types.ObjectId(id))}}
            }
            ToyMongoose.find(query).exec((err, toys) => {
                if (err) reject(err)
                else resolve(toys)
            })
        })
    }
};

const toy = {
    type: ToyGraphQLType,
    args: {
        id: {
            type: GraphQLID,
            description: `The ID of the toy`
        }
    },
    resolve: function(obj, args, context) {
        return new Promise((resolve, reject) => {
            ToyMongoose.findById(args.id).exec((err, res) => {
              if (err) reject(err)
              else {
                resolve(res);
              }
            })
        })
    }
};


////////////////////////////////////
//            Mutations           //
////////////////////////////////////

const toyCreate = {
    type: ToyGraphQLType,
    description: `Adds a new toy`,
    args: ToyInputFields,
    resolve: (obj, args, context) => {
        return new Promise((resolve, reject) => {
            const newToy = new ToyMongoose(args);
            newToy.save( (err, toy) => {
                if (err) reject(err)
                else {
                    resolve(toy);
                }
            })
        })
    }
};

const toyUpdate = {
    type: ToyGraphQLType,
    desciption: `Updates a toy`,
    args: Object.assign(
            {},
            ToyInputFields
    ),
    resolve: (obj, args, context) => {
        return new Promise((resolve, reject) => {
            ToyMongoose.findByIdAndUpdate(args.id, args, (err, toy) => {
                if (err) reject(err)
                else {
                    resolve(toy)
                }
            })
        })
    }
};

const toyRemove = {
    type: ToyGraphQLType,
    desciption: `Removes toy of the provided email and/or ID`,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            desciption: `The ID of the toy`
        }
    },
    resolve: (obj, args, context) => {
        return new Promise((resolve, reject) => {
            ToyMongoose.findByIdAndRemove(args.id, (err, toy) => {
                if (err) reject(err)
                else {
                    resolve(toy)
                }
            })
        })
    }
}

module.exports = {
    toy,
    toys,
    toyCreate,
    toyUpdate,
    toyRemove,
};
