import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const videoSchema = new  Schema(
{   
    videoFile : {
        type : String, // Cloudinary url
        required : true
    },
    thumbnail : {
        type : String, // Cloudinary url
        required : true
    },
    title : {
        type : String,
        required : true,
      
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    duration : {
        type : Number, // cloudinary gives us 
        required : true,
    },
    views : {
        type : Number,
        default : 0,
    },
    isPublished : {
        type : Boolean,
        default : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }

},
{
    timestamps : true
});

// for aggregation querires 

videoSchema.plugin(mongooseAggregatePaginate);

const Video = mongoose.model("Video", videoSchema);

export { Video }