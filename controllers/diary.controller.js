const {Op} = require('sequelize') 
const db = require('../models/index')
const Diary = db.diary
const Comment = db.comment
const User = db.user
const {validationResult} = require('express-validator')

//Desc      Get all my diaries page
//Route     /diary/my
//Access    Private   
const getMyDiary =async (req, res)=>{
    try {
        const diaries = await Diary.findAll({
            where: {userId: req.session.user.id},
            raw: true,
            plain: false,
            include: ['user'],
            nest: true
        })
        console.log(req.session.isLogged);
        res.render('diary/my-diary', {
            title: 'My diary',
            diaries: diaries.reverse(),
            isAuthenticated: req.session.isLogged,
            errorMessage: req.flash('error')
        })
    } catch (error) {
        console.log(error);
    }
}



//Desc      Get all diaries
//Route     GET /diary/all
//Access    Private   
const getAllDiary =async (req, res)=>{
    try {
        const page = +req.query.page || 1
        const itemsLimit = 2 
        const diaries = await Diary.findAll({
            raw: true,
            plain: false,
            include: ['user'],
            nest: true,
            limit: itemsLimit,
            offset: (page-1)* itemsLimit 
        })
        const totalData = await Diary.count()
        const lastPage = Math.ceil(totalData /itemsLimit)
        res.render('diary/all-diary', {
            title: 'All Diary',
            diaries: diaries.reverse(),
            isAuthenticated: req.session.isLogged,
            totalData: totalData,
            currentPage: page,
            nextPage: page +1,
            prevPage: page-1,
            hasNextPage: page *itemsLimit < totalData,
            hasPrevPage: page-1,
            lastPage: lastPage,
            currentPageAndPrevNotEqualOne: page != 1 && (page-1)!=1,
            lastPageChecking: lastPage !== page && page +1 != lastPage
        })
    } catch (error) {
        console.log(error);
    }
}



//Desc      Get all my diaries page
//Route     POST /diary/my
//Access    Private   
const addNewDiary = async (req, res)=>{
    try {
        const {text} = req.body
        console.log(req.file)
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const diaries = await Diary.findAll({
                where: {userId: req.session.user.id},
                raw: true,
                plain: false,
                include: ['user'],
                nest: true
            })
            return res.status(400).render('diary/my-diary', {
                title: 'My Diaries',
                diaries: diaries.reverse(), 
                isAuthenticated: req.session.isLogged,
                errorMessage: errors.array()[0].msg
            })
        }
        const fileUrl = req.file ? '/uploads/' + req.file.filename : ''
        await Diary.create({
            imageUrl: fileUrl,
            text: text,
            userId: req.session.user.id
        })
        res.redirect('/diary/my')
    } catch (error) {
        console.log(error);
    }
}



//Desc      Get diary
//Route     /diary/my
//Access    Private   
const getDiaryById =async (req, res)=>{
    try {
        const comments = await Comment.findAll({raw: true})
        console.log(comments);
        const data = await Diary.findByPk(req.params.id, {
            raw: false,
            plain: true,
            include: ['comment', 'user'],
            nest: true
        })
        const diary = await data.toJSON();
        console.log(diary);
        res.render('diary/one-diary', {
            title: 'One diary',
            diary: diary,
            comments: diary.comment.reverse(),
            isAuthenticated: req.session.isLogged,
            errorMessage: req.flash('error')
        })
    } catch (error) {
        console.log(error);
    }
}


//Desc      Update diary
//Route     GET /diary/update/diary
//Access    Private   
const updateDiaryPage =async (req, res)=>{
    try {
        const diary = await Diary.findByPk(req.params.id, {
            raw: true
        })
        
        res.render('diary/update-diary', {
            title: 'Edit diary',
            diary: diary,
            isAuthenticated: req.session.isLogged
        })
    } catch (error) {
        console.log(error);
    }
}



//Desc      Update diary
//Route     POST /diary/update/diary
//Access    Private   
const updateDiary =async (req, res)=>{
    try {
        await Diary.update({text: req.body.text}, {
            where: {id: req.params.id}
        
        })
        res.redirect('/diary/my')
    } catch (error) {
        console.log(error);
    }
}

//Desc      Delete diary
//Route     POST /diary/delete/:id
//Access    Private   
const deleteDiary =async (req, res)=>{
    try {
        await Diary.destroy({
            where: {id: req.params.id}
        
        })
        res.redirect('/diary/my')
    } catch (error) {
        console.log(error);
    }
}


//Desc      Add comment
//Route     POST /diary/comment/:id
//Access    Private   
const addCommentToDiary =async (req, res)=>{
    try {
        const user = await User.findByPk(req.session.user.id) 
        if (req.body.comment === '') {
            req.flash('error', 'Please add your comment')
            res.redirect('/diary/' + req.params.id)
        }
        await Comment.create({
            name: user.name,
            comment: req.body.comment,
            diaryId: req.params.id, 
            userId: user.id
        })
        res.redirect('/diary/' + req.params.id)
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    getMyDiary,
    addNewDiary,
    getDiaryById,
    updateDiaryPage,
    updateDiary,
    deleteDiary,
    addCommentToDiary,
    getAllDiary
}