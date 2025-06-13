import express,{Router} from  "express"


const router = Router()


router.route("/test").get((req,res)=>{
    res.json({
        message:"Api is working"
    })
})


export default router