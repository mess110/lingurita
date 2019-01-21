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

  let url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}&version=${VERSION}&lingurita_type=item&__limit=50&__regexi=name&name=${q}`
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
    newone.classList.add('text-container')

    json.forEach((e) => {
      let child = document.createElement('div')
      child.innerHTML = e.name
      child.onclick = () => {
        window.location.href = `${getHostedUrl()}item.html?code=${e.code}`
      }

      newone.appendChild(child)
    })

    document.querySelector('.text-container').replaceWith(newone)
  })
}

const apiCall = (url, body, callback) => {
  if (!isBlank(body)) {
    body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }

  fetch(url, body)
    .then((response) => {
      let json = response.json()
      console.log(json);
      return json
    }).then(callback)
    .catch((err) => {
      console.error(err)
    })
}

let player;

const getItem = () => {
  const code = getParameterByName('code')
  const q = getParameterByName('q')

  let url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}&version=${VERSION}&lingurita_type=item&code=${code}`
  apiCall(url, undefined, (json) => {
    let item = json.slice(-1)[0]

    if (item === undefined) {
      document.querySelector("#name").textContent = 'nu a fost gasit'
      document.querySelector('#add-it').style.display = 'block'
      let urlCode = code === null ? '' : code
      let qCode = q === null ? '' : q
      document.querySelector('#add-link').href = `add.html?code=${urlCode}&q=${qCode}`
    } else {
      document.querySelector("#name").textContent = item.name
      let spooniesCount = parseInt(parseInt(item.raw_total_sugar) / LINGURITA_SUGAR)
      const spooniesCountConst = spooniesCount
      let spooniesText = spooniesCount + " lingurițe zahăr<br />"
      while (spooniesCount > 0) {
        spooniesText += '🥄'
        spooniesCount -= 1
      }
      spooniesText += `<br />în ${item.raw_total_weight}g`
      document.querySelector("#spoonies").innerHTML = spooniesText

      player = new YT.Player('video-placeholder', {
        width: 320,
        height: 240,
        videoId: VIDEO_ID,
        playerVars: {
          color: 'white',
          controls: 0,
          autoplay: 1,
        },
        events: {
          onReady: () => {
            player.mute()
            player.playVideo()
            let currentTime = 0

            setInterval(function () {
              currentTime += 1
              if (currentTime >= spooniesCountConst * VIDEO_TIME_PER_SPOONY) {
                player.seekTo(0)
                currentTime = 0
              }
            }, 1000)
          }
        }
      });
    }
    document.querySelector("#code").textContent = code === null ? q : code
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
  let rawTotalWeight = document.querySelector('#raw-total-weight').value
  if (isBlank(rawTotalWeight)) {
    animate('#raw-total-weight')
    return
  }
  let rawTotalSugar = document.querySelector('#raw-total-sugar').value
  if (isBlank(rawTotalSugar)) {
    animate('#raw-total-sugar')
    return
  }

  body = {
    api_key: API_KEY,
    secret: SECRET,
    lingurita_type: 'item',
    version: `${VERSION}`,
    name: name,
    code: code,
    raw_total_weight: rawTotalWeight,
    raw_total_sugar: rawTotalSugar,
  }

  let url = `https://json.northpole.ro/write_only_storage.json`
  apiCall(url, body, (json) => {
    window.location.href = `${getHostedUrl()}item.html?code=${code}`
  })
}

const addBackButton = () => {
  let backButton = document.createElement('a')
  backButton.href = 'javascript:history.back()'
  backButton.classList.add('back-button')
  backButton.textContent = '🔙'

  document.body.appendChild(backButton)
}

const API_KEY = 'lingurita';
const SECRET = '81cc6b0c14e5c4fa11f51f3bad1123f7';
const VERSION = '1-dev';
const DONATION_ADDRESS = '3HYZN775GFj7cxoJQSkjhH238DLfRVegjx';
const LINGURITA_SUGAR = 5; // grams
const VIDEO_TIME_PER_SPOONY = 1; // seconds 1 spoon is added to the bowl
const VIDEO_ID = 'bTqVqk7FSmY';

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
      addBackButton()
      getItem()
      break;
    case 'search':
      addBackButton()
      doSearch()
      break;
    case 'add':
      addBackButton()
      prepareAdd()
      break;
    case 'about':
      addBackButton()
      new QRCode(document.querySelector("#qrcode"), DONATION_ADDRESS)
      document.querySelector('#qrcode-text').textContent = DONATION_ADDRESS
      break;
    default:
      console.error(`Unknown page '${page}'`)
  }
})();
