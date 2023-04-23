require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');



/**
 * GET/
 * Homepage
 */

exports.homepage = async(req, res) =>{

try {

    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    
    const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
    const thai = await Recipe.find({"category":"Thai"}).limit(limitNumber);
    const american = await Recipe.find({"category":"American"}).limit(limitNumber);
    const chinese = await Recipe.find({"category":"chinese"}).limit(limitNumber);
    const indian = await Recipe.find({"category":"Indian"}).limit(limitNumber);



    const food = { latest, thai, american, chinese, indian };

    res.render('index', {title: 'Healthy Diet', categories, food});
    
} catch (error) {
    res.satus(500).send({message: error.message || "Error occures"});
}
    
}


/**
 * GET/categories
 * categories
 */
exports.exploreCategories = async(req, res) =>{
    try {
    
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', {title: 'Healthy Diet - Categories', categories});
        
    } catch (error) {
        res.satus(500).send({message: error.message || "Error occures"});
    }
        
    }






    /**
 * GET/Recipe/:id
 * Recipe page
 */
exports.exploreDish = async(req, res) =>{
    try {
        let RecipeId =req.params.id;

        const recipe = await Recipe.findById(RecipeId);
        
        res.render('Recipe', {title: 'Healthy Diet - Recipes', recipe});
        
    } catch (error) {
        res.satus(500).send({message: error.message || "Error occures"});
    }
        
    }







  /**
 * Search
 * SearchRecipe 
 */


exports.searchRecipe = async(req, res) =>{

    try {
        let searchTerm = req.body.searchTerm;

        let recipe =await Recipe.find({ $text: {$search : searchTerm, $diacriticSensitive: true}});
        
        res.render('search', {title: 'Healthy Diet - Search', recipe});

    } catch (error) {
        res.satus(500).send({message: error.message || "Error occures"});
    }


}



 /**
 * GET/ explore-latest
 * exploreLatest 
 */


 exports.exploreLatest = async(req, res) =>{

    try {
        const limitNumber =20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        
        res.render('explore-latest', {title: 'Healthy Diet - Explore latest', recipe});

    } catch (error) {
        res.satus(500).send({message: error.message || "Error occures"});
    }


}






 /**
 * GET/ explore-random
 * exploreRandom 
 */


 exports.exploreRandom = async(req, res) =>{

    try {
        let count = await Recipe.find().countDocuments();
        let random= Math.floor(Math.random()* count);
        let recipe = await Recipe.findOne().skip(random).exec();
        
        res.render('explore-random', {title: 'Healthy Diet - Explore Random', recipe});

    } catch (error) {
        res.satus(500).send({message: error.message || "Error occures"});
    }


}









    

    /**
 * GET/categories/:id
 * categoriesById
 */
exports.exploreCategoriesById = async(req, res) =>{
    try {
    
        let categoryId = req.params.id;

        const limitNumber = 20;
        const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);
        res.render('categories', {title: 'Healthy Diet - Categories', categoryById});
        
    } catch (error) {
        res.satus(500).send({message: error.message || "Error occures"});
    }
        
    }





     /**
 * GET/ submit-recipe
 * submitRecipe 
 */


 exports.submitRecipe = async(req, res) =>{
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', {title: 'Healthy Diet - submit Recipe', infoErrorsObj, infoSubmitObj});

}


/**
 * POST/ submit-recipe
 * submitonPost 
 */


    exports.submitonPost = async(req, res) =>{

        try {

            let imageUploadFile;
            let uploadPath;
            let newImageName;

            if(!req.files || Object.keys(req.files).length===0){
                console.log('No files were uploaded');
            }
            else{
                imageUploadFile = req.files.image;
                newImageName = Date.now() + imageUploadFile.name;

                uploadPath = require('path').resolve('./')+'/public/uploads/' + newImageName;

                imageUploadFile.mv(uploadPath, function(err){
                    if(err) return res.satus(500).send(err);
                })
            }

            const newRecipe = new Recipe({
                name: req.body.name,
                description: req.body.description,
                email: req.body.email,
                ingredients: req.body.ingredients,
                category: req.body.category,
                image: newImageName
            });

            await newRecipe.save();


            req.flash('infoSubmit','Recipe has been added.')
            res.redirect('/submit-recipe');
        } catch (error) {
            req.flash('infoErrors', error);
            res.redirect('/submit-recipe');

            
        }
        

}





















// async function insertDummyCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "American-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             }
//         ]);
//     }catch (error){
//         console.log('err', + error)

//     }
// }

// insertDummyCategoryData();


























// async function insertDummyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Using a pestle and mortar, bash the garlic to a paste. Finely grate the ginger, add it to the mortar and mix well.
//         Carefully halve the chillies lengthways. Firmly hold the stalk end of each half and run a teaspoon down the insides to scoop out the seeds. 
//         Finely chop the chillies and place in the mortar. Wash your hands thoroughly.
//         Finely grate the lemon zest and add to the mortar.`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Thai", 
//         "image": "poha.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Indian", 
//         "image": "poha.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Thai", 
//         "image": "poha.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Indian", 
//         "image": "poha.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Indian", 
//         "image": "poha.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Thai", 
//         "image": "poha.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Thai", 
//         "image": "poha.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDummyRecipeData();