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

// https://stackoverflow.com/a/3540295
function isMobile() {
  var isMobile = false
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true
  }
  return isMobile
}

const haveValues = function (array) {
  result = true
  Array.from(array).forEach((e) => {
    result = result && !isBlank(e.value)
  })
  return result
}

const doKeyDown = function (event, callback) {
  if (event.keyCode == 13) {
    callback()
  }

  let dataTotalWeight = document.querySelector('#data-total-weight')
  let dataTotalSugar = document.querySelector('#data-total-sugar')
  let dataSugarPer100 = document.querySelector('#data-sugar-per-100')

  let id = event.srcElement.id
  switch (id) {
    case 'data-total-weight':
      if (haveValues([dataTotalSugar, dataTotalWeight])) {
        dataSugarPer100.value = (parseFloat(dataTotalWeight.value) / parseFloat(dataTotalSugar.value)) * 100
      }
      break;
    case 'data-total-sugar':
      if (haveValues([dataTotalSugar, dataTotalWeight])) {
        dataSugarPer100.value = (parseFloat(dataTotalWeight.value) / parseFloat(dataTotalSugar.value)) * 100
      }
      break;
    case 'data-sugar-per-100':
      if (haveValues([dataSugarPer100, dataTotalWeight])) {
        dataTotalSugar.value = (parseFloat(dataSugarPer100.value) / 100) * parseFloat(dataTotalWeight.value)
      }
      break;
    default:
      console.error(`Don't know how to handle ${id}`)
  }
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

  let version = USE_VERSION ? `&version=${VERSION}` : ''
  let url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}${version}&lingurita_type=item&__limit=50&__regexi=name&name=${q}`
  apiCall(url, undefined, (json) => {
    if (json.length == 0) {
      window.location.href = `${getHostedUrl()}item.html?q=${q}`
      return
    }
    if (json.length == 1) {
      console.log(json[0])
      window.location.href = `${getHostedUrl()}item.html?code=${json[0].code}`
      return
    }

    let newone = document.createElement('div')
    newone.classList.add('text-container')

    let addLink = document.createElement('a')
    addLink.classList.add('icon')
    addLink.href = `${getHostedUrl()}add.html?q=${q}`
    addLink.textContent = '➕'

    json.forEach((e) => {
      let child = document.createElement('div')
      child.classList.add('bottom-border')
      child.classList.add('search-result')
      child.textContent = e.name
      child.onclick = () => {
        window.location.href = `${getHostedUrl()}item.html?code=${e.code}`
      }

      newone.appendChild(child)
    })

    let linkContainer = document.createElement('div')
    linkContainer.style.textAlign = 'center'
    linkContainer.appendChild(addLink)
    newone.appendChild(linkContainer)

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

const playYT = (spooniesCountConst) => {
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
          if (player.getPlayerState() == YT.PlayerState.PAUSED) {
            return
          }
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
      Array.from(document.querySelectorAll('.add-link')).forEach((e) => {
        e.href = `add.html?code=${urlCode}&q=${qCode}`
      })
    } else {
      document.querySelector("#name").textContent = item.name

      let spooniesCount = parseInt(item.data_total_sugar) / LINGURITA_SUGAR
      const spooniesCountConst = parseInt(spooniesCount)
      let spooniesText = spooniesCount + " lingurițe zahăr<br />"
      while (spooniesCount > 0) {
        spooniesText += '🥄'
        spooniesCount -= 1
      }
      spooniesText += `<br />în ${item.data_total_weight}g`
      spooniesText += `<br />(1 linguriță = ${LINGURITA_SUGAR}g zahăr)`
      document.querySelector("#spoonies").innerHTML = spooniesText
      document.querySelector(".video-container").style.display = 'block'

      let checkYT = setInterval(function () {
        if(YT.loaded){
          playYT(spooniesCountConst)
          console.log('Checking YT loaded')
          clearInterval(checkYT);
        }
      }, 200);
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

// TODO: better validation
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
  let dataTotalWeight = document.querySelector('#data-total-weight').value
  if (isBlank(dataTotalWeight) || parseFloat(dataTotalWeight) < 1) {
    animate('#data-total-weight')
    return
  }
  let dataTotalSugar = document.querySelector('#data-total-sugar').value
  if (isBlank(dataTotalSugar) || parseFloat(dataTotalSugar) < 0) {
    animate('#data-total-sugar')
    return
  }
  let dataSugarPer100 = document.querySelector('#data-sugar-per-100').value
  if (isBlank(dataSugarPer100) || parseFloat(dataSugarPer100) < 0) {
    animate('#data-sugar-per-100')
    return
  }

  body = {
    api_key: API_KEY,
    secret: SECRET,
    lingurita_type: 'item',
    version: `${VERSION}`,
    name: name,
    code: code,
    source: 'user',
    data_total_weight: parseFloat(dataTotalWeight),
    data_total_sugar: parseFloat(dataTotalSugar),
    data_sugar_per_100: parseFloat(dataSugarPer100)
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

const addAboutButton = () => {
  let backButton = document.createElement('a')
  backButton.href = 'about.html'
  backButton.classList.add('about-button')
  backButton.textContent = '❓'

  document.body.appendChild(backButton)
}

const API_KEY = 'lingurita'
const SECRET = '81cc6b0c14e5c4fa11f51f3bad1123f7'
const USE_VERSION = true
const VERSION = '2'
const DONATION_ADDRESS = '3HYZN775GFj7cxoJQSkjhH238DLfRVegjx'
const LINGURITA_SUGAR = 5 // grams
const VIDEO_TIME_PER_SPOONY = 1 // seconds 1 spoon is added to the bowl
const VIDEO_ID = 'bTqVqk7FSmY'

;(function() {
  if (USE_VERSION) { console.info(`Using version ${VERSION}`) }

  let page = 'index'
  let baseUrl = getReadableUrl()
  if (baseUrl.endsWith('.html')) {
    pageElements = baseUrl.split('.')
    pageElements.pop()
    pageElements = pageElements.join('.').split('/')
    page = pageElements.pop()
  }

  let mobile = isMobile()

  console.log(`On page '${page}'`)
  switch (page) {
    case 'index':
      addAboutButton()
      if (mobile) {
        document.querySelector('#scan').href = getScanLink()
      } else {
        document.querySelector('#scan').style.display = 'none'
      }
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
