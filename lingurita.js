const API_KEY = 'lingurita'
const SECRET = '81cc6b0c14e5c4fa11f51f3bad1123f7'
const USE_VERSION = true
const VERSION = '1'
const DONATION_ADDRESS = '3HYZN775GFj7cxoJQSkjhH238DLfRVegjx'
const LINGURITA_SUGAR = 5 // grams
const VIDEO_TIME_PER_SPOONY = 1 // seconds 1 spoon is added to the bowl
const VIDEO_ID = 'bTqVqk7FSmY'

let player

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
        dataSugarPer100.value = (parseFloat(dataTotalSugar.value) / parseFloat(dataTotalWeight.value)) * 100
      }
      break
    case 'data-total-sugar':
      if (haveValues([dataTotalSugar, dataTotalWeight])) {
        dataSugarPer100.value = (parseFloat(dataTotalSugar.value) / parseFloat(dataTotalWeight.value)) * 100
      }
      break
    case 'data-sugar-per-100':
      if (haveValues([dataSugarPer100, dataTotalWeight])) {
        dataTotalSugar.value = (parseFloat(dataSugarPer100.value) / 100) * parseFloat(dataTotalWeight.value)
      }
      break
    case 'q':
      break
    default:
      console.error(`Don't know how to handle ${id}`)
  }
}

const goToSearch = () => {
  let q = document.querySelector('#q')
  if (isBlank(q.value)) {
    animate('#q')
    animate('#oval')
    return
  }
  window.location.href = `${getHostedUrl()}search.html?q=${q.value}`
}

const doSearch = () => {
  const q = getParameterByName('q')

  let version = USE_VERSION ? `&lingurita_version=${VERSION}` : ''
  let url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}${version}&lingurita_type=item&code=${q}`
  apiCall(url, undefined, (byCodeJson) => {
    let item = byCodeJson.slice(-1)[0]
    if (item === undefined) {
      url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}${version}&lingurita_type=item&__limit=50&__regexi=name&name=${q}`
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
    } else {
      window.location.href = `${getHostedUrl()}item.html?code=${item.code}`
    }
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
  })
}

const setResult = (item) => {
  let spooniesCount
  let totalGrams

  if (item.lingurita_source == 'user') {
    totalGrams = item.data_total_weight
    spooniesCount = parseInt(item.data_total_sugar) / LINGURITA_SUGAR
  } else if (item.lingurita_source == 'infocons') {
    totalGrams = findWeight(item)
    spooniesCount = parseInt(getSugarGrams(item)) / LINGURITA_SUGAR
    // if (isNaN(spooniesCount)) { spooniesCount = 0 }
    // if (totalGrams == undefined) { totalGrams = 0 }
  } else {
    spooniesCount = NaN
    totalGrams = 0
    console.error(`unknown source ${item.lingurita_source}`)
  }

  let spooniesCountConst
  let spooniesText
  if (isNaN(spooniesCount)) {
    spooniesCountConst = 0
    spooniesText = 'nu știu nu cunosc'
  } else {
    spooniesCountConst = parseInt(spooniesCount)
    spooniesText = spooniesCount + " lingurițe zahăr<br />"
    while (spooniesCount > 0) {
      spooniesText += '🥄'
      spooniesCount -= 1
    }
    spooniesText += `<br />în ${totalGrams}g`
    spooniesText += `<br />(1 linguriță = ${LINGURITA_SUGAR}g zahăr)`
  }
  document.querySelector("#spoonies").innerHTML = spooniesText
  document.querySelector(".video-container").style.display = 'block'
  return spooniesCountConst
}

const getItem = () => {
  const code = getParameterByName('code')
  const q = getParameterByName('q')

  let version = USE_VERSION ? `&lingurita_version=${VERSION}` : ''
  let url = `https://json.northpole.ro/write_only_storage.json?api_key=${API_KEY}&secret=${SECRET}${version}&lingurita_type=item&code=${code}`
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
      let spooniesCountConst = setResult(item)

      let checkYT = setInterval(function () {
        if(YT.loaded){
          playYT(spooniesCountConst)
          console.log('Checking YT loaded')
          clearInterval(checkYT)
        }
      }, 200)
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
    name: name,
    code: code,
    lingurita_version: `${VERSION}`,
    lingurita_source: 'user',
    lingurita_type: 'item',
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
      break
    case 'item':
      addBackButton()
      getItem()
      break
    case 'search':
      addBackButton()
      doSearch()
      break
    case 'add':
      addBackButton()
      prepareAdd()
      break
    case 'about':
      addBackButton()
      new QRCode(document.querySelector("#qrcode"), DONATION_ADDRESS)
      document.querySelector('#qrcode-text').textContent = DONATION_ADDRESS
      break
    default:
      console.error(`Unknown page '${page}'`)
  }
})()
