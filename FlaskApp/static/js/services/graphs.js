(function($){

  window.Graphs = {
    
    graph : function(obj){
      var g = new Springy.Graph();

      $.each(obj, function(index, data){        
        g.addNodes(data.hashtag);

        $.each(data.assoication, function(i, d){
          g.addNodes(i);          
          g.addEdges([data.hashtag, i , {color: Graphs.colour(), label: d}])
        });        
      });

      return g;

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
                          console.log(this.name);
                          // for (var i = 0; i < this.series.data.length; i++) {
                          //     this.series.data[i].update({ color: '#7cb5ec' }, true, false);
                          // }
                          // this.update({ color: '#389868' }, true, false);
                          // window.location.hash = "#tweetList/"+this.category;                                    
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
                        console.log(this.category);
                        // for (var i = 0; i < this.series.data.length; i++) {
                        //     this.series.data[i].update({ color: '#7cb5ec' }, true, false);
                        // }
                        // this.update({ color: '#389868' }, true, false);
                        // window.location.hash = "#tweetList/"+this.category;                                    
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
                          console.log(this.category);
                          // for (var i = 0; i < this.series.data.length; i++) {
                          //     this.series.data[i].update({ color: '#7cb5ec' }, true, false);
                          // }
                          // this.update({ color: '#389868' }, true, false);
                          // window.location.hash = "#tweetList/"+this.category;                                    
                      }
                  }
              }
          }]
        });
     }
  }


})(jQuery);