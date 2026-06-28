(function () {
    var includeNodes = function () {
        return Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    };

    var loadInclude = function (node) {
        var path = node.getAttribute('data-include');
        if (!path) return Promise.resolve();

        return fetch(path, { cache: 'no-cache' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Could not load ' + path);
                }

                return response.text();
            })
            .then(function (html) {
                if (node.hasAttribute('data-include-replace')) {
                    node.outerHTML = html;
                    return;
                }

                node.innerHTML = html;
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    var loadAllIncludes = function () {
        return includeNodes().reduce(function (chain, node) {
            return chain.then(function () {
                return loadInclude(node);
            });
        }, Promise.resolve());
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllIncludes);
        return;
    }

    loadAllIncludes();
})();
