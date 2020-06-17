
var blockNum = 4, instructionNum = 320;
var memory = Array(blockNum); //�ڴ��
var missingPages = 0; //ȱҳ����
var currentIns;//��ǰָ��
var runTimesCnt = 0;//���д���
var bIsMissing;//��ǰָ���Ƿ�ȱҳ
var memoryBlock;//��ǰָ�������ڴ��


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
}

function updatePage(){
    currentInsSpan.textContent = currentIns;
    physicalMemSpan.textContent = ("第" + Math.floor(currentIns / 10) + "页的首地址+" + (currentIns % 10));
    memoryBlockSpan.textContent = memoryBlock;
    isMissingSpan.textContent = (bIsMissing ? "是" : "否");
    missingPageRateSpan.textContent = Math.round(missingPages / runTimesCnt * 100) + "%";
}

function FIFO(ins){

}

function LRU(ins){

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
