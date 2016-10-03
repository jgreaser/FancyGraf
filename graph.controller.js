angular
    .module('app')
    .controller('graphController', graphController);

graphController.$inject = ['$rootScope', '$scope', '$element', '$compile', 'graphService', 'mailService'];

function graphController($rootscope, $scope, $element, $compile, graphService, mailService) {


    var vm = this;
    vm.hide = false;

    var graphJSON = {};

    //this must have been used in the html version???
    vm.boardAttributes = "{  boundingbox: [-10, 10, 10, -10],        axis: true,        grid: true,        showcopyright: false,        shownavigation: false,        registerEvents: true,        snapToGrid: true,        snapSizeX: 1,        snapSizeY: 1     }";

    //initializing alt/data
    vm.altAttr = '';
    vm.dataSet = '';

    //points array - for use in creating arrays of points (which is then passed to a line)
    var points = [];

    //initializing x/y for line points variables
    vm.x1 = 1;
    vm.y1 = 1;
    vm.x2 = 3;
    vm.y2 = 3;

    //initialize grid bounding box variables
    vm.xmin = "-10";
    vm.xmax = "10";
    vm.ymin = "-10";
    vm.ymax = "10";

    //initialize new point x/y variables
    vm.newPointX = 0;
    vm.newPointY = 0;

    //initialize function for graph
    vm.functionForGraph = 'x * 2';

    //initialize 5 data points for box plots
    vm.showBoxPlotOutliers = false;
    vm.boxPlotMinOutliers = [];
    vm.boxPlotMin = 0;
    vm.boxPlotQ1 = 1;
    vm.boxPlotMed = 2;
    vm.boxPlotQ3 = 3;
    vm.boxPlotMax = 4;
    vm.boxPlotHeight = 4;
    vm.boxPlotOffset = 5;
    vm.boxPlotMaxOutliers = [];
    //barchart data
    vm.barChartData = '5,1,5,1,5';

    //dotPlot data
    vm.dotPlotData = "[[1,2],[3,4]]";
    vm.dotPlotMin = 0;
    vm.dotPlotMax = 10;

    //setting some line/grid attributes
    vm.lineColor = "#1d3559";
    vm.lineDash = "0";
    vm.gridShow = "true";
    vm.axisShow = true;
    vm.lineAttributes = "{strokeColor: '#1d3559', highlightStrokeColor: '#111111',strokeColorOpacity: 1,dash: 0,        strokeWidth: 2,        straightFirst: true,        straightLast: true,        firstArrow: false,        lastArrow: false,        trace: false,        shadow: false,        visible: true,        margin: -15}";
    vm.board = JXG.JSXGraph.initBoard('box', {
        boundingbox: [-10, 10, 10, -10],
        axis: true,
        grid: true,
        showcopyright: false,
        shownavigation: false,
        registerEvents: true,
        snapToGrid: true,
        snapSizeX: 1,
        snapSizeY: 1
    });

    //initializing functions
    vm.getLineAttributes = graphService.getLineAttributes; //initial line attributes
    vm.dumpToCanvas = dumpToCanvas;
    vm.destroyBoard = destroyBoard;
    vm.initializeBoard = initializeBoard;
    vm.updateBoardAttributes = updateBoardAttributes;
    vm.pointsArray = getPointsArray;
    vm.cb = cb;


    //one JSON to rule them all, and in the darkness bind them
    //the one json not created yet, dont tremble


    //if graphService.getInitNewGraph changes and is true, and graphService.initialized() is initialized, 
    //then reset the board
    $scope.$watch(graphService.getInitNewGraph, function(newValue) {
        if (graphService.initialized() == true && graphService.getInitNewGraph() == true) {
            vm.boardAttributes = graphService.getBoardAttributes();
            vm.board = JXG.JSXGraph.freeBoard(vm.board);
            vm.board = JXG.JSXGraph.initBoard('box', vm.boardAttributes);

            vm.cb(vm.board); //calls the cb function, which builds the graph
            graphService.setInitNewGraph(false); //and reset setInitNewGraph to false
        }
    }, true);

    function initializeBoard(typeOfGraphObject, val) {
        cb(vm.board, typeOfGraphObject, val);
    }

    

    function cb(board, typeOfGraphObject, val) {

        //eval is used to get strings out of forms and convert to usable variable data
        //function fn is the function that graphs a line based on a mathmatical function (lines that pass the vertical line test)
        eval("var fn = function(x){ return " + vm.functionForGraph + ";}");
       
        var points = [[vm.x1,vm.y1],[vm.x2,vm.y2]]; 
        var lineAttr = {strokeColor: vm.lineColor, highlightStrokeColor: '#111111',strokeColorOpacity: 1,dash: vm.lineDash,        strokeWidth: 2,        straightFirst: true,        straightLast: true,        firstArrow: false,        lastArrow: false,        trace: false,        shadow: false,        visible: true,        margin: -15};
        var newPoint = [vm.newPointX, vm.newPointY];

        //rest alt/data 
        vm.altAttr = 'unavailable for this chart type';
        vm.dataSet = 'unavailable for this chart type';
        
        //If a graph object is a certain type, do that thing
        if (typeOfGraphObject == "function") {
            console.log("build function");
            graphService.buildFunction(board, fn, lineAttr);
        }

        if (typeOfGraphObject == "line") {
            //board.create('line', points, lineAttr);
            var pointsAttr = {};
            graphService.buildLine(board, points, pointsAttr, lineAttr);
        }

        if (typeOfGraphObject == "verticalLineTest") {
            verticalLineTest(true);
        }

        if (typeOfGraphObject == "point") {
            graphService.buildPoint(board, newPoint, vm.newPointX, vm.newPointY);

            
        }

        // dotPlotData = [[1,2],[3,4]];
        if (typeOfGraphObject == "dotPlot") {
            eval("var data = [" + vm.dotPlotData + "]");

            vm.dataSet = '';

            buildAlt(typeOfGraphObject, data[0]); //pass in the dotplot data from the eval statement
            buildDataSet(typeOfGraphObject,data[0]);

            var maxNum = 0;
            var maxXVal = 0;

            maxXVal = getMaxKeyVal(data[0]);

            var dotPlotAxis = board.create('axis', [
                [vm.dotPlotMin, 0],
                [maxXVal, 0]
            ]);

            board.create('ticks', [dotPlotAxis], {
                insertTicks: false,
                strokeColor: '#333333',
                majorHeight: 15,
                drawLabels: true
            });

            angular.forEach(data[0], function(value) {
                for (i = 0; i < value[1]; i++) {
                    board.create('point', [value[0], i+1], {
                        fillColor: '#f21d67'
                    });
                }
            });
        }

        if (typeOfGraphObject == "inequality") {
            var inequalityLine = board.create('line', points, {
                visible: false
            });
            board.create('inequality', [inequalityLine], {
                inverse: val,
                strokeColor: '#1d3559',
                highlightStrokeColor: '#111111',
                strokeColorOpacity: 1,
                dash: 4,
                strokeWidth: 2,
                straightFirst: true,
                straightLast: true,
                firstArrow: false,
                lastArrow: false,
                trace: false,
                shadow: false,
                visible: true,
                margin: -15
            });
        }

        if (typeOfGraphObject == "boxPlot") {

            eval("var minOutliers = [" + vm.boxPlotMinOutliers + "]");
            eval("var maxOutliers = [" + vm.boxPlotMaxOutliers + "]");
            console.log("minOutliers " + minOutliers);


            //determine if lines should continue past points
            lineAttr.straightFirst = false;
            lineAttr.straightLast = false;

            buildAlt(typeOfGraphObject, null); //pass in the dotplot data from the eval statement
            buildDataSet(typeOfGraphObject, null);

            console.log("vm.showBoxPlotOutliers is " + vm.showBoxPlotOutliers);
            if (vm.showBoxPlotOutliers == true){
                console.log("its true!");

                minValue = getSmallestNumber(vm.boxPlotMin, minOutliers);
                maxValue = getBiggestNumber(vm.boxPlotMax, maxOutliers);

                console.log(minValue);
                console.log(maxValue);

                angular.forEach(minOutliers, function(value) {
                
                        board.create('point', [value, vm.boxPlotOffset], {
                            face:'x',
                            fillColor: '#f21d67'
                        });
            
                 });

                angular.forEach(maxOutliers, function(value) {
               
                         board.create('point', [value, vm.boxPlotOffset], {
                            face:'x',
                            fillColor: '#f21d67'
                        });
                     
                 });



           }
             


            var boxPlotAxis = board.create('axis', [
                [vm.boxPlotMin, 0],
                [vm.boxPlotQ1, 0]
            ]);

            board.create('ticks', [boxPlotAxis, [vm.boxPlotMin, vm.boxPlotQ1, vm.boxPlotMed, vm.boxPlotQ3, vm.boxPlotMax]], 
            //tick attributes
            {
                strokeColor: '#00ff00',
                majorHeight: 15,
                drawLabels: true
            });
            var dataObject = {
                boxPlotMin: vm.boxPlotMin,
                boxPlotQ1: vm.boxPlotQ1,
                boxPlotMed: vm.boxPlotMed,
                boxPlotQ3: vm.boxPlotQ3, 
                boxPlotMax: vm.boxPlotMax,
                boxPlotOffset: vm.boxPlotOffset};
            console.log("dataobject is");
            console.log(dataObject);
            graphService.buildBoxPlotBoxes(board, lineAttr, dataObject);

        }

        if (typeOfGraphObject == 'barChart') {

            var barChartXAxis = board.create('axis', [
                [0, 0],
                [0, 10000]
            ]);
            var barChartYAxis = board.create('axis', [
                [0, 0],
                [10000, 0]
            ]);

            eval("var data = [" + vm.barChartData + "]");

            board.create('chart', data, {
                chartStyle: 'bar',
                width: -1,
                labels: data            });


        }

        //put a JSON build right here

        vm.dumpToCanvas();

    }

    function destroyBoard() {
        JXG.JSXGraph.freeBoard(vm.board);

        eval("var boardAttr = " + vm.boardAttributes + ";");

        //reinitiatialize board stuff
        vm.xmin = "-10";
        vm.ymin = "-10";
        vm.xmax = "10";
        vm.ymax = "10";
        vm.board = JXG.JSXGraph.initBoard('box', boardAttr);

        vm.dumpToCanvas();

    }

    function buildAlt(graphType, data){
        vm.altAttr = '';

        if(graphType == 'dotPlot'){
            angular.forEach(data, function(value) {
                vm.altAttr += "There are " + value[1] + " points above " + value[0] + ". ";
            });
            
            }
        if(graphType == 'boxPlot'){
            vm.altAttr += "There is a line from " + vm.boxPlotMin + " to " + vm.boxPlotQ1 + ", then a box from " + vm.boxPlotQ1 + " to " + vm.boxPlotMed + ", another box from " + vm.boxPlotMed + " to " + vm.boxPlotQ3 + ", and a line from " + vm.boxPlotQ3 + " to " + vm.boxPlotMax + ".";
        }
    }

    function buildDataSet(graphType, data){
        
        if  (graphType == 'dotPlot'){
        angular.forEach(data, function(value) {
                for (i = 0; i < value[1]; i++) {
                    vm.dataSet += value[0] + ", ";
                }

            });
        vm.dataSet = vm.dataSet.slice(0, vm.dataSet.length - 2);
        }
        if  (graphType == 'boxPlot'){
            vm.dataSet = "Minimum value is " + vm.boxPlotMin + ",  Q1 is " + vm.boxPlotQ1 + ", Median is " + vm.boxPlotMed + ", Q3 is " + vm.boxPlotQ3 + ", and maximum value is " + vm.boxPlotMax + ".";
        }

    }

     

 


    function updateBoardAttributes(typeOfGraph) {

        if (typeOfGraph == 'default') {
            eval("var boardAttr = {boundingbox: [" + vm.xmin + ", " + vm.ymax + ", " + vm.xmax + ", " + vm.ymin + "], axis: " + vm.axisShow + ", grid: " + vm.gridShow + ", showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        } else if (typeOfGraph == 'boxPlot') {

            eval("var minOutliers = [" + vm.boxPlotMinOutliers + "]");
            eval("var maxOutliers = [" + vm.boxPlotMaxOutliers + "]");

            var minValue;
            var maxValue;

            if (vm.showBoxPlotOutliers == true){

                minValue = getSmallestNumber(vm.boxPlotMin, minOutliers);
                maxValue = getBiggestNumber(vm.boxPlotMax, maxOutliers);
            }
            else {
                minValue = vm.boxPlotMin;
                maxValue = vm.boxPlotMax;
                }


            eval("var boardAttr = {boundingbox: [" + (minValue - (maxValue* 0.2)) + ", 10, " + getGridMax(parseInt(maxValue)) + ", -3], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        } else if (typeOfGraph == 'dotPlot') {
            eval("var data = [" + vm.dotPlotData + "]");
            var maxNum = 0;
            var maxXVal = 0;
            angular.forEach(data[0], function(value) {

                if (value[0] > maxXVal) {
                    maxXVal = value[0]
                }

                for (i = 0; i < value[1]; i++) {
                    if (i > maxNum) {
                        maxNum = i;
                    }
                }
            });

            eval("var boardAttr = {boundingbox: [" + (vm.dotPlotMin - (maxNum * 0.2)) + ", " + (getGridMax(parseInt(maxNum))+1) + ", " + getGridMax(parseInt(maxXVal)) + ", -3], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        } else if (typeOfGraph == 'barChart') {
            eval("var data = [" + vm.barChartData + "]");
            var maxX = getMaxData(data);

            eval("var boardAttr = {boundingbox: [" + (0 - 1) + ", " + (maxX + (maxX * 0.2)) + ", " + (data.length + data.length * 0.2) + ", " + (0 - (maxX * 0.2)) + "], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        }

        JXG.JSXGraph.freeBoard(vm.board);

        vm.board = JXG.JSXGraph.initBoard('box', boardAttr);
        vm.dumpToCanvas();

        if (typeOfGraph == 'boxPlot') {
            cb(vm.board, 'boxPlot');
        } else if (typeOfGraph == 'barChart') {
            cb(vm.board, 'barChart');
        } else if (typeOfGraph == 'dotPlot') {
            cb(vm.board, 'dotPlot');
        }
    }

    function getMaxData(data) {
        var maxData = 0;
        angular.forEach(data, function(value) {
            if (value > maxData) {
                maxData = value;
            }
        });
        return maxData;
    }

    function getMaxKeyVal(data){
        var maxXVal = 0;
        angular.forEach(data, function(value) {
                if (value[0] > maxXVal) {
                    maxXVal = value[0]
                }
            });
        return maxXVal;
    }

    function getPointsArray() {
        return graphService.getPointsArray();
    }

    function dumpToCanvas() {
        vm.board.renderer.dumpToCanvas('cvoutput');
    }

  



   

    function verticalLineTest(val) {
        if (val == true) {
            vm.board.create('line', [
                [-4, 0],
                [-4, 1]
            ], {
                strokeColor: '#999999',
                dash: 2
            });
            vm.board.create('line', [
                [-2, 0],
                [-2, 1]
            ], {
                strokeColor: '#999999',
                dash: 2
            });
            vm.board.create('line', [
                [2, 0],
                [2, 1]
            ], {
                strokeColor: '#999999',
                dash: 2
            });
            vm.board.create('line', [
                [4, 0],
                [4, 1]
            ], {
                strokeColor: '#999999',
                dash: 2
            });
        } else {
            console.log("no vertical line test");
        }
    }



    //utilities
   function getSmallestNumber(value, arrayOfValues){
       
             angular.forEach(arrayOfValues, function(arrayValue) {
                if (value > arrayValue){value = arrayValue;}

            });
             return value;

    }


    function getBiggestNumber(value, arrayOfValues){
        angular.forEach(arrayOfValues, function(arrayValue) {

            if (value < arrayValue){
                value = arrayValue;
            }

            });
        return value;

    }
       function getGridMax(val) {

        return (val + (val * 0.2));
    }

}