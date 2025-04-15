const multer = require('multer')
const path = require('path')
//Creating and set storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename:  function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


//Initialise Upload function
const upload = multer ({
    storage: storage,
    limits: {filesize: 10000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
})

//Check file for image format
function checkFileType(file, cb){
    const fileTypes = /jpeg|png|jpg|gif/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    }else{
        cb('Error: You can only upload image files')
    }
}

module.exports = upload