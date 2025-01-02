import jwt from 'jsonwebtoken'

// logic to decrypt the token to fetch userId

export default function(req,res,next){
    try {
        const token = req.headers.authorization.split(" ")[1]; 
        const decrypted = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log("Decrypted token: ", decrypted)
        req.body.userId = decrypted.userId;
        next();
    } catch (error) {
        res.send({
            message: error.message, 
            success: false,
        })
    }
}
