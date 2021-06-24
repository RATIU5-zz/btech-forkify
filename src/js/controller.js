import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import { MODAL_CLOSE_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime";
import { recip } from "prelude-ls";

const controlRecipes = async function () {
    try {
        // Get hash id from url
        const id = window.location.hash.slice(1);

        if (!id) return;
        recipeView.renderSpinner();

        // 1. Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());
        // Update bookmarks view
        bookmarksView.update(model.state.bookmarks);

        // 2. Loading recipe
        await model.loadRecipe(id);

        // 3. Rendering recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        console.error(err);
        recipeView.renderError();
    }
};

const controlSearchResults = async function () {
    try {
        // 1. Get search query
        const query = searchView.getQuery();
        if (!query) return;

        resultsView.renderSpinner();

        // 2. Load search results
        await model.loadSearchResults(query);

        // 3. Render results
        resultsView.render(model.getSearchResultsPage());

        // 4. Render pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.error(err);
        recipeView.renderError();
    }
};

const controlPagination = function (gotoPage) {
    // 1. Render new results
    resultsView.render(model.getSearchResultsPage(gotoPage));

    // 2. Render new pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    // Update recipe servings (In state)
    model.updateServings(newServings);

    // Update the view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    // Add/remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // Update recipe view
    recipeView.update(model.state.recipe);

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
        // Show loading spinner
        addRecipeView.renderSpinner();

        // Upload new recipe data
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);

        // Render recipe
        recipeView.render(model.state.recipe);

        // Success message
        addRecipeView.renderMessage();

        // Render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // Change URL id
        window.history.pushState(null, "", `#${model.state.recipe.id}`);

        // Close form model
        setTimeout(() => {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
        console.error(err);
        addRecipeView.renderError(err.message);
    }
};

const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
