var time_iter = [];
var time_rec = [];
var item_sort = [1,2,3,4,5,6,7,8,9];
function generate(n) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 100));

}

function createTable(arr, idElement) {
    // var html = "<thead><tr>"
    // for (var i = 0; i < arr.length; i++) {
    //     html += '<th scope="col">' + arr[i] + '</th>'
    // }
    // html += " </tr></thead>"
    var html = "<p>"
    for (var i = 0; i < arr.length; i++) {
        html +=  + arr[i] + ' , '
    }
    html += " </p>"
    console.log(html)
    document.getElementById(idElement).insertAdjacentHTML("afterbegin", html);
}

function sort(array) {

    function swap(i, j) {
        var t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
    function less(a, b) { return a < b; }


    function quicksort(left, right) {

        if (left < right) {
            var pivot = array[left + Math.floor((right - left) / 2)],
                left_new = left,
                right_new = right;

            do {
                while (less(array[left_new], pivot)) {
                    left_new += 1;
                }
                while (less(pivot, array[right_new])) {
                    right_new -= 1;
                }
                if (left_new <= right_new) {
                    swap(left_new, right_new);
                    left_new += 1;
                    right_new -= 1;
                }
            } while (left_new <= right_new);

            quicksort(left, right_new);
            quicksort(left_new, right);

        }
    }

    quicksort(0, array.length - 1);

    return array;
}
function sort_iter(a) {
    var stack = [[0, a.length]];
    while (1) {
      var stackLength = stack.length;
      if (! stackLength) {
        break;
      }
      var l = stack[stackLength - 1][0], 
          r = stack[stackLength - 1][1];
      if (l >= r - 1) {
        stack.pop();
        continue;
      }
      var p = r - 1;
      var y = l;
      var tmp;
      for (var i = l; i < r - 1; i++)
        if (a[i] < a[p])
      {
        tmp = a[i];
        a[i] = a[y];
        a[y] = tmp;
        y++;
      }
      tmp = a[y];
      a[y] = a[r - 1];
      a[r - 1] = tmp;
      stack.pop();
      stack.push([y + 1, r]);
      stack.push([l, y]);
    }
    return a;
  }



function generateSort(n) {

    arr = generate(n);
    createTable(arr, "table")

    const before = window.performance.now();
    var sorted_array = sort(arr);
    t_rec = window.performance.now() - before;
    time_rec.push(t_rec)

    createTable(sorted_array, "rec_table")
    n = arr.length 

    const before1 = window.performance.now();
    var sorted_array_iter = sort_iter(arr,0, n-1);
    t_item = window.performance.now() - before1;
    time_iter.push(t_item)

    createTable(sorted_array_iter, "iter_table")

    console.log('rec', time_rec);
    console.log('iter', time_iter);


    myLineChart = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            labels: item_sort,
            datasets: [{
                data: time_rec,
                label: "Recu",
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: time_iter,
                label: "Iter",
                borderColor: "#8e5ea2",
                fill: false
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
}

