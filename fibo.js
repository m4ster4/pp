var time_rec = []
var time_iter = []
var item_fibo = []

function fibonacci_rec(num) {
    if (num <= 1) return 1;
    return fibonacci_rec(num - 1) + fibonacci_rec(num - 2);
}


function fibonacci_iter(num) {
    var a = 1, b = 0, temp;
    if (num <= 1) return 1;
    while (num >= 0) {
        temp = a;
        a = a + b;
        b = temp;
        num--;
    }
    return b;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function compareTime(number) {
    time_iter = []
    time_rec = []
    item_fibo = []

    try {
        myLineChart.destroy();
    }
    catch (error) { }
    ;

    item_fibo = [...Array(parseInt(number)).keys()]
    var count = item_fibo.length;

    for (var i = 0; i < count; i++) {
        var item = item_fibo[i];

        const before = window.performance.now();
        rec = fibonacci_rec(item);
        t_rec = window.performance.now() - before;
        time_rec.push(t_rec)

        const before1 = window.performance.now();
        iter =fibonacci_iter(item)
        t_item = window.performance.now() - before1;
        time_iter.push(t_item)
    }
    console.log(time_rec)
    console.log(time_iter)


    myLineChart = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            labels: item_fibo,
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
