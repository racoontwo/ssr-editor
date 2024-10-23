import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} from 'graphql';

import documents from '../documents.mjs';
import DocumentType from './document.js';


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        documents: {
            type: new GraphQLList(DocumentType),
            description: 'List of all documents',
            resolve: async function() {
                return await documents.fetchData();
            },
        }
    })
});

export default RootQueryType;
