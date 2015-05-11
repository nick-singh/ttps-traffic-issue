(function (document, window, $, Backbone, _){

    TRACKER.Chart = {

         genChart : function(id, titleTx, subtitleTx, xAxisD, yAxisD, seriesD1, seriesName1){        
        
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
                xAxis: {
                    categories: xAxisD
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: yAxisD,
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' total'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    console.log(this.category);
                                    for (var i = 0; i < this.series.data.length; i++) {
                                        this.series.data[i].update({ color: '#7cb5ec' }, true, false);
                                    }
                                    this.update({ color: '#389868' }, true, false);
                                    window.location.hash = "#tweetList/"+this.category;                                    
                                }
                            }
                        }
                    },
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: seriesName1,
                    data: seriesD1
                }]
            });
         }
    }
    // $(window).trigger("resize");
}(document, this, jQuery, Backbone, _));                