(function($){


  window.arborGraph = {

    draw : function(id, obj){

      var sys = arbor.ParticleSystem(10000, 400,1);
      sys.parameters({gravity:true});
      sys.renderer = Renderer(id);      
      var nodes = {},
      edges = {};
      if(obj instanceof Array){
        $.each(obj, function(index, data){  

          nodes[data.hashtag] = {'color':arborGraph.colour(),'shape':'dot','label':data.hashtag, "link":data.hashtag}; 
          edges[data.hashtag] = {};

          $.each(data.assoication, function(i, d){
            nodes[i] = {'color':arborGraph.colour(),'shape':'dot','label':i, 'link': i}; 
            edges[data.hashtag][i] = nodes[i];
          });        
        });  

      }else{
        if(Object.keys(obj.assoication).length === 0){
          nodes[obj.hashtag] = {'color':arborGraph.colour(),'shape':'dot','label':obj.hashtag, 'link' :obj.hashtag}; 
          nodes['No Related Hashtags'] = {'color':arborGraph.colour(),'shape':'dot','label':'No Related Hashtags', 'link' :'none'}; 
          edges[obj.hashtag] = {};
          edges[obj.hashtag]['No Related Hashtags'] = nodes['No Related Hashtags'];
        }else{          
          edges[obj.hashtag] = {};
          nodes[obj.hashtag] = {'color':arborGraph.colour(),'shape':'dot','label':obj.hashtag, 'link' :obj.hashtag}; 
          $.each(obj.assoication, function(i, d){
            nodes[i] = {'color':arborGraph.colour(),'shape':'dot','label':i, 'link' :i}; 
            edges[obj.hashtag][i] = nodes[i];
          });
        }        
      }
      
      var graphData = {
        nodes : nodes,
        edges : edges
      };
      sys.graft(graphData);
    },

    colour : function(){
      return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    }        
  };


  window.Charts = {
    genColChart : function(id, titleTx, subtitleTx, data){        
        
        $(id).highcharts({
          chart: {
            type: 'column'
          },
          title: {
              text: titleTx
          },
          subtitle: {
              text: subtitleTx
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '13px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Trending Hashtag'
              }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Trending Hashtags: <b>{point.y:.1f} tweets  </b>'
          },
          series: [{
              name: 'hahstags',
              data: data,
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '13px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              },
              cursor: 'pointer',
              point: {
                  events: {
                      click: function() {                          
                        window.location.hash = "#/hashtag/"+this.name;                                  
                      }
                  }
              }
          }]
        });
     },


    genBarChart : function(id, titleTx, subtitleTx, xAxisD, yAxisD, seriesD1, seriesD2){  
        
        $(id).highcharts({
          chart: {
              type: 'bar'
          },

          title: {
              text: titleTx
          },
          subtitle: {
              text: subtitleTx
          },
          xAxis: [{
              categories: xAxisD,
              reversed: false,
              labels: {
                  step: 1
              }
          }, { // mirror axis on right side
              opposite: true,
              reversed: false,
              categories: xAxisD,
              linkedTo: 0,
              labels: {
                  step: 1
              }
          }],
          yAxis: {
              title: {
                  text: null
              },
              labels: {
                  formatter: function () {                      
                      return this.value = ((this.value < 0) ? this.value * -1: this.value);                      
                  }
              }
          },

          plotOptions: {
              series: {
                  stacking: 'normal'
              }
          },

          tooltip: {
              formatter: function () {
                  var val = ((this.y < 0) ? this.y * -1: this.y)
                  return '<b>' + val + ' '+ this.series.name +' '+ this.point.category + '</b><br/>';
              }
          },

          series: [{
              name: 'Negative',
              data: seriesD2,
              cursor: 'pointer',
              point: {
                events: {
                    click: function() {                        
                      window.location.hash = "#/hashtag/"+this.category;                                  
                    }
                }
              }
          }, {
              name: 'Positive',
              data: seriesD1,
              cursor: 'pointer',
              point: {
                  events: {
                      click: function() {                          
                        window.location.hash = "#/hashtag/"+this.category;                                  
                      }
                  }
              }
          }]
        });
     },


     genSplineChart : function(id, titleTx, subtitleTx, xAxisD, yAxis_text, seriesD){  

        if(seriesD.length === 2){
          $.each(seriesD[1].data, function(i, d){
            seriesD[1].data[i] = seriesD[1].data[i] * -1;            
          });
        }
        
        $(id).highcharts({
          chart: {
              type: 'spline'
          },
          title: {
              text: titleTx
          },
          subtitle: {
              text: subtitleTx
          },
          xAxis: {
              categories: xAxisD,
              type: 'datetime',
          },
          yAxis: {
              title: {
                  text: yAxis_text
              }
          },
          tooltip: {
              crosshairs: true,
              shared: true
          },
          plotOptions: {
              spline: {
                  marker: {
                      radius: 4,
                      lineColor: '#666666',
                      lineWidth: 1
                  }
              }
          },
          series: seriesD
      });
     }
  }


})(jQuery);