"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport')
let routingData = [
	{
		"name" : "Home",
		"route" : "/",
		"font" : "fa fa-home"
		
	},
	{
		"name" : "About",
		"route" : "/about",
	"font" : "fa fa-user"
	},
	{
		"name" : "Services",
		"route" : "/services",
		"font" : "fa fa-tasks"
	},
	{
		"name" : "Projects",
		"route" : "/projects",
		"font" : "fa fa-terminal"
	},
	{
		"name" : "Contact",
		"route" : "/contact",
		"font" : "fa fa-id-badge"
		
	},
	{
		"name" : "Business Contacts",
		"route" : "/contact-list",
		"font" : "fa fa-id-badge"
	},
	{
		"name" : "Login",
		"route" : "/login",
		"font" : "fa fa-id-badge"
	}


]


//Url encode middleware

router.use(express.urlencoded({extended:true}));

//Home Page

router.get('/',(req,res)=>{

	res.render('home',{
		title:"Portfolio",
		navItems:routingData
	});

});


router.get('/about',(req,res)=>{
res.render('about',{
		title:"Portfolio",
		navItems:routingData
	});
});

router.get('/services',(req,res)=>{
res.render('services',{
		title:"Portfolio",
		navItems:routingData
	});
});

router.get('/projects',(req,res)=>{
res.render('projects',{
		title:"Portfolio",
		navItems:routingData
	});
});
router.get('/contact',(req,res)=>{
res.render('contact',{
		title:"Portfolio",
		navItems:routingData
	});
});

let { isAuth } = require("../config/authentication");

//connect to out Book model
let Contact = require('../models/contactlist');

//Get route for Book List page -- read option
router.get('/contact-list', isAuth, (req, res, next) => {
		Contact.find({})
		.sort("name")
		.exec(function (err, ContactList) {
		if(err)
		{
			return console.error(err);
		}
		else
		{
			res.render('businesscontacts',{
				title:"Portfolio",
				navItems:routingData,
				ContactList : ContactList
			});
		}
	});
});



// GET Route for displaying the Add page - Create Operation
router.get('/add', isAuth, (req, res, next) => {
    res.render('addNewContact', {title: 'Add New Contact', navItems:routingData});
});

// POST Route for processing the Add page - Create Operation
router.post('/add', isAuth, (req, res, next) => {
    let newContact = Contact({
        "name": req.body.name,
        "contact_number": req.body.contact,
        "email": req.body.email
    });
    Contact.create(newContact, (err, Contact) => {
        if(err){
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contact list
            res.redirect('/contact-list');
        }
    })
});

// GET Route for displaying the Edit page - Update Operation
router.get('/edit/:id', isAuth, (req, res, next) => {
    let id = req.params.id;

    Contact.findById(id, (err, contactToUpdate) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.render('editContact', {title: 'Update Contact', Contact: contactToUpdate, navItems:routingData});
        }
    });
});

// POST Route for processing the Add page - Create Operation
router.post('/edit/:id', isAuth, (req, res, next) => {
    let id = req.params.id;

    let updatedContact = Contact({
        "_id": id,
        "name": req.body.name,
        "contact_number": req.body.contact,
        "email": req.body.email
    });

    Contact.updateOne({_id: id}, updatedContact, (err) => {
        if(err){
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/contact-list');
        }
    })
});

//GET request for deletion - Delete Operation
router.get('/delete/:id', isAuth, (req, res, next) => {
    let id = req.params.id;
    Contact.remove({_id:id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/contact-list');
        }
    });
});



router.get('/add',(req,res)=>{
	res.render('addNewContact',{
			title:"Portfolio",
			navItems:routingData
		});
	});

router.post('/contact',(req,res)=>{
	res.redirect('/');
});


router.get('/login',(req,res)=>{
	res.render('login',{
			title:"Portfolio",
			navItems:routingData
		});
	});

// Login post handle
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
	  successRedirect: "/contact-list",
	  failureRedirect: "/login",
	  // failureFlash: true,
	})(req, res, next);
  });

module.exports = router;
