/**
 * Created by p5030 on 2017/6/3.
 */
attributeList = {
    unemploymentPeople_thousand:"失業人數(千人)",
    unemploymentPeople_rate:"失業率",
    unemploymentPeople_count:"未參與勞動原因人數 合計人數(千人)",
    want2work:"想工作而未找到工作且隨時可以開始工作人數(千人)",
    education:"求學及準備升學(千人)",
    house_people :"料理家務(千人)",
    oldAndWeak:"高齡及身心障礙",
    other:"其他"

}
function fillColor(color,attribute){
    d3.select("svg").selectAll("path").data(features).attr({
        d: path,

        fill: function(d) {
            return color(ArrayList[d.properties.name]);
        },

    }).on("mouseover",function (d) {
        $("#county").text(d.properties.name);
        $("#attribute").text(attributeList[attribute]+" : "+ArrayList[d.properties.name]);
        $(this).css("stroke","black")
        $(this).css("stroke-width","4")
    }).on("mouseout",function(d){
        $(this).css("stroke","none")
        $("#county").text("請將滑鼠移動");
        $("#attribute").text("至你想要看的縣市");
    })
}
function refresh(countys,attributes,range){
    d3.json("counties.json", function(topodata) {
        ArrayList = []

        d3.csv("workLessPeople.csv", function(error, data) {
            var min=data[0][attributes]
            var max=data[0][attributes]

            for (var i = 0; i < data.length; i++) {
                var county = data[i][countys];
                var count = data[i][attributes]
               // if(count=="")count=0
                if( parseInt(count)>max){

                    max = count
                }
                if( parseInt(count)<min){

                    min = count
                }
                ArrayList[county] = count
            }

            if (error) throw error;
            features = topojson.feature(topodata, topodata.objects.map).features;
            //console.log(features)
            // 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名

            path = d3.geo.path().projection( // 路徑產生器
                d3.geo.mercator().center([121, 24]).scale(8000) // 座標變換函式
            );

            d3.select("svg").selectAll("path").data(features)
                .enter().append("path").attr("d", path);

            for (i = features.length - 1; i >= 0; i--) {
                features[i].properties.count = ArrayList[features[i].properties.name];
            }
            var color = d3.scale.linear().domain([min,max]).range(range);
            //console.log(color)

        fillColor(color,attributes);
            var width  = "100%",
                height = 10,
                padding = 80;

            var w = 140, h = 400;

            var key = d3.select("body").append("svg").attr("width", w).attr("height", h);

            var legend = key.append("defs").append("svg:linearGradient").attr("id", "gradient").attr("x1", "100%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%").attr("spreadMethod", "pad");

            legend.append("stop").attr("offset", "0%").attr("stop-color", color(max)).attr("stop-opacity", 1);

            legend.append("stop").attr("offset", "100%").attr("stop-color", color(min)).attr("stop-opacity", 1);

            key.append("rect").attr("width", w - 100).attr("height", h - 100).style("fill", "url(#gradient)").attr("transform", "translate(0,10)");

            var y = d3.scale.linear().range([300, 0]).domain([min, max]);

            var yAxis = d3.svg.axis().scale(y).orient("right");

            key.append("g").attr("class", "y axis").attr("transform", "translate(41,10)").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 30).attr("dy", ".71em").style("text-anchor", "end");

    });
})}

refresh("reigon","other",["#fff77e", "#ff2628"])