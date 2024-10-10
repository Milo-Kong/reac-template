import { gql } from '@apollo/client';

// 普通查询
// const userSellUsdts1 = gql`
//   query MyQuery {
//     userSellUsdts {
//       id
//       j
//       blockTimestamp
//       blockNumber
//       amount
//       user
//       transactionHash
//     }
//   }
// `
// // where 查询
// const userSellUsdts = gql`
// query MyQuery($user:String!) {
//   userSellUsdts(where: {user: $user}) {
//     id
//     j
//     blockTimestamp
//     blockNumber
//     amount
//     user
//     transactionHash
//   }
// }
// `
// // 多个参数
// const userSellUsdts2 = gql`
// query MyQuery($orderBy: String! $orderDirection:String!) {
//   userSellUsdts(orderBy:$orderBy orderDirection:$orderDirection) {
//     id
//     j
//     blockTimestamp
//     blockNumber
//     amount
//     user
//     transactionHash
//   }
// }
// `
