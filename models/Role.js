import mongoose from "mongoose";
const {Schema} = mongoose;

const RoleSchema = new Schema({

    name:{
        type:String,
        required:true
    },
    

},{timestamps:true});

export default mongoose.model('Role', RoleSchema);