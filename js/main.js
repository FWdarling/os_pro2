
var blockNum = 4, instructionNum = 320;
var memory = Array(); 
var missingPages = 0; 
var currentIns;
var runTimesCnt = 0;
var bIsMissing;
var memoryBlock;
var fifoQueue = Array();
var lruQueue = Array();


var currentInsSpan = document.getElementById("current_instruction");
var physicalMemSpan = document.getElementById("physical_memory");
var memoryBlockSpan = document.getElementById("memory_block");
var isMissingSpan = document.getElementById("bpage_missing");
var missingPageRateSpan = document.getElementById("miss_page_rate");

function getRandInt(min, max){
    if(min > max) min -= max;
    if(min === max) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;

}


function initialize(){
    memory = [];
    fifoQueue = [];
    lruQueue = [];
    missingPages = 0;
    currentIns = getRandInt(0, 319);
    runTimesCnt = 0;
    bIsMissing = false;
    memoryBlock = -1;

    currentInsSpan.textContent = "null";
    physicalMemSpan.textContent = "null";
    memoryBlockSpan.textContent = "null";
    isMissingSpan.textContent = "null";
    missingPageRateSpan.textContent = 0;

    document.getElementById("algorithm").disabled = false;
    document.getElementById("execution").disabled = false;
    document.getElementById("run-btn").disabled = false;

    var table = document.getElementById("tbody");
    table.lastChild.remove();
}

function updatePage(){
    currentInsSpan.textContent = currentIns;
    physicalMemSpan.textContent = ("第" + (Math.floor(currentIns / 10) + 1) + "页的首地址+" + (currentIns % 10));
    memoryBlockSpan.textContent = memoryBlock;
    isMissingSpan.textContent = (bIsMissing ? "是" : "否");
    missingPageRateSpan.textContent = Math.round(missingPages / runTimesCnt * 100) + "%";
}

function findPage(page, mem){
    for(var i = 0; i < mem.length; i++){
        if(mem[i] === page)  return i;
    }
    return -1;
}

function FIFO(ins){
    var page = Math.floor(ins / 10);
    var findRes = findPage(page, memory);
    var tag = false;
    //命中
    if(findRes >= 0){
        memoryBlock = findRes + 1;
        bIsMissing = false;
    }
    
    //不命中
    else{
        bIsMissing = true;
        missingPages++;
        var length = memory.length;
        //调入
        if(length < 4){
            memory[length] = page;
            memoryBlock = length + 1;
            fifoQueue[length] = page;
        }
        //替换
        else{
            tag = true;
            var pageReplaced = fifoQueue[0];
            var memReplaced = findPage(pageReplaced, memory);
            memory[memReplaced] = page;
            memoryBlock = memReplaced + 1;
            for(var i = 0; i < 3; i++){
                fifoQueue[i] = fifoQueue[i + 1];
            }
            fifoQueue[3] = page;
        }
    }
    var newRow = document.getElementById("tbody").insertRow();
    newRow.insertCell(0).innerHTML = ins;
    newRow.insertCell(1).innerHTML = memory[0] == undefined ? "Empty" : memory[0];
    newRow.insertCell(2).innerHTML = memory[1] == undefined ? "Empty" : memory[1];
    newRow.insertCell(3).innerHTML = memory[2] == undefined ? "Empty" : memory[2];
    newRow.insertCell(4).innerHTML = memory[3] == undefined ? "Empty" : memory[3];
    if(findRes >= 0){
        newRow.insertCell(5).innerHTML = "命中: " + ins + "在第" + (findRes + 1) + "块内存中";
    }
    else if(!tag){
        newRow.insertCell(5).innerHTML = "缺页调入: 将第" + page + "页调入第" + memoryBlock + "块内存";
    }
    else{
        newRow.insertCell(5).innerHTML = "缺页替换: 将第" + memoryBlock + "块内存替换为第" + page + "页";
    }
}

function LRU(ins){
    var page = Math.floor(ins / 10);
    var findRes = findPage(page, memory);
    var tag = false;
    //命中
    if(findRes >= 0){
        memoryBlock = findRes + 1;
        bIsMissing = false;
        lruQueue[findRes] = runTimesCnt;
    }
    
    //不命中
    else{
        bIsMissing = true;
        missingPages++;
        var length = memory.length;
        //调入
        if(length < 4){
            memory[length] = page;
            memoryBlock = length + 1;
            lruQueue[length] = runTimesCnt;
        }
        //替换
        else{
            tag = true;
           var leastInsIndex, leastIns = 100000;
           for(var i = 0; i < 4; i++){
                if(lruQueue[i] < leastIns){
                    leastIns = lruQueue[i];
                    leastInsIndex = i;
                }
           }
           memory[leastInsIndex] = page;
           memoryBlock = leastInsIndex + 1;
           lruQueue[leastInsIndex] = runTimesCnt;
        }
    }
    var newRow = document.getElementById("tbody").insertRow();
    newRow.insertCell(0).innerHTML = ins;
    newRow.insertCell(1).innerHTML = memory[0] == undefined ? "Empty" : memory[0];
    newRow.insertCell(2).innerHTML = memory[1] == undefined ? "Empty" : memory[1];
    newRow.insertCell(3).innerHTML = memory[2] == undefined ? "Empty" : memory[2];
    newRow.insertCell(4).innerHTML = memory[3] == undefined ? "Empty" : memory[3];
    if(findRes >= 0){
        newRow.insertCell(5).innerHTML = "命中: " + ins + "在第" + (findRes + 1) + "块内存中";
    }
    else if(!tag){
        newRow.insertCell(5).innerHTML = "缺页调入: 将第" + page + "页调入第" + memoryBlock + "块内存";
    }
    else{
        newRow.insertCell(5).innerHTML = "缺页替换: 将第" + memoryBlock + "块内存替换为第" + page + "页";
    }
}


function run(algo){
    runTimesCnt++;
    if(runTimesCnt % 2 === 0) currentIns++;
    else if(runTimesCnt % 4 === 1) currentIns = getRandInt(0, currentIns);
    else currentIns = getRandInt(currentIns, 319);
    if(currentIns > 319) currentIns -= 319;
    if(algo === "FIFO") FIFO(currentIns);
    else if(algo === "LRU") LRU(currentIns);
}

function start(){
    if(!runTimesCnt)   initialize();
    var selectBox = document.getElementById("algorithm");
    var algo = selectBox.value;
    selectBox.disabled = true;
    selectBox = document.getElementById("execution");
    var exec = selectBox.value;
    selectBox.disabled = true;
    if(exec === "step") {
        run(algo);
        updatePage();
    }
    else if(exec === "simulation"){
        for(var i = 0; i < 320; i++) run(algo);
        updatePage();
        document.getElementById("run-btn").disabled = true;
    }
}
