angular
    .module('app')
    .directive('fancyView', fancyView);

function fancyView() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'graph.directive.html',
        scope: {
            graphObject: '='
        },
        link: linkFunc,
        controller: fancyViewController,
        controllerAs: 'fancyView',
        bindToController: true // because the scope is isolated
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {
       
    }
}

fancyViewController.$inject = ['$scope', '$window'];

function fancyViewController($scope, $window) {
    var vm = this;
    vm.cb = cb;
    vm.altText = '';

    var currentGraphObject = 0;

    vm.board = false;

    vm.update = update;

  /////////////////////////////////////////////
 ////      INITIALIZE THE BOARD ON LOAD   ////
/////////////////////////////////////////////

     $window.onload = function() {

    // updateBoardAttributes('default');

        vm.altText = '';
        vm.board = JXG.JSXGraph.initBoard('box', vm.graphObject.board);
        runContentLoop();
    };

  //////////////////////////////////////
 ////      WATCH FOR JSON UPDATE    ///
////////////////////////////////////// 

   $scope.$watch(getGraphObject, function(newValue) {
        
        //console.log("graph object changed");

        var elementExists = document.getElementsByClassName('jxgbox');

         if (elementExists.length >0 &&  vm.board != false){
            vm.altText = '';
            JXG.JSXGraph.freeBoard(vm.board);
            vm.board = JXG.JSXGraph.initBoard('box', vm.graphObject.board);
            runContentLoop();
        }
        else if (elementExists.length >0){
            //console.log("elementExists.length > 0");
            vm.board = JXG.JSXGraph.initBoard('box', vm.graphObject.board);

        }
        else {
            console.log("no board");

        }
    }, true);

    //Watch function - returns graph object to be watched above
    function getGraphObject(){
        return vm.graphObject;
    }


  ///////////////////////////////////////
 ////      LOOP THROUGH CONTENT     ////
///////////////////////////////////////

    function runContentLoop(){
        angular.forEach(vm.graphObject.content, function(value, key) {
              //console.log(key + ': ' + value.type);
              currentGraphObject = key;
              cb(vm.board, value.type);
            });
    }

    function cb(board, typeOfGraphObject){
       // console.log("type of vm.graphObject.board is " + typeof vm.graphObject.board);


      /*  if (currentGraphObject == 0){
            vm.altText += vm.graphObject.content[currentGraphObject].data.alt;
         }
         else {
            vm.altText += " " + vm.graphObject.content[currentGraphObject].data.alt;
         }*/


        //----------------------//
        //        FUNCTION      //
        //----------------------//
    
        if (typeOfGraphObject == "function") {
            var txtraw = vm.graphObject.content[currentGraphObject].data.function;
            var fn = board.jc.snippet(txtraw, true, 'x', true);
            
            board.create('functiongraph', [function(x) {
                    return fn(x);
                }],
                vm.graphObject.content[currentGraphObject].data.lineAttributes);
        }

        //-----------------------//
        //        POINT          //
        //-----------------------//

        if (typeOfGraphObject == "point") {
           buildPoint(board,  vm.graphObject.content[currentGraphObject].data.points[0], vm.graphObject.content[currentGraphObject].data.points[1], vm.graphObject.content[currentGraphObject].data.showLabels) ;
        }

        //----------------------//
        ///       LABEL         //
        //----------------------//

        if (typeOfGraphObject == "label"){
            board.create("text",[vm.graphObject.content[currentGraphObject].data.x,vm.graphObject.content[currentGraphObject].data.y,vm.graphObject.content[currentGraphObject].data.text], {cssClass:vm.graphObject.content[currentGraphObject].data.labelStyle, size: 20});
        }
        //----------------------//
        //        LINE          //
        //----------------------//

         if (typeOfGraphObject == "line") {
            //board.create('line', points, lineAttr);
            var pointsAttr = {};
             board.create('line', vm.graphObject.content[currentGraphObject].data.points, vm.graphObject.content[currentGraphObject].data.lineAttributes);
          }

        //----------------------//
        //        DOT PLOT      //
        //----------------------//

          if (typeOfGraphObject == "dotPlot") {
            vm.dataSet = '';

            var dotPlotAxis = board.create('axis', [
                [vm.graphObject.content[currentGraphObject].data.dotPlotMin, 0],
                [vm.graphObject.content[currentGraphObject].data.dotPlotMax, 0]
            ]);

            board.create('ticks', [dotPlotAxis], {
                insertTicks: false,
                strokeColor: '#333333',
                majorHeight: 15,
                drawLabels: true
            });

            angular.forEach(vm.graphObject.content[currentGraphObject].data.data, function(value) {
                for (i = 0; i < value[1]; i++) {
                    board.create('point', [value[0], i+1], {
                        fillColor: '#ec7a00',
                        strokeColor: '#ec7a00'
                    });
                }
            });
        }
        //----------------------//
        //        INEQUALITY    //
        //----------------------//
        if (typeOfGraphObject == "inequality") {
            var inequalityLine = board.create('line', vm.graphObject.content[currentGraphObject].data.points, {
                visible: false
            });
            console.log(vm.graphObject.content[currentGraphObject].data.lineAttributes);
            vm.graphObject.content[currentGraphObject].data.lineAttributes.inverse = vm.graphObject.content[currentGraphObject].data.equality;
           // vm.graphObject.content[currentGraphObject].data.lineAttributes.dash = parseInt(vm.graphObject.content[currentGraphObject].data.lineAttributes.lineDash);
            vm.graphObject.content[currentGraphObject].data.lineAttributes.straightFirst = true;
            vm.graphObject.content[currentGraphObject].data.lineAttributes.straightLast = true;
            vm.graphObject.content[currentGraphObject].data.lineAttributes.firstArrow = false;
            vm.graphObject.content[currentGraphObject].data.lineAttributes.lastArrow = false;

        

        board.create('inequality', [inequalityLine], vm.graphObject.content[currentGraphObject].data.lineAttributes);

            
        }

        //----------------------//
        //        BOX PLOT      //
        //----------------------//
         if (typeOfGraphObject == "boxPlot"){
             if (vm.graphObject.content[currentGraphObject].data.boxPlotOutliers == true){
               console.log(vm.graphObject.content[currentGraphObject].data);
                angular.forEach(vm.graphObject.content[currentGraphObject].data.boxPlotOutliersMin, function(value) {
                        console.log(value);
                        board.create('point', [value, vm.graphObject.content[currentGraphObject].data.boxPlotOffset], {
                            face:'o',
                            fillColor: '#ec7a00',
                            strokeColor: '#ec7a00',
                            withLabel: false
                        });
            
                 });

                angular.forEach(vm.graphObject.content[currentGraphObject].data.boxPlotOutliersMax, function(value) {
               
                         board.create('point', [value, vm.graphObject.content[currentGraphObject].data.boxPlotOffset], {
                            face:'o',
                            fillColor: '#ec7a00',
                            strokeColor: '#ec7a00',
                            withLabel: false
                        });
                     
                 });
            }

           if (vm.graphObject.content[currentGraphObject].data.boxPlotAxis == "true"){
                var boxPlotAxis = board.create('axis', [
                    [vm.graphObject.content[currentGraphObject].data.boxPlotMin, 0],
                    [vm.graphObject.content[currentGraphObject].data.boxPlotQ1, 0]
                ]);
            }

            /*board.create('ticks', [boxPlotAxis, [vm.boxPlotMin, vm.boxPlotQ1, vm.boxPlotMed, vm.boxPlotQ3, vm.boxPlotMax]], 
            //tick attributes
            {
                strokeColor: '#00ff00',
                majorHeight: 15,
                drawLabels: true
            });*/
            
            buildBoxPlotBoxes(vm.board, vm.graphObject.content[currentGraphObject].data);



         }

        //----------------------//
        //        BAR CHART     //
        //----------------------//

          if (typeOfGraphObject == 'barChart') {
            

            var barChartXAxis = board.create('axis', [
                [0, 0],
                [0, 10000]
            ]);
            var barChartYAxis = board.create('axis', [
                [0, 0],
                [10000, 0]
            ]);
            
            var colors = ['#788e52', '#8d37c4', '#4e767a'];

            console.log(vm.graphObject.content[currentGraphObject].data);

            board.create('chart', vm.graphObject.content[currentGraphObject].data.data, {
                chartStyle: 'bar',
                width: -1,
                colors: colors,
                labels: vm.graphObject.content[currentGraphObject].data.data
            });


        }



    }


  ///////////////////////////////////
 ////     Graph Utilities       ////
///////////////////////////////////


   function buildPoint(board, newPointX, newPointY, showLabels){
        console.log(showLabels);
        return board.create('point', [newPointX, newPointY], {
                fillColor: '#f21d67',
                name: '(' + newPointX + ',' + newPointY + ')',
                withLabel: JSON.parse(showLabels)
            });
    }


function buildBoxPlotBoxes(board,  boxPlotData){
            //console.log(boxPlotData);
                //create min-Q1 line
            //console.log("boxPlotData.boxPlotOffset is " + typeof boxPlotData.boxPlotOffset);
            console.log(boxPlotData.boxPlotQ1 + " " + (boxPlotData.boxPlotOffset - 2));
            console.log(boxPlotData.boxPlotQ1 + " " + (boxPlotData.boxPlotOffset + 2));

            boxPlotData.boxPlotOffset = parseInt(boxPlotData.boxPlotOffset);

            var lineAttr = boxPlotData.lineAttributes;
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


     function update(val){
        console.log("update");
        console.log(val);
    }

  //////////////////////////////////////
 ////     General Utilities       /////
//////////////////////////////////////
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