angular
    .module('app')
    .factory('graphService', graphService);

graphService.$inject = [];


function graphService() {
    console.log("Graph services");
    var vm = this;
    var isInitialized = false;
    vm.initNewGraph = false;
    vm.pointLabels = false;
    var boardAttributes = {
        boundingbox: [-10, 10, 10, -10],
        axis: true,
        grid: true,
        showcopyright: false,
        shownavigation: false,
        registerEvents: true,
        snapToGrid: true,
        snapSizeX: 1,
        snapSizeY: 1 
    };
    var lineAttributes = {
        strokeColor: '#404c69',
        highlightStrokeColor: '#111111',
        strokeColorOpacity: 1,
        dash: 0,
        strokeWidth: 2,
        straightFirst: true,
        straightLast: true,
        firstArrow: false,
        lastArrow: false,
        trace: false,
        shadow: false,
        visible: true,
        margin: -15
    };

    var pointsArray = [{
        name: 'A',
        x: 1,
        y: 1,
        face: 'x',
        size: 4
    }, {
        name: 'B',
        x: 2,
        y: 2,
        face: 'x',
        size: 4
    }];
    var graphType = 'line';

    var service = {
        initialized: initialized,
        setInitialized: setInitialized,
        setInitNewGraph: setInitNewGraph,
        getInitNewGraph: getInitNewGraph,
        setBoardAttributes: setBoardAttributes,
        getBoardAttributes: getBoardAttributes,
        getPointsArray: getPointsArray,
        setPointsArray: setPointsArray,
        //graphType: graphType,
        setGraphType: setGraphType,
        getGraphType: getGraphType,
        getLineAttributes: getLineAttributes,
        setLineAtrributes: setLineAtrributes
       // setPointLabels: setPointLabels,
       // getPointLabels: getPointLabels
    };

    return service;



    function initialized() {
        return isInitialized;
    }

    function setInitialized(val) {
        isInitialized = val;
    }

    function getPointsArray() {
        return pointsArray;
    }

    function setPointsArray(pointsData) {

   
        

        pointsArray = [{
            name: 'A',
            x: x1,
            y: y1,
            face: 'o',
            size: 4
        }, {
            name: 'B',
            x: x2,
            y: y2,
            face: 'o',
            size: 4
        }];
    }

    function setBoardAttributes(val){
        boardAttributes = val;
    }

    function getBoardAttributes(){
        return boardAttributes;
    }

    function setInitNewGraph(val) {
        if (vm.initNewGraph == undefined) {
            vm.initNewGraph = true;
        }
        vm.initNewGraph = val;
    }

    function getInitNewGraph() {
        return vm.initNewGraph;
    }

    function randomNumber(min, max) {
        console.log("random numbers, min, max: " + min + ", " + max)

        var ranNum = Math.floor(Math.random()*(max-min+1)+min);
        console.log("random number is " + ranNum);
        return ranNum;
    }
    function getGraphType(){
        return graphType;
    }

    function setGraphType(val){
        graphType = val;
    }

    function setLineAtrributes() {
        lineAttributes = {
            strokeColor: '#404c69',
            highlightStrokeColor: '#111111',
            strokeColorOpacity: 1,
            dash: 0,
            strokeWidth: 2,
            straightFirst: true,
            straightLast: true,
            firstArrow: false,
            lastArrow: false,
            trace: false,
            shadow: false,
            visible: true,
            margin: -15
        };
    }

    function getLineAttributes() {
        return lineAttributes;
    }



//labels are used with mathjax
/*    function setPointLabels(val){
        vm.pointLabels = val;
    }
    function getPointLabels(){
        return vm.pointLabels;
    }*/
}