const express = require('express');
const app = express();
const session = require('express-session')
const bcypt = require('bcryptjs')
const passport = require('passport')

const flash = require('connect-flash')

const ejs = require('ejs');

const connection = require('./database/database');

const Questions = require('./database/Questions');
const Answers = require('./database/Answers')
const Users = require('./database/Users')

const admin = require('./routes/admin')
const users = require('./routes/users')

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

//Session
app.use(session({
    secret: '12345',
    resave: true,
    saveUninitialized: true
}))

//Flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    // res.locals.user = req.user || null
    next()
})


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




// Admin routes
app.use('/admin', admin)

// Users routes
app.use('/users', users)

// Server
app.listen(9091, () => {
    console.log('Active server')
});