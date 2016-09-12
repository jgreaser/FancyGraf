angular
    .module('app')
    .controller('graphController', graphController);

graphController.$inject = ['$rootScope', '$scope', '$element', '$compile', 'graphService', 'mailService'];

function graphController($rootscope, $scope, $element, $compile, graphService, mailService) {

    var vm = this;
    vm.hide = false;
    vm.board = {};

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

    //setting some line/grid attributes
    vm.lineColor = "#1d3559";
    vm.lineDash = "0";
    vm.gridShow = "true";
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


    function updateBoardAttributes() {

        eval("var boardAttr = {boundingbox: [" + vm.xmin + ", " + vm.ymax + ", " + vm.xmax + ", " + vm.ymin + "], axis: true, grid: " + vm.gridShow + ", showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");


        JXG.JSXGraph.freeBoard(vm.board);

        vm.board = JXG.JSXGraph.initBoard('box', boardAttr);
        vm.dumpToCanvas();
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