import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function CustomEcharts(){
  const myChart = useRef<any>()
  useEffect(()=>{
    window.addEventListener('resize', function() {
      myChart.current && myChart.current.resize();
    });
    const echartsEle = document.getElementById('echartsID')
    if (echartsEle){
      myChart.current = echarts.init(echartsEle);
      var option = {
        /**标题 */
        title: {
          text: 'ECharts 入门示例ECharts 入门示例ECharts 入门示例\n标题',
          link:'https://echarts.apache.org/zh/option.html#title',
          textStyle:{
            color:'yellow',
            fontWeight:'bold',
            fontSize:24,
            lineHeight:40,
          },
          subtext:'副标题',
          sublink:'https://echarts.apache.org/zh/option.html#title',
          left:'49.5%',
          top:"3%",
          textAlign:'center',
          backgroundColor:'blue'
          // show:false
        },

        /**图例组件 https://echarts.apache.org/zh/option.html#legend */
        legend: {
          data: ['销量'],
          show:true,
          formatter:'Legend {name}',
          // formatter: function (name) {
          //   return 'Legend ' + name;
          // }
          textStyle:{
            color:'purple',
            backgroundColor:'green'
          }
        },


        /**直角坐标系 grid 中的 x 轴 https://echarts.apache.org/zh/option.html#xAxis */
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
          name:'X轴',
          nameLocation:'start',
          nameTextStyle:{
            color:'yellow'
          },
          nameGap:20,
          // min:1,
          // max:100
        },

        /**直角坐标系 grid 中的 y 轴 https://echarts.apache.org/zh/option.html#yAxis */
        yAxis: {
          name:'Y轴',
          nameLocation:'start',
          nameTextStyle:{
            color:'blue'
          },
          nameGap:20,
          axisLine:{
            show:true
          },
          axisTick:{

          }
          // nameRotate:90
        },


        /**提示框组件  https://echarts.apache.org/zh/option.html#tooltip */
        tooltip: {
          axisPointer:{
            type:'cross',
            label:{
              show:true
            }
          },
          backgroundColor:'green',
          textStyle:{
            color:'red'
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);',
          valueFormatter: (value:any) => '$' + value.toFixed(2)
        },

        toolbox:{
          show:true
        },

        series: [
          {
            name: '当前值',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
            /**https://echarts.apache.org/zh/option.html#series-bar.itemStyle */
            itemStyle:{
              color:'#f5f5',
              borderColor:'#f9f9f9',
              borderRadius: [5, 5, 0, 0]
            },
            clip:false,
            markLine: {
              lineStyle: { width: 2 }, // 标线大小
              symbol: "none", //去掉线最后面的箭头

              data: [{
                  name: '水平线1',
                  yAxis: 32, // Y 值为给定值的标记线，用户自定义水平标线的值
                  lineStyle: { color: "#FFAE00", type:'solid' },
                  label:{
                    position:'start',
                    show:true
                  },
                },
                {
                  name: '水平线2',
                  yAxis: 17, // Y 值为给定值的标记线，用户自定义水平标线的值
                  lineStyle: { color: "#FF4A00", type:'solid' },
                }
              ]
            }
          }
        ],
        backgroundColor:'red',
      };
      // @ts-ignore
      myChart.current.setOption(option);
    }
  },[])

  return <div id={'echartsID'} style={{width:'100%',height:600}}/>
}