// 第一屏 销量 start

// 1-1 车辆销量情况
chartOption1_1={
  title: {
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "axis",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  legend: {
    icon:'rect',
    textStyle: {
      color: "#fff",
      fontSize: 24,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "7%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        textStyle: {
          color: "#fff",
          fontSize: 20,
        },
      },
    },
  ],
  yAxis: [
    {
      axisLabel: {
        textStyle: {
          color: "#fff",
          fontSize: 20,
        },
      },
      type: "value",
    },
  ],
  series: [],
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 40,
      end: 80,
      textStyle:{
        color:'#fff',
        fontSize:20
      }
    }
  ],
};

// 1-2 品牌销量情况
var itemStyle1_2={
  opacity: 0.8,
  shadowBlur: 10,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: "rgba(0, 0, 0, 0.5)",
};

chartOption1_2={
  title: {
    text: "车型单日性能评比",
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  color: ["#dd4444", "#fec42c", "#80F1BE"],
  legend: {
    top: 10,
    data: [],
    right: 0,
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  grid: {
    left: "10%",
    right: 150,
    top: "18%",
    bottom: "12%",
  },
  tooltip: {
    padding: 10,
    backgroundColor: "#333",
    borderColor: "#777",
    borderWidth: 1,
    formatter: function (obj) {
      var value = obj.value;
      return (
        '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 21px;padding-bottom: 7px;margin-bottom: 7px;">' +
        obj.seriesName +
        " " +
        value[0] +
        "</div>" +
        "<br><p style='font-size:20px;'>月销量：" +
        value[1] +
        "</p><br>"
      );
    },
  },
  xAxis: {
    type: "category",
    name: "月份",
    nameGap: 16,
    nameTextStyle: {
      color: "#fff",
      fontSize: 14,
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 20,
      },
    },
    splitLine: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: "#eee",
      },
    },
  },
  yAxis: {
    type: "value",
    name: "月度销量",
    nameLocation: "end",
    nameGap: 20,
    nameTextStyle: {
      color: "#fff",
      fontSize: 16,
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 20,
      },
    },
    axisLine: {
      lineStyle: {
        color: "#eee",
      },
    },
    splitLine: {
      show: false,
    },
  },
  visualMap: [
    {
      left: "right",
      top: "10%",
      dimension: 1,
      min: 0,
      max: 200000,
      itemWidth: 30,
      itemHeight: 120,
      calculable: true,
      precision: 0.1,
      text: ["圆形大小：销量"],
      textGap: 30,
      textStyle: {
        color: "#fff",
      },
      inRange: {
        symbolSize: [10, 70],
      },
      outOfRange: {
        symbolSize: [10, 70],
        color: ["rgba(255,255,255,.2)"],
      },
      controller: {
        inRange: {
          color: ["#c23531"],
        },
        outOfRange: {
          color: ["#444"],
        },
      },
    },
  ],
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 40,
      end: 80,
      textStyle:{
        color:'#fff',
        fontSize:20
      }
    }
  ],
  series: [
  ],
};

// 1-3 售价区间销售情况
chartOption1_3={
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
    textStyle: {
      color: "#fff",
      fontSize: 22,
    },
  },
  legend: {
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    // orient: "vertical",
    left: 'center',
    top: 0,
  },
  grid: {
    left: "5%",
    right: "1%",
    bottom: "3%",
    top: "5%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 16,
      },
    },
  },
  yAxis: {
    type: "category",
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 16,
      },
    },
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      start: 40,
      end: 80,
      left:'2%',
      textStyle:{
        color:'#fff',
        fontSize:20
      }
    }
  ],
  series: [
  ],
};

// 1-4 车级销量情况
// 微型车
chartOption1_4_0={
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 0,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: [30, 110],
      center: ["60%", "50%"],
      roseType: "area",
    },
  ],
};
// 小型车
chartOption1_4_1={
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 0,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: [30, 110],
      center: ["60%", "50%"],
      roseType: "area",
    },
  ],
};
// 紧凑型
chartOption1_4_2={
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 0,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: [30, 110],
      center: ["60%", "50%"],
      roseType: "area",
    },
  ],
};
// 中型车
chartOption1_4_3={
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 0,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: [30, 110],
      center: ["60%", "50%"],
      roseType: "area",
    },
  ],
};
// 中大型
chartOption1_4_4={
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 0,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: [30, 110],
      center: ["60%", "50%"],
      roseType: "area",
    },
  ],
};
// suv
chartOption1_4_5 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 0,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: [30, 110],
      center: ["60%", "50%"],
      roseType: "area",
    },
  ],
};

// 1-5 汽车厂商销量
chartOption1_5 = {
  title: {
    // text: "热门车系月度销量",
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "axis",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    // formatter: "{a} <br/>{b}: {c} ({d}%)",
    axisPointer: {
      type: "line",
      lineStyle: {
        color: "rgba(0,0,0,0.2)",
        width: 1,
        type: "solid",
      },
    },
  },
  legend: {
    orient: "horizontal",
    right: 0,
    top: 0,
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  singleAxis: {
    top: 50,
    bottom: 50,
    left: 0,
    right: 0,
    axisTick: {},
    axisLabel: {},
    // min: 1,
    // singleAxisIndex: 1,
    type: "time",
    // axisLine: { lineStyle: { color: "#fff", fontSize: 18 } },
    axisPointer: {
      animation: true,
      label: {
        show: true,
      },
    },
    label:{show:false},
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        opacity: 0.2,
      },
    },
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      // xAxisIndex: [0],
      start: 40,
      end: 80,
      textStyle:{
        color:'#fff',
        fontSize:20
      }
    }
  ],
  series: [
    {
      type: "themeRiver",
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: "rgba(0, 0, 0, 0.8)",
        },
      },
      label: { show: false },
      data: [],
    },
  ],
};

// 1-6 售价级别排名占比
// 10万以内
chartOption1_6_0 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        // position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
    },
  ],
};
// 10-15万
chartOption1_6_1 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        // position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
    },
  ],
};
// 15-25万
chartOption1_6_2 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        // position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
    },
  ],
};
// 25-35万
chartOption1_6_3 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 18,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 17,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        // position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
    },
  ],
};
// 35-50万
chartOption1_6_4 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        // position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
    },
  ],
};
// 50万以上
chartOption1_6_5 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "车型销量",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        // position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
    },
  ],
};

// 第一屏 销量 end


// --------------------------------------------分割线-------------------------------------------------------


// 第二屏 口碑 start

// 2-1 口碑评分排行榜
chartOption2_1 = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    textStyle: {
      fontSize: 24,
    },
  },
  grid: {
    containLabel: true,
    left: 20,
    top: 5,
    right: 5,
    bottom: 5,
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
          color: '#999'
      }
    }
  },
  xAxis: {
    data: [],
    axisLabel: {
        inside: true,
        textStyle: {
            color: '#fff'
        }
    },
    axisTick: {
        show: false
    },
    axisLine: {
        show: false
    },
    z: 10
  },
  dataZoom: [
    {
        type: 'inside'
    }
],
  series: [
    {
      data: [],
        type: 'bar',
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                  {offset: 0, color: '#83bff6'},
                  {offset: 0.5, color: '#188df0'},
                  {offset: 1, color: '#188df0'}
              ]
          )
      },
      backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.7)'
        }
    },
  ],
};

// 2-2 词云数据-车系评论词云
wordcloud_pinlun = [];

// 2-3 测评文章
ceping_articleList = [
];

// 2-4 口碑印象
// 发动机
chartOption2_4 = {
  dataset: {
      source: []
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    textStyle: {
      fontSize: 24,
    },
    formatter:function(params){
      let value=params[0].data[1];
      let label=params[0].data[0];
      return label+'<br />'+(value<0?-value:value);
    }
  },
  grid: {containLabel: true},
  xAxis: {
    name: 'value',
    boundaryGap: false,
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 20,
      },
      formatter:function(value,index){
        return value<0?-value:value;
      }
    }
  },
  yAxis: {
    type: 'category',
    axisLine: {show: false},
    axisLabel: {show: false},
    axisTick: {show: false},
    splitLine: {show: false}
  },
  visualMap: {
      orient: 'horizontal',
      left: 'center',
      min: -1,
      max: 1,
      textStyle:{
        fontSize:20,
        color:'#fff',
      },
      text: ['差评人数','好评人数'],
      // Map the score column to color
      dimension: 2,
      inverse:true,
      hoverLink:false,
      range:[-1,1],
      color: ['rgb(101,224,128)','rgb(251, 118, 123)']
  },
  series: [
      {
          type: 'bar',
          label: {
            show: true,
            fontSize:23,
            formatter: '{b}'
          },
          encode: {
              // Map the "amount" column to X axis.
              x: 'value',
              // Map the "product" column to Y axis
              y: 'text'
          }
      }
  ]
};

// 2-5 2-12百车故障数分布
chartOption2_5_0 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        // position: "center",
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
    },
  ],
};
chartOption2_5_1 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
    },
  ],
};
chartOption2_5_2 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
    },
  ],
};
chartOption2_5_3 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
    },
  ],
};
chartOption2_5_4 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
    },
  ],
};
chartOption2_5_5 = {
  title: {
    text: "50万以上销量占比",
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
    },
  ],
};

// 2-6 3-5年百车故障数分布
chartOption2_6_0 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: "70%",
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
chartOption2_6_1 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: "70%",
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
chartOption2_6_2 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    data: [],
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: "70%",
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
chartOption2_6_3 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    data: [],
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: "70%",
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
chartOption2_6_4 = {
  title: {
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    data: [],
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: "70%",
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
chartOption2_6_5 = {
  title: {
    text: "50万以上销量占比",
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  legend: {
    orient: "vertical",
    left: 10,
    top: "middle",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    data: [],
  },
  series: [
    {
      name: "故障分布",
      type: "pie",
      radius: "70%",
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};

// 第二屏 口碑 end


// --------------------------------------------分割线-------------------------------------------------------


// 第三屏 召回投诉 start
// 3-1 热门品牌投诉数量走势
chartOption3_1 = {
  title: {
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "axis",
    textStyle: {
      color: "#fff",
      fontSize: 20,
    },
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  legend: {
    icon:'rect',
    textStyle: {
      color: "#fff",
      fontSize: 24,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "6%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        textStyle: {
          color: "#fff",
          fontSize: 20,
        },
      },
    },
  ],
  yAxis: [
    {
      axisLabel: {
        textStyle: {
          color: "#fff",
          fontSize: 20,
        },
      },
      type: "value",
    },
  ],
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 40,
      end: 80,
      textStyle:{
        color:'#fff',
        fontSize:20
      }
    }
  ],
  series: [],
};

// 3-2 品牌召回率
// 奥迪Q3
chartOption3_2_0 = {
  tooltip: {
    formatter: "{a} <br/>{c} {b}",
    textStyle: {
      fontSize: 18,
      color: "#fff",
    },
  },
  series: [
    {
      type: "gauge",
      min: 0,
      max: 100,
      splitNumber: 10,
      radius: "70%",
      axisLine: {
        // 坐标轴线
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: [
            [
              1,
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0.1,
                  color: "#FFC600",
                },
                {
                  offset: 0.6,
                  color: "#30D27C",
                },
                {
                  offset: 1,
                  color: "#0B95FF",
                },
              ]),
            ],
          ],
          width: 3,
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      axisLabel: {
        // 坐标轴小标记
        fontWeight: "bolder",
        color: "#fff",
        shadowColor: "#fff", //默认透明
        shadowBlur: 10,
        fontSize: 24,
      },
      axisTick: {
        // 坐标轴小标记
        length: 22, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: "auto",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      splitLine: {
        // 分隔线
        length: 35, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle（详见lineStyle）控制线条样式
          width: 3,
          color: "#fff",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      pointer: {
        // 分隔线
        shadowColor: "#fff", //默认透明
        shadowBlur: 5,
      },
      title: {
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: "bolder",
          fontSize: 26,
          fontStyle: "italic",
          color: "#fff",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      detail: {
        shadowColor: "#fff", //默认透明
        shadowBlur: 5,
        offsetCenter: [0, "50%"], // x, y，单位px
        fontSize: 50,
        color: "#00eaff",
        fontWeight: "bolder",
        formatter: function (value) {
          return value + "%";
        },
      },
      center: ["65%", "55%"],
      data: [
      ],
    },
  ],
};
// 别克GL8
chartOption3_2_1 = {
  tooltip: {
    formatter: "{a} <br/>{c} {b}",
  },
  series: [
    {
      type: "gauge",
      min: 0,
      max: 100,
      splitNumber: 10,
      radius: "80%",
      axisLine: {
        // 坐标轴线
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: [
            [
              1,
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 1,
                  color: "#d558c8",
                },
                {
                  offset: 0.6,
                  color: "#330867",
                },
                {
                  offset: 1,
                  color: "#24d292",
                },
              ]),
            ],
          ],
          width: 4,
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      axisLabel: {
        // 坐标轴小标记
        fontWeight: "bolder",
        color: "#fff",
        shadowColor: "#fff", //默认透明
        shadowBlur: 10,
        fontSize: 24,
      },
      axisTick: {
        // 坐标轴小标记
        length: 22, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: "auto",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      splitLine: {
        // 分隔线
        length: 35, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle（详见lineStyle）控制线条样式
          width: 3,
          color: "#fff",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      pointer: {
        // 分隔线
        shadowColor: "#fff", //默认透明
        shadowBlur: 5,
      },
      title: {
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: "bolder",
          fontSize: 26,
          fontStyle: "italic",
          color: "#fff",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      detail: {
        shadowColor: "#fff", //默认透明
        shadowBlur: 5,
        offsetCenter: [0, "50%"], // x, y，单位px
        fontSize: 50,
        color: "#00eaff",
        fontWeight: "bolder",
        formatter: function (value) {
          return value + "%";
        },
      },
      center: ["50%", "45%"],
      data: [
      ],
    },
  ],
};
// 速腾
chartOption3_2_2 = {
  tooltip: {
    formatter: "{a} <br/>{c} {b}",
  },
  series: [
    {
      type: "gauge",
      min: 0,
      max: 100,
      splitNumber: 10,
      radius: "70%",
      axisLine: {
        // 坐标轴线
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: [
            [
              1,
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0.8,
                  color: "#f9d423",
                },
                {
                  offset: 0.6,
                  color: "#fbc2eb",
                },
                {
                  offset: 1,
                  color: "#f0f",
                },
              ]),
            ],
          ],
          width: 3,
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      axisLabel: {
        // 坐标轴小标记
        fontWeight: "bolder",
        color: "#fff",
        shadowColor: "#fff", //默认透明
        shadowBlur: 10,
        fontSize: 24,
      },
      axisTick: {
        // 坐标轴小标记
        length: 22, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle控制线条样式
          color: "auto",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      splitLine: {
        // 分隔线
        length: 35, // 属性length控制线长
        lineStyle: {
          // 属性lineStyle（详见lineStyle）控制线条样式
          width: 3,
          color: "#fff",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      pointer: {
        // 分隔线
        shadowColor: "#fff", //默认透明
        shadowBlur: 5,
      },
      title: {
        textStyle: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: "bolder",
          fontSize: 24,
          fontStyle: "italic",
          color: "#fff",
          shadowColor: "#fff", //默认透明
          shadowBlur: 10,
        },
      },
      detail: {
        shadowColor: "#fff", //默认透明
        shadowBlur: 5,
        offsetCenter: [0, "50%"], // x, y，单位px
        fontSize: 50,
        color: "#00eaff",
        fontWeight: "bolder",
        formatter: function (value) {
          return value + "%";
        },
      },
      center: ["35%", "55%"],
      data: [
      ],
    },
  ],
};

// 3-3 投诉问题占比情况
// 发动机
chartOption3_3_0 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        formatter: function(param){
          return param.seriesName+'\n'+param.value*100+'%'
        },
        color: "#D94854",
      },
    },
  ],
};
// 变速器
chartOption3_3_1 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        color: "#D94854",
        formatter: function(param) {
          return param.seriesName+'\n'+param.value*100+'%'
      },
      },
    },
  ],
};
// 离合器
chartOption3_3_2 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        color: "#D94854",
        formatter: function(param) {
          return param.seriesName+'\n'+param.value*100+'%'
      },
      },
    },
  ],
};
// 转向系统
chartOption3_3_3 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        color: "#D94854",
        formatter: function(param) {
          return param.seriesName+'\n'+param.value*100+'%'
      },
      },
    },
  ],
};
// 制动系统
chartOption3_3_4 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        color: "#D94854",
        formatter: function(param) {
          return param.seriesName+'\n'+param.value*100+'%'
      },
      },
    },
  ],
};
// 轮胎
chartOption3_3_5 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        color: "#D94854",
        formatter: function(param) {
          return param.seriesName+'\n'+param.value*100+'%'
      },
      },
    },
  ],
};
// 前后桥及悬挂系统
chartOption3_3_6 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        color: "#D94854",
        formatter: function(param) {
          return param.seriesName+'\n'+param.value*100+'%'
      },
      },
    },
  ],
};
// 车身附件及电器
chartOption3_3_7 = {
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      outline: {
        show: false,
      },
      backgroundStyle: {
        borderColor: "#156ACF",
        borderWidth: 1,
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowBlur: 20,
      },
      shape: model_jingyu,
      label: {
        position: ["38%", "40%"],
        fontSize: 40,
        color: "#D94854",
        formatter: function(param) {
          return param.seriesName+'\n'+param.value*100+'%'
      },
      },
    },
  ],
};

// 3-4 速腾近一年投诉问题分布
// 发动机
chartOption3_4_0 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
// 变速器
chartOption3_4_1 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
// 离合器
chartOption3_4_2 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
// 转向系统
chartOption3_4_3 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
// 制动系统
chartOption3_4_4 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
// 轮胎
chartOption3_4_5 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
// 前后桥及悬挂系统
chartOption3_4_6 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
// 车身附件及电器
chartOption3_4_7 = {
  title: {
    left: "center",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    textStyle: {
      color: "#00eaff",
      fontSize: 20,
    },
  },
  series: [
    {
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      selectedMode: "single",
      label: {
        position: "inner",
      },
      labelLine: {
        show: false,
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

// 3-5 热门车系召回缺陷情况词云
wordcloud_zhaohui = [];

// 3-6 召回文章集合
zhaohui_articleList = [];

// 第三屏 召回投诉 end




