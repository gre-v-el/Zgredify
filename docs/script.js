

var out = document.getElementById("output");
var inp = document.getElementById("input");

document.getElementById("copy").addEventListener("click", function() {
    out.select();
    out.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(out.value);
});

function report(e) {
    out.classList.add("error");
    out.value = e;
}

document.getElementById("info").addEventListener("click", function() {
    inp.value = 
`<ilość wierzchołków>
    
Po jednej linijce dla każdego wierzchołka:
<ilość krawędzi incydentnych do wierchołka> <lista sąsiednich wierzchołków>

Sąsiednie wierzchołki muszą nawzajem zawierać się w swoich listach

Ten graf:
1--2
| /|
3  4

ma taką reprezentację:
4
2 2 3
3 1 3 4
2 1 2
1 2


Indeksy zaczynają się od 1
`;
});

document.getElementById("zgredify").addEventListener("click", function() {
    out.classList.remove("error");

    var input = inp.value;

    if (input === "") {
        report("Wejście nie może być puste");
        return;
    }
    if (!/^[0-9\s]+$/.test(input)) {
        report("Wejście powinno zawierać tylko liczby i spacje");
        return;
    }
    
    var lines = input.split("\n");

    if (lines.length == 0) {
        report("Wejście powinno zawierać przynajmniej jedną linię");
        return;
    }
    if (!/^[0-9]+$/.test(lines[0])) {
        report("Pierwsza linia musi zawierać liczbę wierzchołków grafu");
        return;
    }

    var verts = parseInt(lines[0]);

    if (lines.length != verts + 1) {
        report("Wejście powinno mieć po jednej linii na każdy wierzchołek grafu");
        return;
    }

    out.value = verts + "\n";
    for(var i = 1; i < lines.length; i++) {
        var line = lines[i];
        line = line.trim().replaceAll(/\s+ /g, " ");

        var nums = line.split(" ").filter((x) => x != "");
        if (nums.length == 0) {
            report("Linia " + i + " jest być pusta");
            return;
        }

        var deg = parseInt(nums[0]);
        if(isNaN(deg)) {
            report("Niepoprawna liczba krawędzi w linii " + i);
            return;
        }
        if (nums.length != deg + 1) {
            report("Lista wierzchołka " + i + " powinna zawierać " + deg + " sąsiadów");
            return;
        }

        if(nums.slice(1, nums.length).some((x) => parseInt(x) < 1 || parseInt(x) > verts || isNaN(parseInt(x)))) {
            report("Wierzchołki sąsiednie w linii " + i + " muszą być z przedziału [1, " + verts + "]");
            return;
        }

        var x=200 + 100*Math.cos(2*Math.PI*i/verts);
        var y=200 + 100*Math.sin(2*Math.PI*i/verts);
        var list = nums
            .slice(1, nums.length) // reject first element
            .map((x) => parseInt(x)) // convert to int
            .filter((x) => x > i) // reject smaller verts
            .map((x) => "-"+(x-1));
        out.value += `${i-1}(x:${x.toFixed(1)},y:${y.toFixed(1)}) ${list.length} ${list.join(" ")}\n`;

    }
});
