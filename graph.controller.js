angular
    .module('app')
    .controller('graphController', graphController);

graphController.$inject = ['$rootScope', '$scope', '$element', '$compile', 'graphService', 'mailService'];

function graphController($rootscope, $scope, $element, $compile, graphService, mailService) {

    var vm = this;
    vm.hide = false;
    vm.board = {};

    vm.altAttr = '';
    vm.dataSet = '';

    vm.functionForGraph = 'x * 2';

    //initializing functions
    vm.boardAttributes = graphService.getBoardAttributes; //initial board attributes
    vm.updatedBoardAttributes = "{            boundingbox: [-10, 10, 10, -10],            axis: true,            grid: true,            showcopyright: false,            shownavigation: false,            registerEvents: true,            snapToGrid: true,            snapSizeX: 1,            snapSizeY: 1         }";
    vm.getLineAttributes = graphService.getLineAttributes; //initial line attributes
    vm.dumpToCanvas = dumpToCanvas;
    vm.destroyBoard = destroyBoard;
    vm.initializeBoard = initializeBoard;

    vm.boardAttributes = "{        boundingbox: [-10, 10, 10, -10],        axis: true,        grid: true,        showcopyright: false,        shownavigation: false,        registerEvents: true,        snapToGrid: true,        snapSizeX: 1,        snapSizeY: 1     }";

    vm.updateBoardAttributes = updateBoardAttributes;

    vm.toggleView = toggleView;

    vm.pointsArray = getPointsArray;

    vm.graphObject = {
        type: graphService.getGraphType,
        points: vm.pointsArray()
    };

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

    //initialize 5 data points for box plots
    vm.boxPlotMin = 0;
    vm.boxPlotQ1 = 1;
    vm.boxPlotMed = 2;
    vm.boxPlotQ3 = 3;
    vm.boxPlotMax = 4;
    vm.boxPlotHeight = 4;
    vm.boxPlotOffset = 5;

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


    //one JSON to rule them all, and in the darkness bind them

    //handling view stuff
    function toggleView(divId) {
        //$('#'+divId+'').hide();

    }



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

    vm.cb = cb;

    function initializeBoard(typeOfGraphObject, val) {
        cb(vm.board, typeOfGraphObject, val);
    }

    function cb(board, typeOfGraphObject, val) {

        //eval is used to get strings out of forms and convert to usable variable data
        //function fn is the function that graphs a line based on a mathmatical function (lines that pass the vertical line test)
        eval("var fn = function(x){ return " + vm.functionForGraph + ";}");
        eval("var points = [[" + vm.x1 + "," + vm.y1 + "],[" + vm.x2 + ", " + vm.y2 + "]];");
        eval("var lineAttr = {strokeColor: '" + vm.lineColor + "', highlightStrokeColor: '#111111',strokeColorOpacity: 1,dash: " + vm.lineDash + ",        strokeWidth: 2,        straightFirst: true,        straightLast: true,        firstArrow: false,        lastArrow: false,        trace: false,        shadow: false,        visible: true,        margin: -15};");

        var newPoint = [vm.newPointX, vm.newPointY];

        vm.altAttr = '';
        vm.dataSet = '';
        //If a graph object is a certain type, do that thing

        if (typeOfGraphObject == "function") {
            board.create('functiongraph', [function(x) {
                    //return x+2;
                    return fn(x);
                }],
                lineAttr);
        }


        if (typeOfGraphObject == "line") {

            board.create('line', points, lineAttr);

        }

        if (typeOfGraphObject == "verticalLineTest") {
            verticalLineTest(true);
        }

        if (typeOfGraphObject == "point") {
            board.create('point', newPoint, {
                fillColor: '#f21d67',
                name: '(' + vm.newPointX + ',' + vm.newPointY + ')'
            });




        }


        // dotPlotData = [[1,2],[3,4]];
        if (typeOfGraphObject == "dotPlot") {
            //console.log("dotplot!");
            eval("var data = [" + vm.dotPlotData + "]");
            //console.log(data);    
            console.log("ALT IS");
            angular.forEach(data[0], function(value) {
                vm.altAttr += "There are " + value[1] + " points above " + value[0] + ". ";
            });
            console.log(vm.altAttr);




            angular.forEach(data[0], function(value) {
                for (i = 0; i < value[1]; i++) {
                    vm.dataSet += value[0] + ", ";
                }

            });
            vm.dataSet = vm.dataSet.slice(0, vm.dataSet.length - 2);

            var maxNum = 0;
            var maxXVal = 0;
            angular.forEach(data[0], function(value) {

                console.log("value is " + value[0]);
                if (value[0] > maxXVal) {
                    maxXVal = value[0]
                }
            });


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
                //  console.log("value is ");
                // console.log(value[0]);

                for (i = 0; i < value[1]; i++) {
                    //console.log(value[0] + " " + i);
                    board.create('point', [value[0], i], {
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
            console.log("box plot!");

            lineAttr.straightFirst = false;
            lineAttr.straightLast = false;

            var boxPlotAxis = board.create('axis', [
                [vm.boxPlotMin, 0],
                [vm.boxPlotQ1, 0]
            ]);

            board.create('ticks', [boxPlotAxis, [vm.boxPlotMin, vm.boxPlotQ1, vm.boxPlotMed, vm.boxPlotQ3, vm.boxPlotMax]], {
                strokeColor: '#00ff00',
                majorHeight: 15,
                drawLabels: true
            });

            //create min-Q1 line
            board.create('line', [
                [vm.boxPlotMin, vm.boxPlotOffset],
                [vm.boxPlotQ1, vm.boxPlotOffset]
            ], lineAttr);
            //create Q1-Med box
            board.create('line', [
                [vm.boxPlotQ1, vm.boxPlotOffset - 2],
                [vm.boxPlotQ1, vm.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [vm.boxPlotQ1, vm.boxPlotOffset + 2],
                [vm.boxPlotMed, vm.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [vm.boxPlotQ1, vm.boxPlotOffset - 2],
                [vm.boxPlotMed, vm.boxPlotOffset - 2]
            ], lineAttr);
            board.create('line', [
                [vm.boxPlotMed, vm.boxPlotOffset - 2],
                [vm.boxPlotMed, vm.boxPlotOffset + 2]
            ], lineAttr);
            //create Med-Q3 box
            board.create('line', [
                [vm.boxPlotMed, vm.boxPlotOffset - 2],
                [vm.boxPlotMed, vm.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [vm.boxPlotMed, vm.boxPlotOffset + 2],
                [vm.boxPlotQ3, vm.boxPlotOffset + 2]
            ], lineAttr);
            board.create('line', [
                [vm.boxPlotMed, vm.boxPlotOffset - 2],
                [vm.boxPlotQ3, vm.boxPlotOffset - 2]
            ], lineAttr);
            board.create('line', [
                [vm.boxPlotQ3, vm.boxPlotOffset - 2],
                [vm.boxPlotQ3, vm.boxPlotOffset + 2]
            ], lineAttr);
            //create Q3-max line
            board.create('line', [
                [vm.boxPlotQ3, vm.boxPlotOffset],
                [vm.boxPlotMax, vm.boxPlotOffset]
            ], lineAttr);




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

            var colorsArray = [];

            angular.forEach(data, function(value) {
                colorsArray.push('#ff9900');
            });

            console.log(colorsArray);

            board.create('chart', data, {
                chartStyle: 'bar',
                width: -1,
                labels: data,
                colorArray: colorsArray
            });


        }

        //put a JSON build right here

        vm.dumpToCanvas();

    }

    function destroyBoard() {
        JXG.JSXGraph.freeBoard(vm.board);

        eval("var boardAttr = " + vm.boardAttributes + ";");

        vm.xmin = "-10";
        vm.ymin = "-10";
        vm.xmax = "10";
        vm.ymax = "10";
        vm.board = JXG.JSXGraph.initBoard('box', boardAttr);
        vm.dumpToCanvas();

    }

    function getGridMax(val) {
        console.log("getGridMax");
        console.log("val is " + (val + (val * 0.2)));

        return (val + (val * 0.2));
    }


    function updateBoardAttributes(typeOfGraph) {

        if (typeOfGraph == 'default') {
            eval("var boardAttr = {boundingbox: [" + vm.xmin + ", " + vm.ymax + ", " + vm.xmax + ", " + vm.ymin + "], axis: " + vm.axisShow + ", grid: " + vm.gridShow + ", showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        } else if (typeOfGraph == 'boxPlot') {



            eval("var boardAttr = {boundingbox: [" + (vm.boxPlotMin - (vm.boxPlotMax * 0.2)) + ", 10, " + getGridMax(parseInt(vm.boxPlotMax)) + ", -3], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        } else if (typeOfGraph == 'dotPlot') {
            eval("var data = [" + vm.dotPlotData + "]");
            var maxNum = 0;
            var maxXVal = 0;
            angular.forEach(data[0], function(value) {

                console.log("value is " + value[0]);
                if (value[0] > maxXVal) {
                    maxXVal = value[0]
                }

                for (i = 0; i < value[1]; i++) {
                    //console.log(value[0] + " " + i);
                    if (i > maxNum) {
                        maxNum = i;
                    }
                }
            });
            console.log("maxNum is " + maxNum);
            //getGridMax(parseInt(maxNum))
            //eval("var boardAttr = {boundingbox: ["+(vm.dotPlotMin-(maxNum*0.2))+", "+getGridMax(parseInt(maxXVal))+", " + getGridMax(parseInt(maxNum)) +  ", -3], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");

            eval("var boardAttr = {boundingbox: [" + (vm.dotPlotMin - (maxNum * 0.2)) + ", " + getGridMax(parseInt(maxNum)) + ", " + getGridMax(parseInt(maxXVal)) + ", -3], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
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

    function getPointsArray() {
        return graphService.getPointsArray();
    }

    function dumpToCanvas() {
        vm.board.renderer.dumpToCanvas('cvoutput');
    }
    var points = [];

    //checks to see if points are visible, then loops through points to create an array of points on the board.
    function createPoints(pointsArray, arguments) {
        var pointIsVisible = arguments.visible;

        angular.forEach(pointsArray, function(value, key) {
            points[key] = vm.board.create('point', [value[0], value[1]], {
                visible: pointIsVisible
            });
        });
    }

    //creates a circle, defined by a center point and outer point
    function createCircle(centerPoint, outerPoint) {
        board.createElement('circle', [centerPoint, outerPoint], {
            strokeColor: '#f21d67',
            strokeWidth: 2
        });
    }


    //creates a line, thats it!
    function createLine(A, B, pointsVisible) {
        createPoints([A, B], {
            visible: pointsVisible
        });
        vm.board.createElement('line', [points[0], points[1]], {
            strokeColor: '#000033',
            strokeWidth: 2
        });
        //vm.board.createElement('line', [points[0], points[1]], {strokeColor:'#f21d67',strokeWidth:2});

    }




    function createParabola(direction) {

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

    function addSegment() {
        board.create('line', [
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