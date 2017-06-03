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

        fillColor(color,attributes)

    });
})}

refresh("reigon","other",["#fff77e", "#ff2628"])