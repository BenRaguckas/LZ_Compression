const $ = (selector) => document.querySelector(selector);       //  Nicer bread and butter
var TABLE = $("#table");
document.addEventListener("DOMContentLoaded", () => {
    getData("charstream.txt").then(response =>{
        console.log(response);
        var str = response.replace(/(?:\r\n|\r|\n)/g, '');
        LZ77table(str);
    })
});

const LZ77table = (stream) => {
    var CodeStream = [];
    var Display = [];
    var Memory = ["","","","","","","","","","","","","","","",""];
    var StreamIndex = 0;
    var highlight;
    for (let i =0 ; i < 16 ; i++){
        StreamIndex++;
        Display.push([...stream][i]);
    }
    var extraRun = 0;
    while(extraRun <2){
        var check = checkStream(Memory,Display);
        if (check[0] > -1){
            printLine(Memory,Display,CodeStream[CodeStream.length-1],highlight);
            CodeStream.push([check[0],check[1]]);
            highlight = CodeStream[CodeStream.length-1];
            pushStream(Memory,Display,stream,check[1],StreamIndex);
            StreamIndex+=check[1];
        }
        else{
            printLine(Memory,Display,CodeStream[CodeStream.length-1],highlight);
            CodeStream.push(Display[0]);
            highlight = CodeStream[CodeStream.length-1];
            pushStream(Memory,Display,stream,1,StreamIndex);
            StreamIndex++;
        }
        if (Display[0]=="")
            extraRun++;
    }
    console.log(Memory,Display,CodeStream);
    console.log("--------------------------")
}
const printLine = (First,Second,OP="",high) => {
    var row = $("#table").insertRow(-1);
    for (let i = 0; i < 16; i++){
            row.insertCell(i).innerHTML = First[i];
    }
    row.insertCell(16).innerHTML = "..";
    for (let i = 0; i < 16; i++){
        row.insertCell(17+i).innerHTML = Second[i];
    }
    if (Array.isArray(OP))
        row.insertCell(33).innerHTML = "&lt;"+OP[0].toString(16)+":"+OP[1]+"&gt;";
    else
        row.insertCell(33).innerHTML = OP;

    
    if (!Array.isArray(high))
        high = [16,1];
    for (let i = 0; i < 16; i++){
        if (i >= high[0] && i < high[0]+high[1]){
            var temp = row.previousSibling;
            temp.cells[i].innerHTML = "<b>"+temp.cells[i].innerHTML+"</b>";
        }
        // if (i >= 0 && i < high[1]){
        //     var temp = row//.previousSibling;
        //     temp.cells[16+i].innerHTML = "<b>"+temp.cells[16+i].innerHTML+"</b>";
        // }
    }
    /*
    
        
        else*/
}
const checkStream = (First,Second) => {
    var checking = true;
    var entry = 0;
    var potential = [];
    while (checking && entry < 16){
        var result = First.indexOf(Second[0],entry);
        var cons = 0;
        if(result > -1 && result < 15){
            cons++;
            for (let j = result+1; j < 16; j++){
                if(First[j] == Second[cons]){
                    cons++;
                }
                else{
                    j=16;
                }
            }
            if (cons > 1){
                potential[entry] = [result,cons];
            }
        }
        else
            checking = false;
        entry++;
    }
    if (potential.length > 0){
        if (potential.length > 1){
            potential.sort((a,b) => {return b[1]-a[1];});
            return potential[0];
        }
        else {
            return potential[0];
        }
    }
    return [-1,-1];
}
const pushStream = (First,Second,stream,n,POS) => {
    //  Shift the first display
    for (let i = 0; i < 16; i++){
        First[i]=First[i+n];
    }
    //  Drop some Data
    for (let i= 0 ; i < n ; i++){
        First[16-n+i]=Second[i];
    }
    //  Shift the Memory
    for (let i = 0; i < 16; i++){
        Second[i]=Second[i+n];
    }
    //  Get Memory
    for (let i= 0 ; i < n ; i++){
        if (POS+i > [...stream].length-1){
            Second[16-n+i]="";
        }
        else
            Second[16-n+i]=[...stream][POS+i];
    }
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