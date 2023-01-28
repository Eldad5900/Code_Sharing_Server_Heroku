import  express  from "express";
import CodeBlock from "../models/codeBlock/codeBlock.js";
import { ObjectId } from 'mongodb';
export const userRouter = express.Router();

//Get by ID Method 
userRouter.get("/get-codeBlock-by-id/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = await CodeBlock.findOne({_id:ObjectId(`${id}`)}).select("-_id");
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  userRouter.patch("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body.code;
      const result = await CodeBlock.findByIdAndUpdate(id, {code:updatedData});
      res.status(201).send(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  userRouter.get("/getAll",async(req,res,next) => {
    try {
        const data = await CodeBlock.find();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    userRouter.post("/addIteam", async (req, res) => {
        try {
          const {type , code , solution } = req.body;
          const codeBlock = new CodeBlock({
            type,
            code,
            solution
          });
      
          const savedData = await codeBlock.save();
          res.status(200).json({savedData});
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    });





export default  userRouter ;