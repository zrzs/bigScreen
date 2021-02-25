$(function () {
  $.ajax({url:'http://localhost:7001/getChartData',success:function(result){
    $(".loading").fadeOut();
    // 1-1
    chartOption1_1.legend.data=result.data_1_1.map(r=>r.name);
    result.data_1_1.map(r=>{
      r.data.shift();
      let data=r.data.map(m=>m[1]);
      chartOption1_1.series.push({
        name:r.name,
        data:data,
        type: "line",
        stack: "总量",
        // areaStyle: {},6.,/≤.
      });
    });
    chartOption1_1.xAxis[0].data=result.data_1_1[0].data.map(m=>m[0]);
    chart_zhexian();

    // 1-2
    const chart_1_2= chart_qipao();
    $("#brand-sales").data("init",JSON.stringify(result.data_1_2));
    $("#brand-sales").attr("data-checks",result.data_1_2[0].text);
    $("#brand-sales").mySelect({
      showCancel:false,
      showSearch:true,
      multiple:true,
      onChange:(option)=>{
        if(option.texts&&option.texts.length===0){
          return alert('请选择');
        }

        $.ajax({url:'http://localhost:7001/getBrandData?brandList='+JSON.stringify(option.texts),success:function(_result){
          chartOption1_2.legend.data=_result.map(r=>r.name);
          chartOption1_2.series=[];
          _result.map(r=>{
            chartOption1_2.series.push({
              name:r.name,
              data:r.data,
              type: "scatter",
              itemStyle: itemStyle1_2,
            });
          });
          // chart_1_2.clear();
          chart_1_2.setOption(chartOption1_2,{notMerge:true});
        }})
      }
    });


    // 1-3
    chartOption1_3.legend.data=result.data_1_3.map(r=>r.name);
    result.data_1_3.map(r=>{
      r.data.shift();
      let data=r.data.map(m=>m[1]);
      chartOption1_3.series.push({
        name:r.name,
        data:data,
        type: "bar",
        stack: "总量",
        label: {
          show: false,
          position: "insideRight",
        },
      });
    });
    chartOption1_3.yAxis.data=result.data_1_3[0].data.map(m=>m[0]);
    chart_duidie();

    // 1-4
    $("#car-level-sales").data("init",JSON.stringify(result.data_1_4));
    $("#car-level-sales").attr("data-checks",result.data_1_4[0].text);
    $("#car-level-sales").mySelect({
      showCancel:false,
      showSearch:true,
      multiple:false,
      onChange:(option)=>{
        if(option.texts&&option.texts.length===0){
          return alert('请选择');
        }
        $.ajax({url:'http://localhost:7001/queryCarLevelMonthSales?month='+JSON.stringify(option.texts),success:function(_result){
          chartOption1_2.legend.data=_result.map(r=>r.name);
          chartOption1_2.series=[];
          _result.map((r,i)=>{
            let option=window[`chartOption1_4_${i}`];
            option.title.text=r.name;
            option.legend.data=r.data.map(r=>r[0]);
            let data=[];
            r.data.map(d=>{
              data.push({name:d[0],value:d[1]});
            });
            option.series[0].data=data;
          });
          chart_nandinggeer();
        }})
      }
    });

    // 1-5
    const chart_1_5= chart_river();
    $("#firm-sales").data("init",JSON.stringify(result.data_1_5));
    $("#firm-sales").attr("data-checks",result.data_1_5[0].text);
    $("#firm-sales").mySelect({
      showCancel:false,
      showSearch:true,
      multiple:true,
      onChange:(option)=>{
        if(option.texts&&option.texts.length===0){
          return alert('请选择');
        }

        $.ajax({url:'http://localhost:7001/getFirmData?firmList='+JSON.stringify(option.texts),success:function(_result){
          chartOption1_5.legend.data=_result.map(r=>r.name);
          chartOption1_5.series[0].data=[];
          _result.map(r=>{
            r.data.map(d=>{
              chartOption1_5.series[0].data.push([d[0], d[1], r.name]);
            });
          });
          chart_1_5.setOption(chartOption1_5,{notMerge:true});
        }})
      }
    });

    // 1-6
    $("#sales-ranking").data("init",JSON.stringify(result.data_1_6));
    $("#sales-ranking").attr("data-checks",result.data_1_6[0].text);
    $("#sales-ranking").mySelect({
      showCancel:false,
      showSearch:true,
      multiple:false,
      onChange:(option)=>{
        if(option.texts&&option.texts.length===0){
          return alert('请选择');
        }
        $.ajax({url:'http://localhost:7001/queryPriceRangeMonthSales?month='+JSON.stringify(option.texts),success:function(_result){
          chartOption1_2.legend.data=_result.map(r=>r.name);
          chartOption1_2.series=[];
          _result.map((r,i)=>{
            let option=window[`chartOption1_6_${i}`];
            option.title.text=r.name;
            option.legend.data=r.data.map(r=>r[0]);
            let data=[];
            r.data.map(d=>{
              data.push({name:d[0],value:d[1]});
            });
            option.series[0].data=data;
          });
          chart_huanxing();
        }})
      }
    });

    // 2-1
    chartOption2_1.xAxis.data=result.data_2_1.map(m=>m.modelName);
    chartOption2_1.series[0].data=result.data_2_1.map(m=>{ return {value:m.score}});
    //  koubei-score-top

    // 2-2
    result.data_2_2[0].data.shift();
    result.data_2_2[0].data.map(d=>{
      wordcloud_pinlun.push({name:d[0],value:d[1]});
    });
    // 2-3
    result.data_2_3[0].data.shift();
    result.data_2_3[0].data.map(d=>{
      ceping_articleList.push({name:d[0],url:d[1]});
    });

    // 2-4
    chart_2_4_init_data=result.auctionList;
    chartOption2_4.dataset.source=[['text', 'value', 'isDust']];
    let json= chart_2_4_init_data[0].j;
    json=JSON.parse(json);
    json.shift();
    json.map(j=>{
      chartOption2_4.dataset.source.push([j.text,j.isDust?0-parseInt(j.value):parseInt(j.value),j.isDust?1:-1]);
    });
    
    // 2-5

    // 2-6

    // 3-1

    // 3-2
    const zhaohuiList=result.data_3_2[0].data;
    zhaohuiList.shift();
    zhaohuiList.map((z,i)=>{
      $(`#chart-zhaohui-${i} .zh-title`).text(z[0]);
      $(`#chart-zhaohui-${i} .zh-number`).text(z[1]);
    });

    // 3-3
    result.data_3_3[0].data.shift();
    result.data_3_3[0].data.map((r,i)=>{
     let option= window[`chartOption3_3_${i}`];
     option.series[0].name=r[0];
     option.series[0].data=[r[1]];
    });
    
    // 3-4 

    // 3-5
    result.data_3_5[0].data.shift();
    result.data_3_5[0].data.map(d=>{
      wordcloud_zhaohui.push({name:d[0],value:d[1]});
    });

    // 3-6
    result.data_3_6[0].data.shift();
    result.data_3_6[0].data.map(d=>{
      zhaohui_articleList.push({name:d[0],url:d[1]});
    });


    $(".tab-item").click((e) => {
      var id = $(e.currentTarget).attr("id");
      $(".tab-item").removeClass("tab-item-select");
      $(e.currentTarget).addClass("tab-item-select");
      $(".screen-box").hide();
      $("." + id).show();
      if (id === "screen-3") {
       var brandCompaintChart= chart_tousu_zhexian();
        chart_shuibo();
        chart_wordcloud(wordcloud_zhaohui, "chart-word-cloud");
        show_article(zhaohui_articleList, ".chart-zhaohui");
       var chartProblemList= tousu_question();
  
        $("#brand-compaint").data("init",JSON.stringify(result.data_3_1));
        $("#brand-compaint").attr("data-checks",result.data_3_1[0].text);
        $("#brand-compaint").mySelect({
          showCancel:false,
          showSearch:true,
          multiple:true,
          onChange:(option)=>{
            if(option.texts&&option.texts.length===0){
              return alert('请选择');
            }
    
            $.ajax({url:'http://localhost:7001/getCompaintData?brandList='+JSON.stringify(option.texts),success:function(_result){
              chartOption3_1.series=[];
              _result.map(r=>{
                let data=r.data.map(m=>m[1]);
                chartOption3_1.series.push({
                  name:r.name,
                  data:data,
                  type: "line",
                  stack: "总量",
                  areaStyle: {},
                });
              });
              chartOption3_1.xAxis[0].data=_result[0].data.map(m=>m[0]);
              chartOption3_1.dataZoom=brandCompaintChart.getOption().dataZoom;
              brandCompaintChart.setOption(chartOption3_1,{notMerge:true});
            }})
          }
        });


        $("#brand-compaint-position").data("init",JSON.stringify(result.data_3_4));
        $("#brand-compaint-position").attr("data-checks",result.data_3_4[0].text);
        $("#brand-compaint-position").mySelect({
          showCancel:false,
          showSearch:true,
          multiple:false,
          onChange:(option)=>{
            if(option.texts&&option.texts.length===0){
              return alert('请选择');
            }
            let selectBrand=option.texts[0];
            $.ajax({url:'http://localhost:7001/queryBrandPositionProblem?brandName='+selectBrand,success:function(_result){
              let i=0;
              for(p in _result){
                let option= window[`chartOption3_4_${i}`];
                option.title.text=`${p}问题`;
                option.series[0].name=p;
                option.series[0].data=_result[p].map(m=>{return {name:m[0],value:m[1]}});
                chartProblemList[p].setOption(option,{notMerge:true})
              }
              $("#compaint-brand-name").text(selectBrand);
            }})
          }
        });
      } else if (id === "screen-2") {
        koubei_yinixiang();
        $("#auction-select").data("init",JSON.stringify(chart_2_4_init_data));
        // 下拉框配置 口碑印象
        $("#auction-select").mySelect({
          showCancel:false,
          showSearch:true,
          multiple:false,
          onChange:(val)=>{
            let datas=[];
            chart_2_4_init_data.map(c=>{
              if(c.text===val.texts[0]){
                datas=JSON.parse(c.j);
                datas.shift();
  
                chartOption2_4.dataset.source=[['text', 'value', 'isDust']];
                datas.map(j=>{
                  chartOption2_4.dataset.source.push([j.text,j.isDust?0-parseInt(j.value):parseInt(j.value),j.isDust?1:-1]);
                });
                myChart_yixiang_zuzhuang.setOption(chartOption2_4,{notMerge:true});
              }
            });
          }
        });
  
        show_article(ceping_articleList, ".chart-ceping");
        chart_wordcloud(wordcloud_pinlun, "chart-word-cloud-comment");
        
        var chart_paihang_2_1= chart_paihang();
        var select_list=[]; 
        result.data_2_1.map((m,i)=>{
          select_list.push({text:m.modelName,val:i});
        });
        $("#koubei-score-top").data("init",JSON.stringify(select_list));
        // 下拉框配置 口碑印象
        $("#koubei-score-top").mySelect({
          showCancel:false,
          showSearch:true,
          multiple:false,
          onChange:(val)=>{ 
            var linearGradient =new echarts.graphic.LinearGradient(
              0, 0, 0, 1,[{offset: 0, color: '#83bff6'},{offset: 0.5, color: '#188df0'},{offset: 1, color: '#188df0'}]);
          var emphasisLinearGradient=new echarts.graphic.LinearGradient(
            0, 0, 0, 1,[{offset: 0, color: 'rgba(135, 0, 157)'},{offset: 0.7, color: 'rgba(135, 0, 157)'},{offset: 1, color: 'rgba(135, 0, 157)'}]);
            if(val.vals.length>0){
              const cousre= parseInt(val.vals[0]);
              chartOption2_1.series[0].data.map(d=>{
                 d.itemStyle={color:linearGradient}
                 return d;
              });
              var selectItem=chartOption2_1.series[0].data[cousre];
              chartOption2_1.series[0].data[cousre]={value:selectItem.value,itemStyle:{color:emphasisLinearGradient}};
              chart_paihang_2_1.setOption(chartOption2_1,{notMerge:true});
            }
            
          }
        });

        $("#2-12-baichefault").data("init",JSON.stringify(result.data_2_5));
        const data_2_5=result.data_2_5;
        const initData2_12=[data_2_5[0].text,data_2_5[1].text,data_2_5[2].text,data_2_5[3].text,data_2_5[4].text,data_2_5[5].text];
        $("#2-12-baichefault").attr("data-checks",initData2_12);
        $("#2-12-baichefault").mySelect({
          showCancel:false,
          showSearch:true,
          multiple:true,
          onChange:(option)=>{
            if(option.texts&&option.texts.length!=6){
              return ;
            }
            var modelNames=option.texts.map(t=>`'${t}'`);
    
            $.ajax({url:'http://localhost:7001/queryBaicheData?type=newBaicheFault&modelNames='+JSON.stringify(modelNames),success:function(_result){
              _result.map((r,i)=>{
                let option=window[`chartOption2_5_${i}`];
                option.title.text=r.modelName;
                var listdata=JSON.parse(r.json);
                option.legend.data=listdata.table.map(r=>r.text);
                let data=[];
                listdata.table.map(d=>{
                  data.push({name:d.text,value:parseInt(d.value.replace('%',""))});
                });
                option.series[0].data=data;
              });
              chart_212fault();
            }})
          }
        });

        $("#3-5-baichefault").data("init",JSON.stringify(result.data_2_6));
        const data_2_6=result.data_2_6;
        const initData2_6=[data_2_6[0].text,data_2_6[1].text,data_2_6[2].text,data_2_6[3].text,data_2_6[4].text,data_2_6[5].text];
        $("#3-5-baichefault").attr("data-checks",initData2_6);
        $("#3-5-baichefault").mySelect({
          showCancel:false,
          showSearch:true,
          multiple:true,
          onChange:(option)=>{
            if(option.texts&&option.texts.length!=6){
              return ;
            }
            var modelNames=option.texts.map(t=>`'${t}'`);
            $.ajax({url:'http://localhost:7001/queryBaicheData?type=researchBaicheFault&modelNames='+JSON.stringify(modelNames),success:function(_result){
              _result.map((r,i)=>{
                let option=window[`chartOption2_6_${i}`];
                option.title.text=r.modelName;
                var listdata=JSON.parse(r.json);
                option.legend.data=listdata.table.map(r=>r.text);
                let data=[];
                listdata.table.map(d=>{
                  data.push({name:d.text,value:parseInt(d.value.replace('%',""))});
                });
                option.series[0].data=data;
              });
              chart_35fault();
            }})
          }
        });
      }
    });
  }});




  chart_nandinggeer();
  chart_huanxing();

  // 车型销量情况
  function chart_zhexian() {
    var myChart = echarts.init(
      document.getElementsByClassName("chart-zhexian")[0]
    );
    myChart.setOption(chartOption1_1);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }
  
  // 车级销量-南丁格尔图
  function chart_nandinggeer() {
    // 微型车
    var myChart_weixing = echarts.init(
      document.getElementsByClassName("chart-nandinggeer-weixing")[0]
    );
    myChart_weixing.setOption(chartOption1_4_0,{notMerge:true});

    // 小型车
    var myChart_xiaoxing = echarts.init(
      document.getElementsByClassName("chart-nandinggeer-xiaoxing")[0]
    );
    myChart_xiaoxing.setOption(chartOption1_4_1,{notMerge:true});

    // 紧凑型
    var myChart_jincou = echarts.init(
      document.getElementsByClassName("chart-nandinggeer-jincou")[0]
    );
    myChart_jincou.setOption(chartOption1_4_2,{notMerge:true});

    // 中型车
    var myChart_zhongxing = echarts.init(
      document.getElementsByClassName("chart-nandinggeer-zhongxing")[0]
    );
    myChart_zhongxing.setOption(chartOption1_4_3,{notMerge:true});

    // 中大型车
    var myChart_zhongdaxing = echarts.init(
      document.getElementsByClassName("chart-nandinggeer-zhongdaxing")[0]
    );
    myChart_zhongdaxing.setOption(chartOption1_4_4,{notMerge:true});

    // suv
    var myChart_suv = echarts.init(
      document.getElementsByClassName("chart-nandinggeer-suv")[0]
    );
    myChart_suv.setOption(chartOption1_4_5,{notMerge:true});
    window.addEventListener("resize", function () {
      myChart_weixing.resize();
      myChart_xiaoxing.resize();
      myChart_jincou.resize();
      myChart_zhongxing.resize();
      myChart_zhongdaxing.resize();
      myChart_suv.resize();
    });
  }

  // 河流图 汽车厂商销量
  function chart_river() {
    var myChart = echarts.init(
      document.getElementsByClassName("chart-heliutu")[0]
    );

    myChart.setOption(chartOption1_5);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    return myChart;
  }

  // 车型售价区间 占比
  function chart_huanxing() {
    var myChart_10 = echarts.init(
      document.getElementsByClassName("chart-zuixing-10")[0]
    );

    myChart_10.setOption(chartOption1_6_0,{notMerge:true});

    var myChart_15 = echarts.init(
      document.getElementsByClassName("chart-zuixing-15")[0]
    );

    myChart_15.setOption(chartOption1_6_1,{notMerge:true});
    var myChart_25 = echarts.init(
      document.getElementsByClassName("chart-zuixing-25")[0]
    );

    myChart_25.setOption(chartOption1_6_2,{notMerge:true});

    var myChart_35 = echarts.init(
      document.getElementsByClassName("chart-zuixing-35")[0]
    );

    myChart_35.setOption(chartOption1_6_3,{notMerge:true});
    var myChart_50 = echarts.init(
      document.getElementsByClassName("chart-zuixing-50")[0]
    );

    myChart_50.setOption(chartOption1_6_4,{notMerge:true});
    var myChart_50plus = echarts.init(
      document.getElementsByClassName("chart-zuixing-50plus")[0]
    );

    myChart_50plus.setOption(chartOption1_6_5,{notMerge:true});
    window.addEventListener("resize", function () {
      myChart_10.resize();
      myChart_15.resize();
      myChart_25.resize();
      myChart_35.resize();
      myChart_50.resize();
      myChart_50plus.resize();
    });
  }

  function chart_qipao() {
    var myChart = echarts.init(
      document.getElementsByClassName("chart-qipao")[0]
    );
    myChart.setOption(chartOption1_2);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
    return myChart;
  }

  function chart_shuibo() {
    var myChart_fadongji = echarts.init(
      document.getElementsByClassName("chart-shuibo-fadongji")[0]
    );
    myChart_fadongji.setOption(chartOption3_3_0);

    var myChart_biansuqi = echarts.init(
      document.getElementsByClassName("chart-shuibo-biansuqi")[0]
    );
    myChart_biansuqi.setOption(chartOption3_3_1);

    var myChart_liheqi = echarts.init(
      document.getElementsByClassName("chart-shuibo-liheqi")[0]
    );
    myChart_liheqi.setOption(chartOption3_3_2);

    var myChart_zhuanxiang = echarts.init(
      document.getElementsByClassName("chart-shuibo-zhuanxiang")[0]
    );
    myChart_zhuanxiang.setOption(chartOption3_3_3);

    var myChart_zhidong = echarts.init(
      document.getElementsByClassName("chart-shuibo-zhidong")[0]
    );
    myChart_zhidong.setOption(chartOption3_3_4);

    var myChart_luntai = echarts.init(
      document.getElementsByClassName("chart-shuibo-luntai")[0]
    );
    myChart_luntai.setOption(chartOption3_3_5);

    var myChart_xuangua = echarts.init(
      document.getElementsByClassName("chart-shuibo-xuangua")[0]
    );
    myChart_xuangua.setOption(chartOption3_3_6);

    var myChart_cheshen = echarts.init(
      document.getElementsByClassName("chart-shuibo-cheshen")[0]
    );
    myChart_cheshen.setOption(chartOption3_3_7);

    window.addEventListener("resize", function () {
      myChart_fadongji.resize();
      myChart_liheqi.resize();
      myChart_zhuanxiang.resize();
      myChart_biansuqi.resize();
      myChart_cheshen.resize();
      myChart_xuangua.resize();
      myChart_luntai.resize();
      myChart_zhidong.resize();
    });
  }

  // 召回缺陷词云
  function chart_wordcloud(words, target) {
    var myChart_word_cloud = echarts.init(
      document.getElementsByClassName(target)[0]
    );

    var data = {
      value: words,
      image: model_ciyun_qiche,
    };
    var maskImage = new Image();
    maskImage.src = data.image;

    maskImage.onload = function () {
      myChart_word_cloud.setOption({
        tooltip: {
          show: false,
        },
        textPadding: 0,
        autoSize: {
          enable: true,
          minSize: 6,
        },

        series: [
          {
            type: "wordCloud",
            gridSize: 1,
            sizeRange: [12, 50],
            rotationRange: [-45, 0, 45, 90],
            maskImage: maskImage,
            textStyle: {
              normal: {
                color: function () {
                  return (
                    "rgb(" +
                    Math.round(Math.random() * 255) +
                    ", " +
                    Math.round(Math.random() * 255) +
                    ", " +
                    Math.round(Math.random() * 255) +
                    ")"
                  );
                },
              },
            },
            left: "center",
            top: "center",
            width: "96%",
            height: "70%",
            right: null,
            bottom: null,
            // width: 1800,
            // height: 780,
            // top: 20,
            data: data.value,
          },
        ],
      });
    };

    window.addEventListener("resize", function () {
      myChart_word_cloud.resize();
    });
  }

  // 口碑信息排行
  function chart_paihang() {
    var myChart1 = echarts.init(
      document.getElementsByClassName("chart-xiangxing")[0]
    );

    myChart1.setOption(chartOption2_1);

    window.addEventListener("resize", function () {
      myChart1.resize();
    });
    return myChart1;
  }

  function show_article(_array, target) {
    var plist1 = "<div class='article-box'><div class='title-box'>";
    var plist2 = "<div class='article-box'><div class='title-box'>";
    _array.forEach(function (a,i) {
      let item='<div class="article-title" url="' + a.url + '">' + a.name + "</div>";
      if(i>(_array.length/2)){
        plist2 +=item;
      }else{
        plist1 +=item;
      }
    });
    plist1 += "</div></div>";
    plist2 += "</div></div>";
    $(target).append(plist1);
    $(target).append(plist2);

    $(".article-title").click(function (e, a) {
      layer.open({
        type: 1,
        title: false,
        closeBtn: 2,
        shade: 0.5,
        anim: 1,
        shadeClose: true,
        skin: "dioalog-defind",
        area: ["2880px", "1425px"],
        offset: "auto",
        content:
          "<div class='dioalog-box'><iframe src=" +
          $(e.target).attr("url") +
          "></iframe></div>",
      });
    });
  }

  // 售价区间-销售情况
  function chart_duidie() {
    var myChart = echarts.init(
      document.getElementsByClassName("chart-duidie")[0]
    );
    myChart.setOption(chartOption1_3);

    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }

  // 热门品牌投诉数量走势
  function chart_tousu_zhexian() {
    var myChart_pingpai_tousu = echarts.init(
      document.getElementsByClassName("chart-tousu-zhexian")[0]
    );

    myChart_pingpai_tousu.setOption(chartOption3_1);
    window.addEventListener("resize", function () {
      myChart_pingpai_tousu.resize();
    });
    return myChart_pingpai_tousu;
  }

  // 速腾近一年投诉问题分布
  function tousu_question() {
    // 发动机
    var myChart_fadongji = echarts.init(
      document.getElementsByClassName("chart-fadongji")[0]
    );
    myChart_fadongji.setOption(chartOption3_4_0);

    // 变速器
    var myChart_biaosuqi = echarts.init(
      document.getElementsByClassName("chart-biansuqi")[0]
    );
    myChart_biaosuqi.setOption(chartOption3_4_1);

    // 离合器
    var myChart_liheqi = echarts.init(
      document.getElementsByClassName("chart-liheqi")[0]
    );
    myChart_liheqi.setOption(chartOption3_4_2);

    // 转向系统
    var myChart_zhuanxiang = echarts.init(
      document.getElementsByClassName("chart-zhuanxiang")[0]
    );
    myChart_zhuanxiang.setOption(chartOption3_4_3);

    // 制动系统
    var myChart_zhidong = echarts.init(
      document.getElementsByClassName("chart-zhidong")[0]
    );
    myChart_zhidong.setOption(chartOption3_4_4);

    // 轮胎
    var myChart_luntai = echarts.init(
      document.getElementsByClassName("chart-luntai")[0]
    );
    myChart_luntai.setOption(chartOption3_4_5);

    // 前后桥及悬挂系统
    var myChart_xuangua = echarts.init(
      document.getElementsByClassName("chart-xuangua")[0]
    );
    myChart_xuangua.setOption(chartOption3_4_6);

    // 车身附件及电器
    var myChart_cheshen = echarts.init(
      document.getElementsByClassName("chart-cheshen")[0]
    );
    myChart_cheshen.setOption(chartOption3_4_7);

    window.addEventListener("resize", function () {
      myChart_fadongji.resize();
      myChart_biansuqi.resize();
      myChart_liheqi.resize();
      myChart_zhuanxiang.resize();
      myChart_zhidong.resize();
      myChart_luntai.resize();
      myChart_xuangua.resize();
      myChart_cheshen.resize();
    });

    return {'发动机':myChart_fadongji,'变速器':myChart_biaosuqi,'离合器':myChart_liheqi,'转向系统':myChart_zhuanxiang,'制动系统':myChart_zhidong,'轮胎':myChart_luntai,'前后桥及悬挂系统':myChart_xuangua,'车身附件及电器':myChart_cheshen};
  }

  // 车系口碑印象分布
  function koubei_yinixiang() {
    // 发动机
    myChart_yixiang_zuzhuang = echarts.init(
      document.getElementsByClassName("chart-yinxiang-zhuzhuang")[0]
    );
    myChart_yixiang_zuzhuang.setOption(chartOption2_4);
    window.addEventListener("resize", function () {
      myChart_yixiang_zuzhuang.resize();
    });
  }

  // 3-5年百车故障数分布
  function chart_35fault() {
    var myChart_10 = echarts.init(
      document.getElementsByClassName("chart-35fault-10")[0]
    );
    myChart_10.setOption(chartOption2_6_0,{notMerge:true});

    var myChart_15 = echarts.init(
      document.getElementsByClassName("chart-35fault-15")[0]
    );
    myChart_15.setOption(chartOption2_6_1,{notMerge:true});

    var myChart_25 = echarts.init(
      document.getElementsByClassName("chart-35fault-25")[0]
    );
    myChart_25.setOption(chartOption2_6_2,{notMerge:true});

    var myChart_35 = echarts.init(
      document.getElementsByClassName("chart-35fault-35")[0]
    );
    myChart_35.setOption(chartOption2_6_3,{notMerge:true});

    var myChart_50 = echarts.init(
      document.getElementsByClassName("chart-35fault-50")[0]
    );
    myChart_50.setOption(chartOption2_6_4,{notMerge:true});

    var myChart_50plus = echarts.init(
      document.getElementsByClassName("chart-35fault-50plus")[0]
    );
    myChart_50plus.setOption(chartOption2_6_5,{notMerge:true});

    window.addEventListener("resize", function () {
      myChart.resize();
      myChart1.resize();
      myChart2.resize();
    });
  }
  // 2-12百车故障数分布
  function chart_212fault() {
    var myChart_10 = echarts.init(
      document.getElementsByClassName("chart-212fault-10")[0]
    );
    myChart_10.setOption(chartOption2_5_0,{notMerge:true});

    var myChart_15 = echarts.init(
      document.getElementsByClassName("chart-212fault-15")[0]
    );
    myChart_15.setOption(chartOption2_5_1,{notMerge:true});

    var myChart_25 = echarts.init(
      document.getElementsByClassName("chart-212fault-25")[0]
    );
    myChart_25.setOption(chartOption2_5_2,{notMerge:true});

    var myChart_35 = echarts.init(
      document.getElementsByClassName("chart-212fault-35")[0]
    );
    myChart_35.setOption(chartOption2_5_3,{notMerge:true});

    var myChart_50 = echarts.init(
      document.getElementsByClassName("chart-212fault-50")[0]
    );
    myChart_50.setOption(chartOption2_5_4,{notMerge:true});

    var myChart_50plus = echarts.init(
      document.getElementsByClassName("chart-212fault-50plus")[0]
    );
    myChart_50plus.setOption(chartOption2_5_5,{notMerge:true});
    window.addEventListener("resize", function () {
      myChart.resize();
      myChart1.resize();
      myChart2.resize();
    });
  }
});
