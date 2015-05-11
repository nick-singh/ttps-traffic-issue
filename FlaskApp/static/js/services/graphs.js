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


})(jQuery);