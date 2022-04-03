var express = require('express');
var router = express.Router();
const multer  = require('multer')
const path= require('path')
//const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 2000000,parts:5},

    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Chỉ đc upload ảnh jpg!');
    }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//router.set('view engine', 'ejs');

// Public Folder
router.use(express.static('./public'));

router.get('/', (req, res) => res.render('index'));

router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            });
        } else {
            if(req.file == undefined){
                res.render('index', {
                    msg: ''
                });
            } else {
                res.render('index', {
                    msg: 'File đã đc Upload!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});


module.exports = router;
