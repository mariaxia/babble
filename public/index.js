/* global d3, collection, visualize */

const preloaded = document.getElementById('preloaded');
const form = document.getElementById('user');
const textarea = form[0];
const output = document.getElementById('results');

// global data
let collection = [];
let links = [];

// event-listening
form.addEventListener('submit', function(event){
    event.preventDefault();
    output.innerHTML = scramble(event.target[0].value);
    visualize();
});

preloaded.addEventListener('change', function(event){
    textarea.value = event.target.value === 'none' ? '' : document.getElementById(event.target.value).innerHTML;
});

// event handlers
function scramble(input){
    collection = [];
    links = [];

    const contents = input.replace(/\./g, ' .')
                    .replace(/\?/g, ' ?')
                    .replace(/;/g, ' ;')
                    .replace(/,/g, ' ,')
                    .replace(/\(/g, ' ,')
                    .replace(/\)/g, ' ,')
                    .replace(/\s+/g, ' ')
                    .replace(/—/g, ' — ')
                    .split(' ');

    const graph = makeGraph(contents);
    let length = contents.length;
    const results = [];
    let vtx = graph[0];

    do {
        length--;
        results.push(vtx.value);
        vtx = vtx.randomWalk();
    } while (length)

    return results.join(' ')
                        .replace(/\s\./g, '.')
                        .replace(/\s,/g, ',')
                        .replace(/\s;/g, ';')
                        .replace(/\s\?/g, '?')
                        + ' ...';
}

// graph-making helper functions
function makeGraph(tokens) {
    let vtxA, vtxB;

    for (let i = 0; i < tokens.length - 1; i++) {
        vtxA = getVertex(tokens[i]);
        vtxB = getVertex(tokens[i + 1]);
        if (!vtxA){
            vtxA = new Vertex(tokens[i]);
            collection.push(vtxA);
        }
        if (!vtxB){
            vtxB = new Vertex(tokens[i + 1]);
            collection.push(vtxB);
        }
        vtxA.addAdjacent(vtxB);
        links.push({ source: vtxA, target: vtxB })
    }

    return collection;
}

function getVertex (value) {
    for (let i = 0; i < collection.length; i++){
        if (collection[i].value === value) return collection[i];
    }
    return null;
}

class Vertex {
    constructor(value){
        this.value = value;
        this.adjacencies = [];
    }
    addAdjacent(vertex){
        this.adjacencies.push(vertex);
    }
    randomWalk(){
        return this.adjacencies[Math.floor(Math.random() * this.adjacencies.length)] || getVertex('.');
    }
}