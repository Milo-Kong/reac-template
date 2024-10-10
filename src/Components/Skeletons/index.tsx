import './index.less'
import SkeletonsImageSVG from '@/assets/svg/SkeletonsImage.svg'

interface SkeletonsProps {
  className:any,
  style?:any,
  count?:number,
  textClassName?:any
}
function Skeletons(props:SkeletonsProps){
  return <div className={props.className} style={props.style}>
    <div className='skeletons'/>
  </div>
}
function SkeletonsImage(props:SkeletonsProps){
  return <div className={props.className} style={props.style}>
    <div className='skeletons'>
      <img className='image' src={SkeletonsImageSVG}/>
    </div>
  </div>
}
function SkeletonsText(props:SkeletonsProps){
  function items(){
    const count = props.count || 1
    let item:any[] = []
    for (let index = 0; index < count; index++) {
      item.push(<div className={`skeletonsItem ${props.textClassName}`} key={'skeletonsItem' + index}
        style={{width:index == count - 1 ? '70%' : '100%'}}>
        <div className='skeletons'/>
      </div>)
    }
    return item
  }
  return <div className={props.className} style={props.style}>
    {items()}
  </div>
}
export default Skeletons
export {
  SkeletonsText,
  SkeletonsImage
}