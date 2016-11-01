angular
    .module('app')
    .factory('graphService', graphService);

graphService.$inject = [];

function graphService() {
    var vm = this;
    var isInitialized = false;
    vm.initNewGraph = false;
    vm.pointLabels = false;
   // var objectList = [];

    //initial board attributes 
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

    //initial line attributes
    var lineAttributes = {
        strokeColor: '#404c69',
        highlightStrokeColor: '#111111',
        strokeColorOpacity: 1,
        dash: 0,
        strokeWidth: 2,
        straightFirst: false,
        straightLast: false,
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
        setLineAtrributes: setLineAtrributes,
        buildFunction: buildFunction,
        buildBoxPlotBoxes: buildBoxPlotBoxes,
        buildCircle: buildCircle,
       // buildLine: buildLine,
        //buildPoint: buildPoint
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
        var ranNum = Math.floor(Math.random()*(max-min+1)+min);
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



    function buildFunction(board, fn, lineAttr){
        return board.create('functiongraph', [function(x) {
                    //return x+2;
                    return fn(x);
                }],
                lineAttr);
    }

    //creates a line, thats it!
    /*function buildLine(board, points, pointAttributes, lineAttributes) {
        //ALTERNATE - create the points using the points array, pass in the points attributes, then create the line
       return board.create('line', points, lineAttributes);
    }*/

   /* function buildPoint(board, newPoint, newPointX, newPointY){
        return board.create('point', newPoint, {
                fillColor: '#f21d67',
                name: '(' + newPointX + ',' + newPointY + ')'
            });
    }

 */

    function buildBoxPlotBoxes(board, lineAttr, boxPlotData){
            console.log(boxPlotData);
                //create min-Q1 line
            board.create('line', [
                [boxPlotData.boxPlotMin, boxPlotData.boxPlotOffset],
                [boxPlotData.boxPlotQ1, boxPlotData.boxPlotOffset]
            ], lineAttr);
            //create Q1-Med box
            board.create('line', [
                [boxPlotData.boxPlotQ1, boxPlotData.boxPlotOffset - 2],
                [boxPlotData.boxPlotQ1, boxPlotData.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [boxPlotData.boxPlotQ1, boxPlotData.boxPlotOffset + 2],
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [boxPlotData.boxPlotQ1, boxPlotData.boxPlotOffset - 2],
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset - 2]
            ], lineAttr);
            board.create('line', [
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset - 2],
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset + 2]
            ], lineAttr);
            //create Med-Q3 box
            board.create('line', [
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset - 2],
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset + 2],
                [boxPlotData.boxPlotQ3, boxPlotData.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [boxPlotData.boxPlotMed, boxPlotData.boxPlotOffset - 2],
                [boxPlotData.boxPlotQ3, boxPlotData.boxPlotOffset - 2]
            ], lineAttr);
            board.create('line', [
                [boxPlotData.boxPlotQ3, boxPlotData.boxPlotOffset - 2],
                [boxPlotData.boxPlotQ3, boxPlotData.boxPlotOffset + 2]
            ], lineAttr);
            //create Q3-max line
            board.create('line', [
                [boxPlotData.boxPlotQ3, boxPlotData.boxPlotOffset],
                [boxPlotData.boxPlotMax, boxPlotData.boxPlotOffset]
            ], lineAttr);
            }

        //creates a circle, defined by a center point and outer point
    function buildCircle(board, centerPoint, outerPoint) {
        board.createElement('circle', [centerPoint, outerPoint], {
            strokeColor: '#f21d67',
            strokeWidth: 2
        });
    }

     function buildParabloa(board, direction) {

        if (direction == "positive") {
            var line1 = board.createElement('line', [
                [0, 0],
                [0, 1]
            ], {
                visible: false
            });
            board.create('parabola', [
                [0.9, 0], line1
            ], {
                strokeColor: '#f21d67',
                strokeWidth: 2
            });
        } else if (direction == "negative") {
            var line1 = board.createElement('line', [
                [1, 0],
                [1, 1]
            ], {
                visible: false
            });
            board.create('parabola', [
                [0.0, 0], line1
            ], {
                strokeColor: '#f21d67',
                strokeWidth: 2
            });
        }


    }


    function addSegment() {
       return board.create('line', [
            [-1, 0],
            [-1, 9]
        ], {
            strokeWidth: 5,
            strokeColor: '#999999',
            dash: 2,
            straightFirst: false,
            straightLast: false,
        });
    }



}