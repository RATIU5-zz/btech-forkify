import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

import "core-js/stable";
import "regenerator-runtime";

const controlRecipes = async function () {
    try {
        // Get hash id from url
        const id = window.location.hash.slice(1);

        if (!id) return;
        recipeView.renderSpinner();

        // 1. Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 1. Loading recipe
        await model.loadRecipe(id);

        // 2. Rendering recipe
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

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
};
init();
