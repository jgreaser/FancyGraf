angular
    .module('app')
    .controller('graphController', graphController);

graphController.$inject = ['$rootScope', '$window', '$scope', '$element', '$compile', 'mailService'];

function graphController($rootscope, $window, $scope, $element, $compile, mailService) {

    var vm = this;
    vm.hide = false;

    vm.graphObject = {
        "board": {},
        "content": []
    };
    vm.textObject = 'add graph JSON here'; //init textobject for text-to-graph input

    var currentObject = 0; //used to delete last action
    vm.objectList = []; //used to delete last action

    //this must have been used in the html version???
    var boardAttr = {
        "boundingbox": [10, 10, 10, 10],
        "axis": true,
        "grid": true,
        "showcopyright": false,
        "shownavigation": false,
        "registerEvents": false,
        "snapToGrid": true,
        "snapSizeX": 1,
        "snapSizeY": 1
    };
    vm.graphObject.board = boardAttr;
    //initializing alt/data
    vm.altAttr = '';
    vm.dataSet = '';

    //points array - for use in creating arrays of points (which is then passed to a line)
    var points = [];


    //initializing value for axis x or axis y
    vm.axisXY = 'x';

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
    vm.showPointLabel = false;

    //initialize function for graph
    vm.functionForGraph = 'sin(x)';

    //initialize label
    vm.labelX = 0;
    vm.labelY = 0;
    vm.labelText = '';
    vm.labelStyle = '';

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
    vm.boxPlotAxis = false;
    //barchart data
    vm.barChartData = '5,1,5,1,5';

    //dotPlot data
    vm.dotPlotData = "[[1,2],[3,4]]";
    vm.dotPlotMin = 0;
    vm.dotPlotMax = 10;

    //setting some line/grid attributes
    vm.lineColor = "#788e52";
    vm.lineDash = 0;
    vm.gridShow = "true";
    vm.axisShow = "true";
    vm.lineAttributes = "{strokeColor: '#788e52', highlightStrokeColor: '#111111',strokeColorOpacity: 1,dash: 0,        strokeWidth: 2,        straightFirst: true,        straightLast: true,        firstArrow: false,        lastArrow: false,        trace: false,        shadow: false,        visible: true,        margin: -15}";

    //initializing functions
    vm.getLineAttributes = graphService.getLineAttributes; //initial line attributes
    vm.updateBoardAttributes = updateBoardAttributes;
    vm.pointsArray = getPointsArray;
    vm.getDisplayName = getDisplayName;
    vm.cb = cb;
    vm.deleteObject = deleteObject;
    vm.setGraphObject = setGraphObject;


    function deleteObject(item) {
        console.log("delete object");

        var deleteObject = vm.graphObject.content.splice(item, 1);
        console.log("deleted object is");
        console.log(deleteObject);
    }

    function setGraphObject(val){
        console.log(JSON.parse(val));
        vm.graphObject = JSON.parse(val);

        //vm.graphObject = JSON.parse(vm.textObject);
        console.log(vm.graphObject);
    }


    function cb(typeOfGraphObject, val) {


        console.log("CB called, with values " + typeOfGraphObject + " and " + val);

        //points array for lines
        var points = [
            [vm.x1, vm.y1],
            [vm.x2, vm.y2]
        ];

        //set line  attributes
        var lineAttr = {
            strokeColor: vm.lineColor,
            highlightStrokeColor: '#111111',
            strokeColorOpacity: 1,
            dash: parseInt(vm.lineDash),//MUST parse Int or it ain't right
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

        //set newPoint for POINT
        var newPoint = {
            x: vm.newPointX,
            y: vm.newPointY
        };

        //reset alt/data 
        vm.altAttr = 'unavailable for this chart type';
        vm.dataSet = 'unavailable for this chart type';

        //set alt text
        var altText = buildAlt(typeOfGraphObject);
        //----------------------//
        //        AXIS          //
        //----------------------//
    
        if (typeOfGraphObject == "axis") {
            vm.graphObject.content.push({
                type: "axis",
                data: {
                    axis: vm.axisXY,

                }
            });
        }


        //----------------------//
        ///       LABEL         //
        //----------------------//
        if (typeOfGraphObject == "label") {
            vm.graphObject.content.push({
                type: "label",
                data: {
                    x: vm.labelX,
                    y: vm.labelY,
                    text: vm.labelText,
                    alt: vm.labelText,
                    labelStyle: vm.labelStyle
                }
            });
        }
        //----------------------//
        //        FUNCTION      //
        //----------------------//
    
        if (typeOfGraphObject == "function") {
            vm.graphObject.content.push({
                type: "function",
                data: {
                    function: vm.functionForGraph,
                    lineAttributes: lineAttr,
                    alt: vm.functionForGraph
                }
            });
        }
        //----------------------//
        //        LINE          //
        //----------------------//
        if (typeOfGraphObject == "line") {
            var pointsAttr = {};
            vm.graphObject.content.push({
                type: "line",
                data: {
                    points: points,
                    lineAttributes: lineAttr,
                    alt: "line through points [" + points[0][0] + ", " + points[0][1] + "], [" + points[1][0] + ", " + points[1][1] + "]."
                }
            });
        }

        if (typeOfGraphObject == "verticalLineTest") {
            vm.graphObject.content.push({
                type: "verticalLineTest"
            });
            verticalLineTest(true);
        }

        //-----------------------//
        //        POINT          //
        //-----------------------//

        if (typeOfGraphObject == "point") {
            vm.graphObject.content.push({
                type: "point",
                data: {
                    points: [vm.newPointX, vm.newPointY],
                    lineAttributes: lineAttr,
                    showLabels: vm.showPointLabel
                }
            });
        }

        //----------------------//
        //        DOT PLOT      //
        //----------------------//

        if (typeOfGraphObject == "dotPlot") {

            eval("var data = [" + vm.dotPlotData + "]");

            vm.dataSet = '';

            buildAlt(typeOfGraphObject, data[0]); //pass in the dotplot data from the eval statement
            buildDataSet(typeOfGraphObject, data[0]);

            var maxNum = 0;
            var maxXVal = 0;

            maxXVal = getMaxKeyVal(data[0]);


            vm.graphObject.content.push({
                type: "dotPlot",
                data: {
                    data: data[0],
                    dotPlotMin: vm.dotPlotMin,
                    dotPlotMax: maxXVal,
                    alt: buildAlt(typeOfGraphObject, data[0]),
                    dataPlainText: buildDataSet(typeOfGraphObject, data[0])
                }
            });
        }

        //----------------------//
        //        INEQUALITY    //
        //----------------------//
        if (typeOfGraphObject == "inequality") {
            vm.graphObject.content.push({
                    type: "inequality",
                    data: {
                        points: points,
                        lineAttributes: lineAttr,
                        equality: val,
                        alt: "inequality line through points [" + points[0][0] + ", " + points[0][1] + "], [" + points[1][0] + ", " + points[1][1] + "]."
                    }
                });
        }

        //----------------------//
        //        BOX PLOT      //
        //----------------------//
        if (typeOfGraphObject == "boxPlot") {

            eval("var minOutliers = [" + vm.boxPlotMinOutliers + "]");
            eval("var maxOutliers = [" + vm.boxPlotMaxOutliers + "]");
            // console.log("minOutliers " + minOutliers);

            //make sure lines dont go past points
            lineAttr.straightFirst = false;
            lineAttr.straightLast = false;

            buildAlt(typeOfGraphObject, null); //pass in the dotplot data from the eval statement
            buildDataSet(typeOfGraphObject, null);


            vm.graphObject.content.push({
                type: "boxPlot",
                data: {
                    boxPlotMin: vm.boxPlotMin,
                    boxPlotQ1: vm.boxPlotQ1,
                    boxPlotMed: vm.boxPlotMed,
                    boxPlotQ3: vm.boxPlotQ3,
                    boxPlotMax: vm.boxPlotMax,
                    boxPlotOffset: vm.boxPlotOffset,
                    boxPlotOutliers: vm.showBoxPlotOutliers,
                    boxPlotOutliersMin: minOutliers,
                    boxPlotOutliersMax: maxOutliers,
                    boxPlotAxis: vm.boxPlotAxis,
                    lineAttributes: lineAttr
                }
            });
        }

        //----------------------//
        //        BAR CHART     //
        //----------------------//
        if (typeOfGraphObject == 'barChart') {
            eval("var data = [" + vm.barChartData + "]");

            vm.graphObject.content.push({
                type: "barChart",
                data: {
                    data: data,
                    lineAttributes: lineAttr,
                    alt: ''
                }
            });
        }
    }



    function buildAlt(graphType, data) {
        vm.altAttr = '';

        if (graphType == 'dotPlot') {
            angular.forEach(data, function(value) {
                vm.altAttr += "There are " + value[1] + " points above " + value[0] + ". ";
            });

        }
        if (graphType == 'boxPlot') {
            vm.altAttr += "There is a line from " + vm.boxPlotMin + " to " + vm.boxPlotQ1 + ", then a box from " + vm.boxPlotQ1 + " to " + vm.boxPlotMed + ", another box from " + vm.boxPlotMed + " to " + vm.boxPlotQ3 + ", and a line from " + vm.boxPlotQ3 + " to " + vm.boxPlotMax + ".";
        }
        if (graphType == 'function') {
            vm.altAttr = vm.functionForGraph;
        }
        if (graphType == 'label') {
            vm.altAttr = vm.labelText;
        }
    }

    function buildDataSet(graphType, data) {

        if (graphType == 'dotPlot') {
            angular.forEach(data, function(value) {
                for (i = 0; i < value[1]; i++) {
                    vm.dataSet += value[0] + ", ";
                }

            });
            vm.dataSet = vm.dataSet.slice(0, vm.dataSet.length - 2);
        }
        if (graphType == 'boxPlot') {
            vm.dataSet = "Minimum value is " + vm.boxPlotMin + ",  Q1 is " + vm.boxPlotQ1 + ", Median is " + vm.boxPlotMed + ", Q3 is " + vm.boxPlotQ3 + ", and maximum value is " + vm.boxPlotMax + ".";
        }

    }




    function updateBoardAttributes(typeOfGraph) {


        if (typeOfGraph == 'default') {
            console.log("default update board attributes: " + vm.gridShow);
            var boardAttr = {
                "boundingbox": [vm.xmin, vm.ymax, vm.xmax, vm.ymin],
                "axis": JSON.parse(vm.axisShow),
                "grid": JSON.parse(vm.gridShow),
                "showcopyright": false,
                "shownavigation": false,
                "registerEvents": false,
                "snapToGrid": true,
                "snapSizeX": 1,
                "snapSizeY": 1
            };
        } 
        //automatically set graph borders
        /*else if (typeOfGraph == 'boxPlot') {

            eval("var minOutliers = [" + vm.boxPlotMinOutliers + "]");
            eval("var maxOutliers = [" + vm.boxPlotMaxOutliers + "]");

            var minValue;
            var maxValue;

            if (vm.showBoxPlotOutliers == true) {

                minValue = getSmallestNumber(vm.boxPlotMin, minOutliers);
                maxValue = getBiggestNumber(vm.boxPlotMax, maxOutliers);
            } else {
                minValue = vm.boxPlotMin;
                maxValue = vm.boxPlotMax;
            }


            eval("var boardAttr = {boundingbox: [" + (minValue - (maxValue * 0.2)) + ", 10, " + getGridMax(parseInt(maxValue)) + ", -3], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
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

            //   eval("var boardAttr = {boundingbox: [" + (vm.dotPlotMin - (maxNum * 0.2)) + ", " + (getGridMax(parseInt(maxNum))+1) + ", " + getGridMax(parseInt(maxXVal)) + ", -3], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        } else if (typeOfGraph == 'barChart') {
            eval("var data = [" + vm.barChartData + "]");
            var maxX = getMaxData(data);

            eval("var boardAttr = {boundingbox: [" + (0 - 1) + ", " + (maxX + (maxX * 0.2)) + ", " + (data.length + data.length * 0.2) + ", " + (0 - (maxX * 0.2)) + "], axis: false, grid: false, showcopyright: false, shownavigation: false, registerEvents: true, snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };");
        }
*/

        vm.graphObject.board = boardAttr;


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

    function getMaxKeyVal(data) {
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

    function getDisplayName(graphObject) {
        // console.log("graphObject is ");
        // console.log(graphObject);

        var displayName = '';
        if (graphObject.htmlStr != null) {
            displayName = graphObject.htmlStr;
        }
        if (graphObject.elType == "curve") {
            displayName = "curve";
        }
        if (graphObject.elType == "line") {
            displayName = "line " + graphObject.name;
        }
        //console.log("getDisplayName is " + displayName);

        return displayName;
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
}