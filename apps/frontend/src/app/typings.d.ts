/* eslint-disable */
declare module '*.graphql' {
  import { DocumentNode, TypedDocumentNode, OperationVariables } from 'graphql'
  const value: DocumentNode | TypedDocumentNode<any, OperationVariables>
  export default value
}

declare module '*.gql' {
  import { DocumentNode, TypedDocumentNode, OperationVariables } from 'graphql'
  const value: DocumentNode | TypedDocumentNode<any, OperationVariables>
  export default value
}
