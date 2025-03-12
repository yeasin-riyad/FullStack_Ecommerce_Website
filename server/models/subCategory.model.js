import mongoose from "mongoose";

const subCategorySchema =new mongoose.Schema({
    name: {type: String, required: true},
    image:{
        type:Array,
        default: [],
    },
        category:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ]
},{
    timestamps: true,
});

const SubCategoryModel = mongoose.model('subCategory', subCategorySchema);
export default SubCategoryModel;