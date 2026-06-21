(function () {
    var sourcePrefix = "/presidio";
    var targetBase = "https://data-privacy-stack.github.io/presidio/";
    var path = window.location.pathname;

    if (path === sourcePrefix || path.indexOf(sourcePrefix + "/") === 0) {
        var suffix = path.slice(sourcePrefix.length);

        if (suffix.charAt(0) === "/") {
            suffix = suffix.slice(1);
        }

        window.location.replace(targetBase + suffix + window.location.search + window.location.hash);
    }
}());
