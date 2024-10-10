// import { Triangle, ColorRing, ThreeCircles } from 'react-loader-spinner'

// export default function LoadingRow({
//   width = 100,
//   type = 'ThreeCircles'
// }:{
//   width?:number,
//   type?:'Triangle' | 'ThreeCircles'
// }){
//   if (type == 'ThreeCircles'){
//     return <ThreeCircles
//       height={width}
//       width={width}
//       wrapperStyle={{}}
//       wrapperClass=""
//       visible={true}
//       ariaLabel="three-circles-rotating"
//       outerCircleColor="#EF8339 "
//       innerCircleColor="#f8b26a"
//       middleCircleColor="#e15b64"
//     />
//   }
//   return <Triangle
//     height={width}
//     width={width}
//     color="#EF8339"
//     ariaLabel="triangle-loading"
//     wrapperStyle={{}}
//     visible={true}
//   />
// }


import Skeletons from "../Skeletons";
import './index.less'
export default function LoadingRow({width = 60}:{width?:number | string}){
  return <Skeletons className='skeletons' style={{
    width:width,
  }}/>
}


