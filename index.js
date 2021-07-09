const express = require('express');
const app = express();

const flash = require('connect-flash')

const ejs = require('ejs');

const connection = require('./database/database');

const Questions = require('./database/Questions');
const Answers = require('./database/Answers')


// Database
connection.authenticate().then(() => {
    console.log('MySQL connected');
}).catch((err) => {
    console.log(err);
});

// EJS as view engine
app.set('view engine', 'ejs');

// Public
app.use(express.static('public'));

//Body-parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes

app.get('/', (req, res) => {
    Questions.findAll({ raw: true, order: [['id', 'desc']] }).then(questions => {
        res.render('index', {
            questions: questions
        });
    })
    
});

app.get('/ask', (req, res) => {
    res.render('ask');
});

app.post('/save-question', (req, res) => {

    var title = req.body.title;
    var question = req.body.question;

    Questions.create({
        title: title,
        question: question
    }).then(() => {
        res.redirect('/')
    });
});

app.get('/question/:id', (req, res) => {
    var id = req.params.id;
    Questions.findOne( { where: {id: id} } ).then(question => {
        if(question != undefined){
            Answers.findAll({ 
                where: {questionId: question.id} 
            }).then(answers => {
                res.render('question', {
                    question: question,
                    answers: answers
                });
            });

        }else{
            res.redirect('/')
        }
    })
});

app.post('/answer', (req, res) => {
    var body = req.body.body;
    var source = req.body.source;
    var questionId = req.body.questionId;

    Answers.create({
        body: body,
        source: source,
        questionId: questionId
    }).then(() => {
        res.redirect('/question/'+ questionId);
    });
});


// Server
app.listen(9091, () => {
    console.log('Active server')
});
