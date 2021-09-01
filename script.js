(function(){
    const input = document.querySelector('#newnote');
    const form = document.querySelector('#formitnew');
    const selectList = document.querySelector("#slist");
    const listContainer= document.querySelector("#lists");

    let todos = [];
    
    let lists = [
        {id: uuidv4(), text: 'Casa', count: 0}, 
        {id: uuidv4(), text: 'Ucamp', count: 0}, 
        {id: uuidv4(), text: 'Trabajo', count: 0}
    ];

    document.addEventListener('DOMContentLoaded', e => {
        refreshUI();
        lists.forEach( list => {
            selectList.innerHTML += `<option value="${list.id}">${list.text}</option>`;
        });
    });

    function Todo(id, text, list, completed){
        return{id: id, text:text, list:list, completed:completed};
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        const listId = selectList.value;

        if (text === '') return false;
        const newTodo = new Todo(uuidv4(), text, listId, false);
        todos.push(newTodo);
        console.log(todos)
        localStorage.setItem('listaNotas', JSON.stringify(todos))
        input.value = '';
        refreshUI();
    });

    function refreshUI(){
        renderTodos();
        renderLists();
    }

    function renderTodos(){
        const todosContainer = document.querySelector('#todos');
        todosContainer.innerHTML = '';

        todos.forEach(todo => {
            todosContainer.innerHTML += renderTodo(todo);
        });

        // para agregar evento al checkbox
        document.querySelectorAll('.todo label input').forEach(item => {
            item.addEventListener('click', e => {
                const id = e.target.parentNode.parentNode.getAttribute('data-id');
                const index = todos.findIndex(todo => todo.id === id);

                todos[index].completed = !todos[index].completed
            });        
        });

        // para agregar un evento al botón borrar
        document.querySelectorAll('.todo button.borrar').forEach(item => {
            item.addEventListener('click', e => {
                const id = e.target.parentNode.getAttribute('data-id');
                const obj = getItemAndIndex(todos, {id: id});

                todos.splice(obj.index, 1);

                localStorage.setItem('listaNotas', JSON.stringify(todos))

                refreshUI();
            });
        });

        //Para editar el texto
        document.querySelectorAll('.todo button.editar').forEach(item => {
            item.addEventListener('click', e => {
                const id = e.target.parentNode.getAttribute('data-id');
                const texto = todos.find(item => item.id === id)
                console.log(texto);
                document.querySelector('#newnote').value = texto.text;
                
                refreshUI();
            });
        });
    }

    function getItemAndIndex(arr, obj){
        let i = 0;
        const key = Object.keys(obj);
        const value = obj[key];

        for (i = 0; i < arr.length; i++){
            if(arr[i][key] === value){
                return{index: i, item: arr[i]};
            }
        }
    }

    //hay que obtener el argumento texto y después guardarlo en localstorage para finalmente pasarlo al input
    // function getItemAndText(){
    //     const texto = document.getElementById('checkbox-container').innerHTML;
    //     localStorage.getItem('Texto-de-nota', texto);
    //     const nota = localStorage.getItem('Texto-de-nota');
    // }

    function renderTodo(todo){
        return`
        <div class="todo" data-id="${todo.id}">
            <label class="checkbox-container" id="checkbox-container">${todo.text}
                <input name="checkbox" type="checkbox" ${(todo.completed)? 'checked="checked"': ''} />
                <span class="checkmark"></span>
            </label>
            <button class ="borrar"></button>
            <button class= "editar" id="editar" ></button>
        </div>
        `;
    }

    function renderLists(){
        lists.forEach(list => {
            list.count = 0 ;
        });

        todos.forEach(todo => {
            lists.forEach(list => {
                if(todo.list === list.id){
                    list.count++;
                }
            });
        });

        listContainer.innerHTML= '';
        lists.forEach(list => {
            listContainer.innerHTML += renderListItem(list);
        })
    }

    function renderListItem(list){
        return `
            <div class="list">
                <h3>${list.text}</h3>
                ${list.count} tareas
            </div>
        `;
    }
// esta cosa de stackoverflow agrega un ID random al objeto
    function uuidv4() {
        return 'xxxxxxxx-xxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function funcionlocal(){
        // localStorage.getItem('listaNotas', JSON.stringify(todos))
        todos = JSON.parse(localStorage.getItem('listaNotas'))
        refreshUI()
    }

    funcionlocal()

})();
