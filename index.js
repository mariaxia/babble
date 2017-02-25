(function(){

    const preloaded = document.getElementById('preloaded');
    const form = document.getElementById('user');
    const textarea = form[0];
    const output = document.getElementById('results');

    form.addEventListener('submit', function(event){
        event.preventDefault();
        collection = [];
        output.innerHTML = scramble(event.target[0].value);
    });

    preloaded.addEventListener('change', function(event){
        let text;
        switch (event.target.value){
            case 'swann':
                text = document.getElementById('swann').innerHTML;
                break;
            case 'inferno':
                text = document.getElementById('inferno').innerHTML;
                break;
            case 'genesis':
                text = document.getElementById('genesis').innerHTML;
                break;
            default: 
                text = '';
        }
        textarea.value = text;
    });

    function scramble(input){
        
        let collection = [];
        
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

    function makeGraph(tokens) {

        for (let i = 0; i < tokens.length - 1; i++) {
            let vertexA = getVertex(tokens[i]);
            let vertexB = getVertex(tokens[i + 1]);
            if (!vertexA){
                vertexA = new Vertex(tokens[i]);
                collection.push(vertexA);
            }
            if (!vertexB){
                vertexB = new Vertex(tokens[i + 1]);
                collection.push(vertexB);
            }
            vertexA.addAdjacent(vertexB);
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

})();
