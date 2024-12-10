

function sendEmail({ recipient_email, OTP }){

    //wrap email-sending process in promise
    return new Promise((resolve, reject) => {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: myEmail,
                pass: appPassword
            }
        })

        const mail_configs = {
            from: myEmail,
            to: recipient_email,
            subject: 'การยืนยันตัวตน',
            html: 
                `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>

                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

                        <style>
                            .message{
                                display: flex;
                                flex-direction: row;
                            }
                            .message pre{
                                font-family: "Kanit", sans-serif;
                            }
                            .email-content{
                                font-size: 17px;
                                color: black;
                            }
                            .OTP{
                                font-size: 18px;
                                font-weight: bold;
                                color: black;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="message">
                            <pre  class="email-content">OTP สำหรับการเปลี่ยนรหัสผ่านของท่านคือ </pre>
                            <pre class="OTP">${OTP}</pre>
                        </div>
                    </body>
                    </html>`
        }

        transporter.sendMail(mail_configs, function(error, info){
            if(error){
                console.log(error);
                return reject({message: 'An error has occured while sending email.'});
            }
            return resolve({message: 'Email sent succesfully.'});
        });
    })
}

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const express = require('express');
const nodemailer = require('nodemailer');
const connectDB = require('./db.js')
const menuModel = require('./models/Menu.js')
const shopModel = require('./models/Shop.js')
const userModel = require('./models/User.js')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const multer = require('multer');
const path = require('path');
const {Storage} = require('@google-cloud/storage');

const app = express();
app.use(express.json());
// app.use(express.urlencoded({extended: false}));
app.use(cors({credentials: true, origin: 'https://tu-big-meal.netlify.app'})); ///client side origin ////////////////////////////////////////////////////
app.use(cookieParser()); //Use cookie-parser middleware

connectDB();

const myEmail = 'tu.big.meal@gmail.com';
//generated by google for Nodemailer
const appPassword = process.env.NodeMailer_AppPassword;

const server_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const {uploadType} = req.query;

        if(!uploadType || !['profilePic', 'shopPic', 'menu', 'banner'].includes(uploadType)){
            return cb(new Error('Invalid or missing uploadType'));
        }

        const paths = {
            profilePic: './uploads/profilePic',
            shopPic: './uploads/shopPic',
            menu: './uploads/menu',
            banner: './uploads/banner',
        };

        cb(null, paths[uploadType]);
    },
    filename: (req, file, cb) => {
        const {fileName} = req.query;
        cb(null, `${Date.now()}-${fileName}`);
    }
})

// const serviceAccountKey = JSON.parse(process.env.GCS_KEY);
// const serviceAccountKey = process.env.GCS_KEY;

const private_key = process.env.private_key.replace(/\\n/g, '\n');

const serviceAccountKey = {
    "type": "service_account",
    "project_id": "tu-big-meal",
    "private_key_id": process.env.private_key_id,
    "private_key": private_key,
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/tubigmealserviceaccount%40tu-big-meal.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

const gcs = new Storage({
    credentials: serviceAccountKey,
    // keyFilename: './gcs_key.json'
})

const bucketName = "tubigmealgcsbucket";
const bucket = gcs.bucket(bucketName);

//tell multer to use storage configuration above
// const upload = multer({server_storage}); 
const upload = multer({
    storage: multer.memoryStorage()
})

app.use('/uploads/profilePic', express.static(path.join(__dirname, '/uploads/profilePic')));
app.use('/uploads/shopPic', express.static(path.join(__dirname, '/uploads/shopPic')));
app.use('/uploads/menu', express.static(path.join(__dirname, '/uploads/menu')));
app.use('/uploads/banner', express.static(path.join(__dirname, '/uploads/banner')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})
app.post('/sendRecoveryEmail',(req, res) => {
    sendEmail(req.body)
    .then(response => res.json({message: response.message}))
    .catch(error => res.status(500).json({message: error.message}))
})

// app.post('/uploadImage', upload.single('image'), (req,res) => {

//     if(!req.file){
//         return res.status(400).json({message: 'No file uploaded'});
//     }

//     const imageUrl = `http://localhost:3000/uploads/${req.query.uploadType}/${req.file.filename}`;

//     res.json({message: 'File uploaded successfully', imageUrl})
// });

app.post('/uploadImage', upload.single('image'), async(req, res) => {
    const {fileName} = req.query;

    if(!req.file){
        return res.status(400).json({message: 'No file uploaded'});
    }

    try{
        const savedFileName = Date.now() + "-" + fileName;
        
        //convert this to blob
        const blob = bucket.file(savedFileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            }
        });

        blobStream.on('error', (err) => {
            res.status(500).json({message: `Upload error: ${err.message}`});
        });

        blobStream.on('finish', async() => {
            try{
                //make url public
                await blob.makePublic();

                const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`

                res.status(200).json({
                    message: 'File uploaded succesfully',
                    imageUrl: publicUrl
                });

            }catch(err){
                res.status(500).json({message: `Error making file public: ${err.message}`})
            }
        });

        blobStream.end(req.file.buffer)

    }catch(error){
        res.status(500).json({message: err.message});
    }
})

app.get('/menus', async (req,res) => {
    const response = await menuModel.find();
    res.json(response);
})

app.get('/suggestedMenus', async (req,res) => {
    const response = await menuModel.find({suggested: "yes"});
    res.json(response);
})

app.get('/makeSingleLineGCSKey', async (req,res) => {
    const serviceAccount = require('./gcs_key.json');
    let singleLineKey = JSON.stringify(serviceAccount);

    singleLineKey = singleLineKey.replace(/\\n/g, '');
    singleLineKey = singleLineKey.replace(/\\r/g, '');

    console.log(singleLineKey);
    res.send("nothing");
})

app.get('/shops', async (req,res) => {
    const response = await shopModel.find();
    res.json(response);
})

app.get('/searchMenus', async (req,res) => {
    const {searchQuery} = req.query;
    // console.log(searchQuery);

    const response = await menuModel.find({
        menuName: { $regex: searchQuery, $options: 'i'}
    });
    res.json(response);
})

app.get('/suggestedMenusInShop', async (req,res) => {
    const {shopName} = req.query;

    try{
        const menus = await menuModel.find({
            shopName: shopName,
            suggested: "yes"
        });

        res.json(menus);
    }catch (error){
        res.status(500).json({message: "Server error", error})
    }
})

app.get('/othersMenusInShop', async (req,res) => {
    const {shopName} = req.query;

    try{
        const menus = await menuModel.find({
            shopName: shopName,
            suggested: "no"
        });

        res.json(menus);
    }catch (error){
        res.status(500).json({message: "Server error", error})
    }
})

app.get('/menusInShop', async (req,res) => {
    const {shopName} = req.query;

    try{
        const menus = await menuModel.find({shopName: shopName});

        res.json(menus);
    }catch (error){
        res.status(500).json({message: "Server error", error})
    }
})

app.get('/login', async (req,res) => {
    const {gmail, password} = req.query;

    try{
        const user = await userModel.findOne({gmail: gmail});
        if(!user){
            return res.status(404).json({message: "This account isn't exist."});
        }

        if(user.password !== password){
            return res.status(401).json({message: "Wrong password."});
        }

        //Create a JWT token
        const token = jwt.sign({
            userName: user.userName, 
            role: user.role, 
            gmail: user.gmail, 
            password: user.password, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            phoneNum: user.phoneNum,
            address: user.address, 
            profilePic: user.profilePic,
            favourite: user.favourite

        }, JWT_SECRET,{
            expiresIn: '2hrs',
        });

        //Set HttpOnly cookie with the token
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true, //Use secure cookies for HTTPS
            sameSite: 'None', //Allow cross-origin cookies
            maxAge: 2*60*60*1000 //2hrs
        });

        if(user.role === "viewer" || user.role === "owner"){
            res.json({
                message: "Successful login.",
                user: {
                    gmail: user.gmail,
                    password: user.password,
                    userName: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNum: user.phoneNum,
                    address: user.address,
                    profilePic: user.profilePic,
                    role: user.role,
                    favourite: user.favourite
                }
            });
        }

    }catch(error){
        res.status(500).json({message: "Server error while login.", error})
    }
})

app.get('/userInfo', (req,res) => {
    const token = req.cookies.authToken;

    if(!token){
        return res.status(403).json({message: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.role === 'viewer' || decoded.role === 'owner'){
            res.json({
                user:{
                    gmail: decoded.gmail,
                    password: decoded.password,
                    userName: decoded.userName,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    phoneNum: decoded.phoneNum,
                    address: decoded.address,
                    profilePic: decoded.profilePic,
                    role: decoded.role,
                    favourite: decoded.favourite
                }
            })
        }
    }catch(err){
        return res.status(403).json({message: "Invalid token"});
    }
})

app.post('/signup', async (req, res) => {
    const { gmail, password, userName, firstName, lastName, phoneNum, address, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await userModel.findOne({ gmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already has account." });
        }

        // Create a new user based on role
        const newUser = new userModel({
            gmail,
            password,
            userName,
            firstName: role === 'owner' ? firstName : '',
            lastName: role === 'owner' ? lastName : '',
            phoneNum: role === 'owner' ? phoneNum : '',
            address: role === 'owner' ? address : '',
            profilePic: '',
            role,
            favourite: []
        });

        await newUser.save();
        res.status(201).json({ message: 'Successful create user account.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error while create user account.', error });
    }
});

app.patch('/editProfile', async (req, res) => {

    try {
        await userModel.updateOne(
            {gmail: req.body.gmail},
            {$set: req.body.editedData}
        );

        const user = await userModel.findOne({gmail: req.body.gmail});

        //Re-sign a JWT token
        const token = jwt.sign({
            userName: user.userName, 
            role: user.role, 
            gmail: user.gmail, 
            password: user.password, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            phoneNum: user.phoneNum,
            address: user.address, 
            profilePic: user.profilePic,
            favourite: user.favourite

        }, JWT_SECRET,{
            expiresIn: '2hrs',
        });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 2*60*60*1000 //2hrs
        });

        res.json({
            message: "Updated information",
            user: {
                gmail: user.gmail,
                password: user.password,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNum: user.phoneNum,
                address: user.address,
                profilePic: user.profilePic,
                role: user.role,
                favourite: user.favourite
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error while update user informations.', error });
    }
});

app.patch('/editShop', async (req, res) => {

    try {
        await shopModel.updateOne(
            {shopOwner: req.body.owner},
            {$set: req.body.editedData}
        );

        const shop = await shopModel.findOne({shopOwner: req.body.owner});

        res.json({
            message: "Updated information",
            shop: {
                shopName: shop.shopName,
                shopOwner: shop.shopOwner,
                canteen: shop.canteen,
                shopDetail: shop.shopDetail,
                dateTime: shop.dateTime,
                category: shop.category,
                shopImg: shop.shopImg,
                adsImg: shop.adsImg,
                delivery: shop.delivery
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error while update shop informations.', error });
    }
});

app.get('/ownersShop', async(req, res) => {
    const {gmail} = req.query;

    try{
        const shop = await shopModel.findOne({shopOwner: gmail});

        if(!shop){
            return res.status(404).json({message: "No shop data"});
        }

        res.json(shop);
    }catch(error){
        res.status(500).json({message: "Server error", error})
    }
});

app.post('/addShop', async (req, res) => {

    try {
        const newShop = new shopModel(req.body.newData);
        await newShop.save();

        const shop = await shopModel.findOne({shopOwner: req.body.owner});

        res.json({
            message: "Added information",
            shop: {
                shopName: shop.shopName,
                shopOwner: shop.shopOwner,
                canteen: shop.canteen,
                shopDetail: shop.shopDetail,
                dateTime: shop.dateTime,
                category: shop.category,
                shopImg: shop.shopImg,
                adsImg: shop.adsImg,
                delivery: shop.delivery
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'server error while add shop.', error });
    }
});

app.patch('/editShopNameOnMenus', async (req, res) => {

    try {
        const updatedMenu = await menuModel.updateMany(
            {shopName: req.body.oldName},
            {$set: {shopName : req.body.newName}}
        );

        if(updatedMenu.matchedCount === 0){
            return res.json({message: 'No menu informations to be updated'});
        }

        res.status(201).json({ message: 'Successful update shopName in menus'});

    } catch (error) {
        res.status(500).json({ message: 'Server error while update shopName in menus.', error });
    }
});

app.patch('/editMenu', async (req, res) => {

    try {
        const updatedMenu = await menuModel.findOneAndUpdate(
            {menuName: req.body.oldMenuName, shopName: req.body.shopName},
            {$set: req.body.editedData},
            {returnDocument: 'after', new: true}
        );

        if(!updatedMenu){
            return res.status(404).json({message: 'Menu not found'});
        }

        res.json({
            message: "Updated Menu",
            menu: {
                menuName: updatedMenu.menuName,
                normalPrice: updatedMenu.normalPrice,
                menuImg: updatedMenu.menuImg,
                suggested: updatedMenu.suggested
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error occured while updating the menu.', error });
    }
});

app.delete('/deleteMenu', async (req, res) => {
    try{
        const menuName = req.body.menuName;
        const shopName = req.body.shopName;

        const deletedMenu = await menuModel.findOneAndDelete({menuName, shopName})

        if(!deletedMenu){
            return res.status(404).json({message: 'Menu not found'});
        }

        res.json({message: 'Menu deleted successfully.', menu: deletedMenu});
    }catch(error){
        res.status(500).json({message: 'Server error while delete menu.'})
    }
})

app.post('/addMenu', async (req, res) => {
    try{
        const {addedData, shopName, menuName} = req.body;

        const existingMenu = await menuModel.findOne({shopName, menuName});
        if (existingMenu) {
            return res.status(400).json({ message: "Menu already exists." });
        }

        const newData = new menuModel(addedData);
        const newMenu = await newData.save();

        if(!newMenu){
            return res.status(404).json({message: 'Add menu failed.'});
        }

        res.json({message: 'Menu added successfully.', menu: newMenu});
    }catch(error){
        res.status(500).json({message: 'Server error while add menu.'})
    }
})

app.get('/validateEmail', async(req, res) => {
    const {email} = req.query;

    try{
        const user = await userModel.findOne({gmail: email});

        if(!user){
            return res.json({result: "not validated"});
        }

        res.json({result: "validated"});
    }catch(error){
        res.status(500).json({message: "An error occured while validating", error})
    }
});

app.patch('/changePassword', async (req, res) => {

    const {email, newPassword} = req.body;

    try {
        const user = await userModel.findOneAndUpdate(
            {gmail: email},
            {$set: {password: newPassword}},
            {new: true}
        );

        if(!user){
            return res.status(404).json({message: 'User not found.'});
        }

        res.json({message: "Change password successfully."});

    } catch (error) {
        res.status(500).json({ message: 'Server error occured while updating the menu.', error });
    }
});

app.post('/logout',(req, res) => {
    res.clearCookie('authToken',{
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });
    res.json({message: "Logged out successfully."});
})

app.post('/findMenusByListOfNameAndShop', async (req,res) => {

    const list = req.body;

    //Have to create new array because if use the raw array from client, it would contains _id and will prevent mongodb from finding menus
    const conditions = list.map(item => ({
        menuName: item.menuName,
        shopName: item.shopName
    }))

    //-------- sample of conditions --------
    // const conditons = [
    //     {"shopName": "สเต็กเด็กแนว", "menuName": "ฮ็อทด็อก"},
    //     {"shopName": "ก๋วยเตี๋ยวปลาคุณเอ", "menuName": "ก๋วยเตี๋ยวหมูตุ๋น"}
    // ];

    const menus = await menuModel.find({ $or: conditions});

    res.json(menus);
})

app.patch('/editUserFavourite', async (req, res) => {

    const {gmail, list} = req.body;

    try {
        const user = await userModel.findOneAndUpdate(
            {gmail: gmail},
            {$set: {favourite: list}},
            {new: true}
        );

        //Re-sign a JWT token
        const token = jwt.sign({
            userName: user.userName, 
            role: user.role, 
            gmail: user.gmail, 
            password: user.password, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            phoneNum: user.phoneNum,
            address: user.address, 
            profilePic: user.profilePic,
            favourite: user.favourite

        }, JWT_SECRET,{
            expiresIn: '2hrs',
        });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 2*60*60*1000 //2hrs
        });

        res.json({
            message: "Change user's favourite menus successfully.", 
            user: {
                gmail: user.gmail,
                password: user.password,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNum: user.phoneNum,
                address: user.address,
                profilePic: user.profilePic,
                role: user.role,
                favourite: user.favourite
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error occured while updating the user fav menu.', error });
    }
});

app.get('/findShopByShopName', async(req, res) => {
    try{
        const {shopName} = req.query;

        const shop = await shopModel.findOne({shopName});
        if(!shop){
            return res.status(404).json({message: 'Can not find shop.'});
        }
        res.json(shop);

    }catch(error){
        res.status(500).json({ message: 'Error occured while finding shop.', error });
    }
});
