// https://stackoverflow.com/a/901144/642778
// https://caniuse.com/#search=URLSearchParams
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[]/g, "name$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return null;
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const animate = (selector) => {
    var elm = document.querySelector(selector)
    elm.classList.add('shake-animation')
    var newone = elm.cloneNode(true)
    elm.parentNode.replaceChild(newone, elm)
}

const isBlank = (item) => {
  return item === undefined || item === null || item === ''
}

const goToSearch = () => {
  let q = document.querySelector('#q')
  if (isBlank(q.value)) {
    animate('#q')
    return
  }
  window.location.href = `${getHostedUrl()}search.html?q=${q.value}`
}

const getReadableUrl = () => {
  return window.location.href.split('?')[0].split('#')[0]
}

const getHostedUrl = () => {
  let url = getReadableUrl()
  if (url.endsWith('.html')) {
    let urlElements = url.split('/')
    urlElements.pop()
    let tempUrl = urlElements.join('/')
    if (!tempUrl.endsWith('/')) { tempUrl += '/' }
    return tempUrl
  } else {
    return url
  }
}

const getScanLink = () => {
  const url = getHostedUrl() + "item.html?code={CODE}"
  return `zxing://scan/?ret=${url}`
}

const doSearch = () => {
  const q = getParameterByName('q')

  let url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}&lingurita_type=item&__limit=50&__regexi=name&name=${q}`
  apiCall(url, undefined, (json) => {
    if (json.length == 0) {
      window.location.href = `${getHostedUrl()}item.html?q=${q}`
      return
    }
    if (json.length == 1) {
      window.location.href = `${getHostedUrl()}item.html?code=${json[0].code}`
      return
    }

    let newone = document.createElement('div')
    newone.classList.add('search')

    json.forEach((e) => {
      let child = document.createElement('div')
      child.innerHTML = e.name
      child.onclick = () => {
        window.location.href = `${getHostedUrl()}item.html?code=${e.code}`
      }

      newone.appendChild(child)
    })

    document.querySelector('.search').replaceWith(newone)
  })
}

const apiCall = (url, body, callback) => {
  if (!isBlank(body)) {
    body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    }
  }

  fetch(url, body)
    .then(function(response) { return response.json() })
    .then(callback)
    .catch((err) => {
      console.error(err)
    })
}

const getItem = () => {
  const code = getParameterByName('code')
  const q = getParameterByName('q')

  let url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}&lingurita_type=item&code=${code}`
  apiCall(url, undefined, (json) => {
      // TODO: use last elelement from the list, it is older
      let item = json[0]

      if (item === undefined) {
        document.querySelector("#name").innerHTML = 'nu a fost gasit'
        document.querySelector('#add-it').style.display = 'block'
        let urlCode = code === null ? '' : code
        let qCode = q === null ? '' : q
        document.querySelector('#add-link').href = `add.html?code=${urlCode}&q=${qCode}`
      } else {
        document.querySelector("#name").innerHTML = item.name
        console.log(json)
      }
      document.querySelector("#code").innerHTML = code === null ? q : code
  })
}

const prepareAdd = () => {
  let code = getParameterByName('code')
  let q = getParameterByName('q')

  if (code !== null) {
    document.querySelector('#code').value = code
  }

  if (q !== null) {
    document.querySelector('#name').value = q
  }
}

const addItem = () => {
  let name = document.querySelector('#name').value
  if (isBlank(name)) {
    animate('#name')
    return
  }
  let code = document.querySelector('#code').value
  if (isBlank(code)) {
    animate('#code')
    return
  }
  let weight = document.querySelector('#weight').value
  if (isBlank(code)) {
    animate('#weight')
    return
  }
  let rawTotalSugar = document.querySelector('#raw-total-sugar').value
  if (isBlank(code)) {
    animate('#raw-total-sugar')
    return
  }

  body = {
    api_key: API_KEY,
    secret: SECRET,
    lingurita_type: 'item',
    version: VERSION,
    name: name,
    raw_total_weight: weight,
    raw_total_sugar: rawTotalSugar,
  }
  // TODO: proper formatting: numbers, etc

  console.log(body)
}

const API_KEY = 'lingurita';
const SECRET = '81cc6b0c14e5c4fa11f51f3bad1123f7';
const VERSION = '1';

(function() {
  let page = 'index'
  let baseUrl = getReadableUrl()
  if (baseUrl.endsWith('.html')) {
    pageElements = baseUrl.split('.')
    pageElements.pop()
    pageElements = pageElements.join('.').split('/')
    page = pageElements.pop()
  }

  console.log(`On page '${page}'`)
  switch (page) {
    case 'index':
      document.querySelector('#scan').href = getScanLink()
      break;
    case 'item':
      getItem()
      break;
    case 'search':
      doSearch()
      break;
    case 'add':
      prepareAdd()
      break;
    case 'about':
      break;
    default:
      console.error(`Unknown page '${page}'`)
  }
})();
