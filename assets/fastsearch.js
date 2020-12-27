var fuse
var searchVisible = false
var firstRun = true
var container = $('#fast-search').get(0)
var maininput = $('#search-input').get(0)
var list = $('#search-results').get(0)
var first = list.firstChild
var last = list.lastChild

var resultsAvailable = false

document.addEventListener('keydown', function (event) {
    if (event.metaKey && event.key == '/') {
        if (firstRun) {
            loadSearch()
            firstRun = false
        }
        if (!searchVisible) {
            container.style.visibility = "visible"
            maininput.focus()
            searchVisible = true
        }
        else {
            container.style.visibility = "hidden"
            document.activeElement.blur()
            searchVisible = false
        }
    }
    if (event.key == 'Escape') {
        if (searchVisible) {
            $("#fastSearch").style.visibility = "hidden"
            document.activeElement.blur()
            searchVisible = false
        }
    }
    if (event.key == 'ArrowDown') {
        if (searchVisible && resultsAvailable) {
            event.preventDefault()
            if (document.activeElement == maininput) { first.focus() }
            else if (document.activeElement == last) { last.focus() }
            else { document.activeElement.parentElement.nextSibling.firstElementChild.focus() }
        }
    }
    if (event.key == 'ArrowUp') {
        if (searchVisible && resultsAvailable) {
            event.preventDefault()
            if (document.activeElement == maininput) { maininput.focus() }
            else if (document.activeElement == first) { maininput.focus() }
            else { document.activeElement.parentElement.previousSibling.firstElementChild.focus() }
        }
    }
})

maininput.onkeyup = function (e) {
    executeSearch(this.value)
}

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText)
                if (callback) callback(data)
            }
        }
    }
    httpRequest.open('GET', path)
    httpRequest.send()
}

function loadSearch() {
    fetchJSONFile('/index.json', function (data) {
        var options = {
            shouldSort: true,
            location: 0,
            distance: 100,
            threshold: 0.4,
            minMatchCharLength: 2,
            keys: [ 'title', 'permalink', 'summary' ]
        }
        fuse = new Fuse(data, options)
    })
}

function executeSearch(term) {
    let results = fuse.search(term)
    let searchitems = ''

    if (results.length === 0) {
        resultsAvailable = false
        searchitems = ''
    } else {
        for ( let item in results.slice(0, 5)) {
            searchitems = searchitems + '<li><a href="' + results[item]['item'].permalink
                + '" tabindex="0">' + '<span class="title">'
                + results[item]['item'].title
                + '</span><br /><span class="sc">' + results[item]['item'].type
                + '</span> — ' + results[item]['item'].date + ' — <em>' + results[item]['item'].contents + '</em></a></li>'
        }
        resultsAvailable = true
    }
    console.log(term, searchitems)

    list.innerHTML = searchitems
    if (results.length > 0) {
        first = list.firstChild.firstElementChild
        last = list.lastChild.firstElementChild
    }
}

document.addEventListener('click', event => {
    if (event.target.id === 'search-click') {
        if (firstRun) {
            loadSearch()
            firstRun = false
        }
        if (!searchVisible) {
            container.style.visibility = "visible" 
            maininput.focus()
            searchVisible = true
        }
        else {
            container.style.visibility = "hidden"
            document.activeElement.blur()
            searchVisible = false
        }
    }
})
