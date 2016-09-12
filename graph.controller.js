angular
    .module('app')
    .controller('graphController', graphController);

graphController.$inject = ['$rootScope', '$scope', '$element',  '$compile', 'graphService', 'mailService'];

function graphController($rootscope, $scope, $element,  $compile, graphService, mailService) {

    var vm = this;
    vm.hide = false;
    vm.board = {};
    vm.functionForGraph = 'x *2';

    vm.boardAttributes = graphService.getBoardAttributes;//initial board attributes
    vm.updatedBoardAttributes = "{            boundingbox: [-10, 10, 10, -10],            axis: true,            grid: true,            showcopyright: false,            shownavigation: false,            registerEvents: true,            snapToGrid: true,            snapSizeX: 1,            snapSizeY: 1         }";
    vm.getLineAttributes = graphService.getLineAttributes;//initial line attributes
    vm.dumpToCanvas = dumpToCanvas;

    vm.destroyBoard = destroyBoard;


    vm.boardAttributes = "{        boundingbox: [-10, 10, 10, -10],        axis: true,        grid: true,        showcopyright: false,        shownavigation: false,        registerEvents: true,        snapToGrid: true,        snapSizeX: 1,        snapSizeY: 1     }";

    vm.updateBoardAttributes = updateBoardAttributes;

    vm.pointsArray = getPointsArray;
    vm.graphObject = {
        type: graphService.getGraphType,
        points: vm.pointsArray()
    };

    vm.x1 = 1;
    vm.y1 = 1;
    vm.x2 = 3;
    vm.y2 = 3;

    vm.xmin = "-10";
    vm.xmax = "10";
    vm.ymin = "-10";
    vm.ymax = "10";

    vm.newPointX = 0;
    vm.newPointY = 0;

    vm.lineColor = "#1d3559";
    vm.lineDash = "0";
    vm.gridShow = "true";

    vm.lineAttributes = "{strokeColor: '#1d3559', highlightStrokeColor: '#111111',strokeColorOpacity: 1,dash: 0,        strokeWidth: 2,        straightFirst: true,        straightLast: true,        firstArrow: false,        lastArrow: false,        trace: false,        shadow: false,        visible: true,        margin: -15}";
    //if graphService.getInitNewGraph changes and is true, and graphService.initialized() is initialized, 
    //then reset the board
    $scope.$watch(graphService.getInitNewGraph, function(newValue) {
        if (graphService.initialized() == true && graphService.getInitNewGraph() == true) {
            vm.boardAttributes = graphService.getBoardAttributes();
            vm.board = JXG.JSXGraph.freeBoard(vm.board);
            vm.board = JXG.JSXGraph.initBoard('box', vm.boardAttributes);

            vm.cb(vm.board);
            graphService.setInitNewGraph(false);
        }
    }, true);
    
    vm.cb = cb;

    //cb();

    vm.initializeBoard  = initializeBoard;

    vm.board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10], axis: true, grid: true, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 });



    function initializeBoard (typeOfGraphObject, val){
        cb(vm.board, typeOfGraphObject, val);
    } 

    function cb(board, typeOfGraphObject, val) {

        eval("var fn = function(x){ return "+vm.functionForGraph+";}"); 
        //fn();
        eval("var points = [["+vm.x1+","+vm.y1+"],["+vm.x2+", "+vm.y2+"]];"); 
        eval("var lineAttr = {strokeColor: '"+vm.lineColor+"', highlightStrokeColor: '#111111',strokeColorOpacity: 1,dash: "+vm.lineDash+",        strokeWidth: 2,        straightFirst: true,        straightLast: true,        firstArrow: false,        lastArrow: false,        trace: false,        shadow: false,        visible: true,        margin: -15};"); 
        var newPoint = [vm.newPointX,vm.newPointY];

        if (typeOfGraphObject == "function"){
        	console.log("they're asking for a function");
        	board.create('functiongraph', 
                        [function(x){
                            //return x+2;
                           return  fn(x);
                        }], 
                        lineAttr);
        }


        if (typeOfGraphObject == "line"){
        	console.log("they're asking for a line!");

        	board.create('line', points, lineAttr);

        }

        if (typeOfGraphObject =="verticalLineTest"){
        	verticalLineTest(true);
        }

        if(typeOfGraphObject =="point"){
        	board.create('point', newPoint, {fillColor: '#f21d67', name:'('+vm.newPointX+','+vm.newPointY+')'});
        }

        if(typeOfGraphObject == "inequality"){
            console.log("Oh now they want inequality, FINE");
            var inequalityLine = board.create('line', points, {visible: false});
            board.create('inequality', [inequalityLine], {inverse: val,strokeColor: '#1d3559', highlightStrokeColor: '#111111',strokeColorOpacity: 1,dash: 4,        strokeWidth: 2,        straightFirst: true,        straightLast: true,        firstArrow: false,        lastArrow: false,        trace: false,        shadow: false,        visible: true,        margin: -15});
        

        
    }

        



    //verticalLineTest(true);
       //createGraph("line", {pointA: [1,2], pointB: [4,2], pointsVisible: false});

       //board.create('line', [[1,2],[2,5]], {strokeWidth: 4, strokeColor: '#f21d67', dash:1, straightFirst:false, straightLast:false,});
       // board.create('line', [[2,1],[2,4]], {strokeWidth: 3, strokeColor: '#f21d67', dash:2, straightFirst:false, straightLast:false,});

       vm.dumpToCanvas();

    }

 	function destroyBoard(){
 		JXG.JSXGraph.freeBoard(vm.board);
        eval("var boardAttr = "+vm.boardAttributes+";");
        vm.xmin = "-10";
        vm.ymin = "-10";
        vm.xmax = "10";
        vm.ymax = "10"; 
 		vm.board = JXG.JSXGraph.initBoard('box', boardAttr);
 		vm.dumpToCanvas();

 	}


    function updateBoardAttributes(){
        
        eval("var boardAttr = {boundingbox: ["+vm.xmin+", "+vm.ymax+", "+vm.xmax+", "+vm.ymin+"], axis: true, grid: "+vm.gridShow+", showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };"); 


        JXG.JSXGraph.freeBoard(vm.board);

        vm.board = JXG.JSXGraph.initBoard('box', boardAttr);
        vm.dumpToCanvas();
    }


    function getPointsArray() {
        return graphService.getPointsArray();
    }

    function dumpToCanvas(){
        console.log("dump");
        vm.board.renderer.dumpToCanvas('cvoutput');
    }
     var points = [];
           /*var board = JXG.JSXGraph.initBoard('box', 
                {   boundingbox: [-10, 10, 10, -10], 
                    grid:true, 
                    showCopyright: false, 
                    axis: true, 
                    showNavigation: false, 
                    fontSize: 20,
                    snapToGrid: true,
                    snapSizeX: 1,
                    snapSizeY: 1 });
            */
           //createGraph("simpleExponential", {power: 2});
        
        //ParabolaTown 
        //createGraph("createFunctionGraph", {returnFunction: function(x){return (Math.sqrt(1-x)-1);}});
        
        //createGraph("createFunctionGraph", {returnFunction: function(x){return (-1)*(Math.sqrt(1-x)+1);}});

       // board.create('functiongraph', [function(x){return  (Math.pow((x-3),2)-4);}], 
      //  //            {strokeColor: '#f21d67', 
       //             strokeWidth:2});
        /*board.create('functiongraph', [function(x){return ((1/5)*(x)) - 3;}], 
                    {strokeColor: '#000099', 
                    strokeWidth:2});*/
       /* board.create('functiongraph', [function(x){return (x-7)/2;}], 
                   {strokeColor: '#f21d67', 
                    strokeWidth:2});*/
              


        //createGraph("createFunctionGraph", {returnFunction: function(x){return (Math.pow((x-3),2)-4);}});
        //createGraph("createFunctionGraph", {returnFunction: function(x){return ((1/5)*(x)) - 3;}});

        //createGraph("createFunctionGraph", {returnFunction: function(x){return (-1)*(Math.pow((x),2))-1;}});
        //createGraph("createFunctionGraph", {returnFunction: function(x){return Math.abs(x);}});
        //createGraph("circle", {centerPoint: [2,3], outerPoint: [6,3]});
        //createGraph("line", {pointA: [2,5], pointB: [0,5], pointsVisible: false});
        //createGraph("parabola", {direction: "positive"});
           

           //dashedSegment();

           //createPoints([[0,5],[5,5]], {visible: true});


           //verticalLineTest(false);

           //Math.abs(x)
           //Math.pow(x, Power#)

           function createGraph (newFunction, arguments){

            switch(newFunction) {
                case "simpleExponential":
                    functionIsSimpleExponential(arguments.power);
                    break;
                case "circle":
                    createCircle(arguments.centerPoint, arguments.outerPoint);
                    break;
                case "createFunctionGraph":
                    createFunctionGraph(arguments.returnFunction);
                    break;
                case "line":
                    createLine(arguments.pointA, arguments.pointB, arguments.pointsVisible);
                    break;
                case "parabola":
                    createParabola(arguments.direction);
                    break;
                default:
                    //alert('no match');
            }
           }

           function createPoints(pointsArray, arguments){
                console.log(pointsArray);
                console.log(arguments.visible);
                var pointIsVisible = arguments.visible;
                console.log(pointIsVisible);
                angular.forEach(pointsArray, function(value, key) {
                    points[key] = vm.board.create('point', [value[0], value[1]], {visible: pointIsVisible} );
                    });

                console.log(points[0].name);

           }

           function functionIsSimpleExponential(val){
                console.log("functionIsExponential");
                board.create('functiongraph', [function(x){return (Math.pow(x, val));}], {strokeColor: '#f21d67', strokeWidth:2});
           }

           function createCircle(centerPoint, outerPoint){
                board.createElement('circle',[centerPoint,outerPoint], {strokeColor:'#f21d67',strokeWidth:2});
           }

           function createFunctionGraph(returnFunction){
            //returnFunction();
             board.create('functiongraph', [function(x){return returnFunction(x);}], 
                    {strokeColor: '#f21d67', 
                    strokeWidth:2});
           }

           function createLine(A, B, pointsVisible){
            createPoints([A,B], {visible: pointsVisible});
            vm.board.createElement('line', [points[0], points[1]], {strokeColor:'#000033',strokeWidth:2});
            //vm.board.createElement('line', [points[0], points[1]], {strokeColor:'#f21d67',strokeWidth:2});
          
           }

            function createParabola(direction){

                if (direction == "positive"){
                    var line1 =  board.createElement('line', [[0,0], [0,1]], {visible: false});
                    board.create('parabola',[[0.9,0],line1], {strokeColor:'#f21d67',strokeWidth:2});
                }
                else if (direction == "negative"){
                    var line1 =  board.createElement('line', [[1,0], [1,1]], {visible: false});
                    board.create('parabola',[[0.0,0],line1], {strokeColor:'#f21d67',strokeWidth:2});
                }

                
            }         

            function verticalLineTest(val){
                if (val == true){
                    vm.board.create('line', [[-4,0],[-4,1]], {strokeColor: '#999999', dash:2});
                    vm.board.create('line', [[-2,0],[-2,1]], {strokeColor: '#999999', dash:2});
                    vm.board.create('line', [[2,0],[2,1]], {strokeColor: '#999999', dash:2});
                    vm.board.create('line', [[4,0],[4,1]], {strokeColor: '#999999', dash:2});
                }
                else {console.log("no vertical line test");}
            }

            function dashedSegment(){
                board.create('line', [[-1,0],[-1,9]], {strokeWidth: 5, strokeColor: '#999999', dash:2, straightFirst:false, straightLast:false,});
            }
}