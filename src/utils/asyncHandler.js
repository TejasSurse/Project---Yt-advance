const asyncHandler = (requestHandler ) => {
    (req, res, next ) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler}


/*

// our methong 
// 1 const asyncHandler = () => {}
// 2 const asyncHandler = ( fn ) => { () => {} }
    // in this case we are passing function as a parameter

// ~ to 2 = const asyncHandler = ( fn ) => () => {} // just not curly braces
/*
    const asyncHandler = ( fn ) => {
    async ( req, res, next ) => {
        }    
    }

/*


// ```````` THIS IS TRY CATCH VALA SYNTAX ~~~~~~~~~~~~~~~~~~~~

// const asyncHandler = ( fn ) => async (req, res, next ) => {
//     try {
//         await fn( req, res, next);
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
//     }
// }

*/