const express = require('express');
const app = express();
const methodOverride = require('method-override');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(express.static('./public'));


let data = [
    [{
        id: 1,
        todo: 'Hot Garbage'
    },
    {
        id: 2,
        todo: "Filet of Fish"
    },
    {
        id: 3,
        todo: "Mc Rib"
    },
    {
        id: 4,
        todo: "Seafood Fritos"
    }],
    [{
        id: 1,
        todo: 'Create a RESTful API'
    },
    {
        id: 2,
        todo: 'Drink a Coffee'
    },
    {
        id: 3,
        todo: 'Wash the Dog'
    },
    ]
]


// GET /api/todos
// gets all
app.get('/api/todos/:index', (req, res) => {
    console.log('get')
    let index = Number.parseFloat(req.params.index);
    console.log(index);
    res.json(data[index]);
})


// GET /api/todos/:id
app.get('/api/todos/:index/:id', (req, res) => {
    let index = Number.parseFloat(req.params.index);
    console.log(index);
    // convert id to a number
    let id = Number.parseFloat(req.params.id);
    console.log(id);
    // filter checks if the params.id is in the todoList
    let itemToCall = data[index].filter(list => list.id === id);
    // handle error if .filter() returns false
    if (itemToCall == false) {
        // if the length of keys is 0 status = 404
        const status = Object.keys(itemToCall).length ? 200 : 404;
        console.log(`error locating id: ${id}, status: ${status}`);
    }

    res.send(itemToCall);
})

// POST /api/todos
app.post('/api/todos/:index/', (req, res) => {
    let index = Number.parseFloat(req.params.index);
    console.log(index);
    // if there is a body
    if (req.body.todo) {
        const prevId = data[index].reduce((prev, curr) => {
            // determines the previous id number
            // with a reduce function
            if (prev < curr.id) {
                prev = curr.id;
            }
            return prev;
        }, 0)
        // creat newTodo object
        const newTodo = {
            id: (prevId + 1),
            todo: req.body.todo,
        }
        // push newTodo into the todo list
        data[index].push(newTodo);
        // respond with the newTodo
        console.log(newTodo);
        if (req.query.form) {
            let route;
            if (index == 1) {
                route = '/list1'
            } else {
                route = '/list2'
            }
            res.redirect(route);
        } else {
            res.json(newTodo);
        }


    } else {
        res.status(400).json({
            error: '400 : Please provide todo text'
        })
    }
});


// used to update existing items
// if no id, respond 404
// PUT /api/todos/:id
app.put('/api/todos/:index/:id', (req, res) => {
    let index = Number.parseFloat(req.params.index);
    console.log(index);
    let id = Number.parseFloat(req.params.id);
    console.log(id);
    // filter checks if the params.id is in the todoList
    let itemToCall = data[index].find(item => item.id == id);
    // handle error if .find() returns number or undefined
    if (itemToCall != undefined) {
        itemToCall.todo = req.body.todo;
        if (req.query.form) {
            let route;
            if (index == 1) {
                route = '/list1'
            } else {
                route = '/list2'
            }
            res.redirect(route);
        } else {
            res.json(itemToCall);
        }

    } else {
        // if the length of keys is 0 status = 404
        console.log(`error locating id: ${id}, status: 404`);
        res.status(404).json({
            error: '404 : ID does not exist'
        })
    }
})

// DELETE /api/todos/:id
app.delete('/api/todos/:index/:id', (req, res) => {
    let id = Number.parseFloat(req.params.id);
    let index = Number.parseFloat(req.params.index);
    let itemToCall = data[index].find(item => item.id == id);

    if (itemToCall == undefined) {
        console.log(`error locating id: ${id}, status: 404`);
        res.status(404).json({
            error: '404 : ID does not exist'
        })
    } else {
        // reassigns the todoList to everything that isnt the req.body.id
        data[index] = data[index].filter(list => list.id != id);
        console.log(`ID : ${id} ${itemToCall} has been deleted`)
        console.log(data[index]);
        if (req.query.form) {
            let route;
            if (index == 1) {
                route = '/list1'
            } else {
                route = '/list2'
            }
            res.redirect(route);
        } else {
            res.json(todoList);
        }
    }
})

// List1 Route
app.get('/list1', function (req, res) {
    res.render('list1', {
        title: 'To-Do List',
        todoData: data[1],
        index: 1,
    })
})

// Pass in html to res.render
const bodyData = `<h3>Choose Your List</h3>`
// Index Route
app.get('/index', function (req, res) {
    res.render('index', {
        title: 'Server Side Rendering',
        body: bodyData,
    })
})


// List2 Route
app.get('/list2', function (req, res) {
    res.render('list1', {
        title: "Items I'd never want to eat",
        todoData: data[0],
        index: 0,
    })
})


const port = 3000;
app.listen(port, () => {
    console.log(`Running on http://loclhost:${port}`)
})