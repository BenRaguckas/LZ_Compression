const $ = (selector) => document.querySelector(selector);       //  Nicer bread and butter
var TABLE = $("#table");
document.addEventListener("DOMContentLoaded", () => {
    getData("charstream.txt").then(response =>{
        console.log(response);
        var str = response.replace(/(?:\r\n|\r|\n)/g, '');
        LZWtable(str);
    })
});

const LZWtable = (stream) => {
    var P = "";
    var PC = "";
    var Dict = ["A","B","C","D","E","F","G"];
    var CodeStream = [];
    var count = 0;
    var count2 = 0;
    [...stream].forEach(C => {
        count++;
        PC = P+C;
        if (Dict.indexOf(PC) != -1){
            pushRow(count,P,C);
            P = PC;
        }
        else{
            count2++;
            Dict.push(PC);
            addRow(count,P,C,Dict,Dict.indexOf(P)+1,count2);
            CodeStream.push(Dict.indexOf(P)+1);
            P = C;
        }
    });
    addRow(count+1,P,"","",Dict.indexOf(P)+1,"");
    var csl = CodeStream.length;
    var sl = stream.length-1;
    console.log("Codestream lenght = "+csl);
    console.log("Charstream lenght = "+sl);
    console.log("Compression = "+((1-((csl+7)/sl))*100)+"%");
}
const addRow = (id,P,C,Dict,OP,n) => {
    if (Dict!="")
        var DictID = Dict.length;
    else{
        DictID = " ";
        Dict = ["",""];
    }
    $("#table").innerHTML +=    "<tr><td>"+id+"</td>"+
                                "<td>"+n+"</td>"+
                                "<td>"+P+"</td>"+
                                "<td>"+C+"</td>"+
                                "<td>"+OP+"</td>"+
                                "<td>"+Dict[Dict.length-1]+"</td>"+
                                "<td>"+DictID+"</td></tr>";
}
const pushRow = (id,P,C) => {
    $("#table").innerHTML +=    "<tr><td>"+id+"</td>"+
                                "<td></td>"+
                                "<td>"+P+"</td>"+
                                "<td>"+C+"</td>"+
                                "<td></td>"+
                                "<td></td>"+
                                "<td></td></tr>";
}


const getData = (link) => {
    return new Promise((resolve) =>{
        var xhr = new XMLHttpRequest();
        xhr.responseType = "string";
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(xhr.response);
            }
        };
        xhr.open("GET", link);
        xhr.send();
    });
};