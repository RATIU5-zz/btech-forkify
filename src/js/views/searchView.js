class SearchView {
    _parentElement = document.querySelector(".search");

    getQuery() {
        const query =
            // @ts-ignore
            this._parentElement?.querySelector(".search__field").value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        // @ts-ignore
        this._parentElement.querySelector(".search__field").value = "";
    }

    addHandlerSearch(handler) {
        this._parentElement?.addEventListener("submit", e => {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();
