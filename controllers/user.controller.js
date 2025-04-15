const db = require('../models/index')
const User = db.user
const Diary = db.diary

//Desc      Get user profile
//Route     GET /user/profile/:id
//Access    Private   
const getUserProfile =async (req, res)=>{
    const user = await User.findOne({
        raw: true,
        where: {id: req.params.id}
    })
    const diaries =  await Diary.findAll({where:{userId: user.id}, raw:true})
    console.log(diaries);
    try {
        res.render('user/profile', {
            title: user.name,
            user: user,
            diariesLength: diaries.length,
            isAuthenticated: req.session.isLogged
        })
       
    } catch (error) {
        console.log(error);
    }
}



//Desc      Get my profile
//Route     GET /user/profile/my
//Access    Private   
const getMyProfile =async (req, res)=>{
    const user = req.session.user
    const diaries =  await Diary.findAll({where:{userId: user.id}, raw:true})
    try {
        res.render('user/myprofile', {
            title: user.name,
            user: user,
            diariesLength: diaries.length,
            isAuthenticated: req.session.isLogged
        })
       
    } catch (error) {
        console.log(error);
    }
}


//Desc      Get update profile page
//Route     GET /user/profile/update
//Access    Private   
const updateProfilePage =async (req, res)=>{
    const user = req.session.user
    try {
        res.render('user/update-profile', {
            title: user.name,
            user: user,
            isAuthenticated: req.session.isLogged
        })
       
    } catch (error) {
        console.log(error);
    }
}





//Desc      Update profile
//Route     POST /user/profile/update
//Access    Private   
const updateProfile =async (req, res)=>{
    const user = req.session.user
    try {
        const user = await User.findOne({where: {id: req.session.user.id}, raw: true})
        if(req.body.email === user.email){
            return res.redirect('/user/profile/update')
        }
        const newDetails =  await User.update({name: req.body.name, email: req.body.email}, {
            where:{id: req.session.user.id},
            returning: true,
            plain: true,
            raw: true
        })
        req.session.user = newDetails[1]
        req.session.save(err=>{
            if (err) throw err
            return res.redirect('/user/profile/my')
        })
    } catch (error) {
        console.log(error);
    }
} 


module.exports = {
    getUserProfile,
    getMyProfile,
    updateProfilePage,
    updateProfile
}