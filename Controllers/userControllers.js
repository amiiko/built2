const user = require('../model/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//get user 
//method get 
//path /user/
//access public
const getUser = asyncHandler(async (req, res) => {
    const users = await user.findById(req.user)
    res.status(200).json({ users })
}
)


const updateProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updatedPhoto = {
        filename: req.file.filename,
        size: req.file.size,
        // name:req.body.name
    };

    const me = await user.findById(userId);
    if (!me) {
        return res.status(404).json({ message: 'User not found' });
    }
    //    console.log(updatedPhoto)
    me.photo = updatedPhoto;

    // Save the updated user document
    const result = await me.save();
    if (result) {
        return res.status(201).json({ message: "Successfully Changed" });
    }
}
)

const information = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, phoneNo, city, country, telegram, facebook, instagram } = req.body;
    const updateUser = await user.findByIdAndUpdate(userId, {
        name: name,
        phoneNo: phoneNo,
        telegramUserName: telegram,
        instagramUserName: instagram,
        facebookUserName: facebook,
        country: country,
        city: city,

    }, { new: true })

    if (updateUser) {
        return res.status(201).json({ message: "Successfully Updated" });
    }
    else {
        return res.status(404).json({ message: 'User not found' });
    }
}
)

const emailChange = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { email, password } = req.body;
    const emailUpdate = await user.findById(userId);

    if (!emailUpdate) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Verify the provided password against the stored hashed password
    const passwordMatch = await bcrypt.compare(password, emailUpdate.password);

    if (!passwordMatch) {
        return res.status(200).json({ message: 'Incorrect password' });
    }

    // Password is correct, update the email
    emailUpdate.email = email;

    // Save the updated user
    const updateUser = await emailUpdate.save();
    if (updateUser) {
        return res.status(201).json({ message: 'Email updated successfully' });
    } else {
        return res.status(500).json({ message: 'Failed to update email' });
    }
}
)

const passwordChange = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { newPassword, confirmPassword, password } = req.body;
    const passUpdate = await user.findById(userId);


    if (!passUpdate) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Verify the provided password against the stored hashed password
    const passwordMatch = await bcrypt.compare(password, passUpdate.password);

    if (!passwordMatch) {
        return res.status(200).json({ message: 'Incorrect old password' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(200).json({ message: 'New Password mismatch.' });
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)
    // Password is correct, update the email
    passUpdate.password = hashPassword;

    // Save the updated user
    const updateUser = await passUpdate.save();
    if (updateUser) {
        return res.status(201).json({ message: 'Password changed successfully.' });
    } else {
        return res.status(500).json({ message: 'Failed to update Password.' });
    }
}
)


//get user 
//method get
//path /user/
//access public
const DeleteAllUsers = asyncHandler(async (req, res) => {
    const query = { email: { $regex: "a" } };
    const users = await user.deleteMany(query)
    res.status(200).json({ users })
}
)
//register user 
//method post
//path /user/register
//access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const uniqueID = req.body.uniqueID || "";
    const password = req.body.password || "";
  
    if (password !== "") {
      const userExists = await user.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User exists. Please login.' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      const newUser = await user.create({
        name,
        email,
        password: hashPassword,
        uniqueID: null,
      });
  
      if (newUser) {
        res.cookie("userToken", generateToken(newUser.id), {
          httpOnly: true,
        });
  
        return res.status(201).json({
          _id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          token: generateToken(newUser.id),
        });
      } else {
        return res.status(404).json({ message: "Invalid data" });
      }
    } else if (uniqueID !== "") {
      const userExists = await user.findOne({ uniqueID });
      if (userExists) {
        return res.status(400).json({ message: 'User exists. Please login.' });
      }
  
      const newUser = await user.create({
        name,
        email,
        uniqueID,
        password: null,
      });
  
      if (newUser) {
        res.cookie("userToken", generateToken(newUser.id), {
          httpOnly: true,
        });
  
        return res.status(201).json({
          _id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          token: generateToken(newUser.id),
        });
      } else {
        return res.status(404).json({ message: "Invalid data" });
      }
    } else {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  });
  

//login user 
//method post
//path /user/login
//access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, uniqueID } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    if (password) {
      const users = await user.findOne({ email });
  
      if (users && (await bcrypt.compare(password, users.password))) {
        res.cookie("userToken", generateToken(users.id), {
          httpOnly: true,
        });
  
        return res.status(200).json({
          _id: users.id,
          name: users.name,
          email: users.email,
          token: generateToken(users.id),
        });
      } else {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
    } else if (uniqueID) {
        
      const users = await user.findOne({ email });
  
      if (users && users.uniqueID === uniqueID) {
        res.cookie("userToken", generateToken(users.id), {
          httpOnly: true,
        });
  
        return res.status(200).json({
          _id: users.id,
          name: users.name,
          email: users.email,
          token: generateToken(users.id),
        });
      } else {
        return res.status(400).json({ message: 'User does not exist. Please sign up.' });
      }
    }
  });
  

const isLoggedIn = asyncHandler(async (req, res) => {
    res.json(req.user)
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// const updateUser = asyncHandler(async (req, res) => {
//     const users = await user.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     res.status(200).json(users)
// })
// const deleteUser = asyncHandler(async (req, res) => {
//     const users = await user.findByIdAndRemove(req.params.id)
//     res.status(200).json({ id: req.params.id })

// })

module.exports = {
    getUser,
    registerUser,
    loginUser,
    DeleteAllUsers,
    isLoggedIn,
    updateProfilePic,
    information,
    emailChange,
    passwordChange
    // getUserSearch
    // updateUser,
    // deleteUser

}