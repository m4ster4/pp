$(document).ready(function () {
  var num;
  var $start = $('#start');
  var $start_rec = $('#start-rec');
  var $source = $("#Source");
  var $aux;
  var $target;
  var movesCount;
  var maxMoves;
  var intervalId;
  const DISK_HEIGHT = 20;
  const MIN_WIDTH = 25;
  const BAR_TOP = ($(".bar").offset().top) - 20;
  var t0;
  var t1;
  var tab_time = [];
  var time_rec = []
  var time_iter = []
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  function compareTime(rings) {
    var hanoi = function (disc, src, aux, dest) {
      if (disc > 0) {
        hanoi(disc - 1, src, dest, aux);
        console.log('Move disc ' + disc + ' from ' + src + ' to ' + dest);
        hanoi(disc - 1, aux, src, dest);
      }
    };
    var generateHanoiMovesIterative = function (numberOfDisks) {
      var dir = (numberOfDisks % 2 === 0) ? 1 : -1;
      var rods = [[], [], []];
      var i, rodMin;

      for (i = 0; i < numberOfDisks; i += 1) {
        rods[0].push(numberOfDisks - i);
      }
      rodMin = 0;
      var numberOfMoves = (1 << numberOfDisks) - 1;

      var next = [1, 2, 0];
      var prev = [2, 0, 1];

      var moves = [];
      var moveSmallest = true;

      for (i = 0; i < numberOfMoves; i++) {
        if (moveSmallest) {
          var oldRodMin = rodMin;
          rodMin = (oldRodMin + dir + 3) % 3;

          moveDisk(oldRodMin, rodMin);
        }
        else {
          if (topDiskSize(next[rodMin]) > topDiskSize(prev[rodMin])) {
            moveDisk(prev[rodMin], next[rodMin]);
          }
          else {
            moveDisk(next[rodMin], prev[rodMin]);
          }
        }
        moveSmallest = !moveSmallest;
      }

      return moves;

      function topDiskSize(rodIndex) {
        if (rods[rodIndex].length === 0) return Number.MAX_VALUE;

        var rod = rods[rodIndex]
        return rod[rod.length - 1];
      }

      function moveDisk(from, to) {
        // 1-FROM ROD, 2-USING ROD, 3-TO ROD
        moves.push([from + 1, to + 1].join(' -> '));
        rods[to].push(rods[from].pop());
      }
    };
    time_rec = []
    time_iter = []
    tab_time = []
    for (var i = 1; i <= rings ; i++) {
      const before_rec = window.performance.now();

      hanoi(i, 'src', 'aux', 'dest');
      t_rec = window.performance.now() - before_rec;
      time_rec.push(t_rec)

      const before_iter = window.performance.now();
      generateHanoiMovesIterative(i)
      t_iter = (window.performance.now() - before_iter);
      time_iter.push(t_iter)
      tab_time.push(i)
      // console.log('r', time_rec)
      // console.log('i', time_iter)
    }
  }

  $start.on("click", function () {
    if (intervalId) {
      return;
    }
    tab_time = []
    $('.disc').remove();
    draw();
    compareTime(num);
    
    console.log('r', time_rec)
    console.log('i', time_iter)
    maxMoves = Math.pow(2, num) - 1;
    $aux = $("#Aux");
    $target = $("#Target");
    if (num % 2 === 0) {
      $target = $("#Aux");
      $aux = $("#Target");
    }
    movesCount = 0;
    // const before = window.performance.now();
    intervalId = setInterval(function () {
      if (movesCount < maxMoves) {
        makeMoves();
      }
      else {
        clearInterval(intervalId);
        intervalId = null;
        movesCount = 0;

      }
    }, 800)

    myLineChart = new Chart(document.getElementById("line-chart"), {
      type: 'line',
      data: {
        labels: tab_time,
        datasets: [{
          data: time_iter,
          label: "Iter",
          borderColor: "#3e95cd",
          fill: false
        }, {
          data: time_rec,
          label: "Rec",
          borderColor: "#8e5ea2",
        }
        ]
      },
      options: {
        responsive:false,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Compare recursive and iterative algorithm '
        }
  
      }
    });
  
  });

  $start_rec.on("click", function () {
    if (intervalId) {
      return;
    }
    tab_time = []


    $('.disc').remove();
    draw();
    $aux = $("#Aux");
    $target = $("#Target");
    movesCount = 0;
    num = $('#number').val();
    if (num % 2 === 0) {
      $target = $("#Aux");
      $aux = $("#Target");
    }
    maxMoves = Math.pow(2, num) - 1;

    makeMovesRec(maxMoves, $source, $target, $aux);
    compareTime(num);

    myLineChart = new Chart(document.getElementById("line-chart"), {
      type: 'line',
      data: {
        labels: tab_time,
        datasets: [{
          data: time_iter,
          label: "Iter",
          borderColor: "#3e95cd",
          fill: false
        }, {
          data: time_rec,
          label: "Rec",
          borderColor: "#8e5ea2",
        }
        ]
      },
      options: {
        responsive:false,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Compare recursive and iterative algorithm '
        }
  
      }
    });

  });


  function makeMovesRec(n, from_rod, to_rod) {
    sleep(800).then(() => {

      legalMove(from_rod, to_rod);
      movesCount++;

      if (n > 1) {

        switch (movesCount % 3) {
          case 0:

            makeMovesRec(n - 1, $source, $target);

            break;
          case 1:

            makeMovesRec(n - 1, $source, $aux);

            break;
          case 2:

            makeMovesRec(n - 1, $target, $aux);

            break;
        }

      }
      //  else{
      //   console.log(tab_time)


      //  }
    })
  }

  function makeMoves() {
    //             t0 = performance.now();

    if (movesCount % 3 === 0) {
      legalMove($source, $target);
    }
    if (movesCount % 3 === 1) {
      legalMove($source, $aux);
    }
    if (movesCount % 3 === 2) {
      legalMove($target, $aux);
    }
    movesCount++;
  }

  //check for a legal move, then make that move!
  function legalMove(divA, divB) {
    var diskOnA = $('#' + divA.attr('id') + ' .disc')[0];
    var diskOnB = $('#' + divB.attr('id') + ' .disc')[0];
    //no disk on divB
    if (diskOnA && !diskOnB) {
      move(divA, divB);
      return;
    }
    //no disk on divA
    else if (!diskOnA && diskOnB) {
      move(divB, divA);
      return;
    }
    //If both discs exist, you have to compare lengths
    var lenA = parseInt(diskOnA.style.width, 10);
    var lenB = parseInt(diskOnB.style.width, 10);
    if (lenA < lenB) {
      move(divA, divB);
      return
    }
    else {
      move(divB, divA);
      return;
    }
    alert("an error has occurred");
    return;
  }

  function move(fromDiv, toDiv) {
    var toId = toDiv.attr('id')
    var disksOnTarget = $('#' + toId + ' .disc').length;

    var newTop = (BAR_TOP - disksOnTarget * DISK_HEIGHT) + "px";
    var diskToMove = $('#' + fromDiv.attr('id') + ' .disc').first();
    diskToMove.fadeOut(1, function () {
      diskToMove.css({ 'top': newTop });
      diskToMove.prependTo(toDiv).fadeIn(1)
    })
  }

  //draw the disks onto the source div
  function draw() {
    num = $('#number').val();
    for (let i = 0; i < num; i++) {
      var disc = $("<div></div>");
      disc.attr('class', "disc");
      disc.attr('id', 'd' + (i + 1));
      disc.css({ 'width': (i + 1) * MIN_WIDTH + "px", 'top': BAR_TOP - (num - i - 1) * DISK_HEIGHT, 'height': DISK_HEIGHT + "px", 'background-color': getRanC() });
      disc.hide().appendTo($source).fadeIn(i * 50);
    }
  }

  //helper function to get a random color for each disk
  function getRanC() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }


  
  


})