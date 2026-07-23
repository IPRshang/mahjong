---
lastUpdated: true
---

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'

const venues = ref([])
const statusText = ref('正在加载地图…')
const statusEmoji = ref('⏳')
const userLocated = ref(false)
const geoError = ref('')
const maxDistance = 10

let mapInstance = null
let userMarker = null
let venueMarkers = []

onMounted(async () => {
  // 1. 并行加载 Leaflet CDN + 场馆数据
  const [leafletOk] = await Promise.allSettled([
    loadLeaflet(),
    fetchVenues()
  ])

  if (!leafletOk || leafletOk.status === 'rejected') {
    statusText.value = '地图资源加载失败，请刷新页面重试'
    statusEmoji.value = '❌'
    return
  }

  if (venues.value.length === 0) {
    statusText.value = '场馆数据加载失败，请刷新页面重试'
    statusEmoji.value = '❌'
    return
  }

  // 2. 尝试定位
  statusText.value = '正在获取你的位置…'
  statusEmoji.value = '📍'
  tryGetLocation()
})

async function fetchVenues() {
  const res = await fetch(import.meta.env.BASE_URL + 'venues/data.json')
  venues.value = await res.json()
}

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) { resolve(); return }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Leaflet CDN 加载失败'))
    // 10 秒 CDN 超时
    setTimeout(() => reject(new Error('Leaflet 加载超时')), 10000)
    document.head.appendChild(script)
  })
}

function tryGetLocation() {
  if (!navigator.geolocation) {
    geoError.value = '你的浏览器不支持定位功能'
    statusText.value = '浏览器不支持定位，已显示珠海视角'
    statusEmoji.value = '🗺️'
    initMap([22.2707, 113.5767], false)
    return
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocated.value = true
      statusText.value = '已定位成功，正在显示附近场馆'
      statusEmoji.value = '✅'
      initMap([pos.coords.latitude, pos.coords.longitude], true)
    },
    err => {
      geoError.value = getGeoErrorMessage(err)
      statusText.value = '无法获取位置，已显示珠海视角'
      statusEmoji.value = '🗺️'
      initMap([22.2707, 113.5767], false)
    },
    {
      enableHighAccuracy: false,  // 桌面端不用高精度，更快
      timeout: 8000,              // 8 秒超时
      maximumAge: 300000          // 允许 5 分钟内的缓存位置
    }
  )

  // 安全兜底：如果 10 秒后还没任何回调，直接 fallback
  setTimeout(() => {
    if (!mapInstance) {
      statusText.value = '定位超时，已显示珠海视角'
      statusEmoji.value = '🗺️'
      initMap([22.2707, 113.5767], false)
    }
  }, 10000)
}

function getGeoErrorMessage(err) {
  switch (err.code) {
    case err.PERMISSION_DENIED:  return '你拒绝了定位请求（可在浏览器设置中开启）'
    case err.POSITION_UNAVAILABLE: return '无法获取位置信息'
    case err.TIMEOUT: return '定位请求超时'
    default: return '未知定位错误'
  }
}

function initMap(centerCoords, isUserLocation) {
  // 防止重复初始化
  if (mapInstance) {
    mapInstance.setView(centerCoords, 14)
  } else {
    mapInstance = L.map('map').setView(centerCoords, 14)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance)
  }

  // 清理旧标记
  if (userMarker) { mapInstance.removeLayer(userMarker); userMarker = null }
  venueMarkers.forEach(m => mapInstance.removeLayer(m))
  venueMarkers = []

  // 用户位置标记
  if (isUserLocation) {
    userMarker = L.marker(centerCoords, {
      icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })
    }).addTo(mapInstance).bindPopup('<b>你的位置</b>').openPopup()
  }

  // 筛选附近场馆
  const nearbyVenues = venues.value.filter(v => {
    const d = getDistance(centerCoords, [v.lat, v.lng])
    return d <= maxDistance
  })

  // 场馆标记
  nearbyVenues.forEach(v => {
    const featuresHtml = (v.features || []).length > 0
      ? `<p style="margin:4px 0;color:#666;font-size:12px">🏷️ ${(v.features || []).join(' · ')}</p>`
      : ''
    const m = L.marker([v.lat, v.lng]).addTo(mapInstance)
      .bindPopup(`
        <div style="min-width:200px">
          <strong style="font-size:15px">${v.name}</strong>
          <span style="color:#666;margin-left:6px;font-size:12px">${v.city || ''}</span>
          <hr style="margin:6px 0">
          <p style="margin:4px 0">📍 ${v.address}</p>
          <p style="margin:4px 0">📞 ${v.phone || '暂无'}</p>
          <p style="margin:4px 0">🕐 ${v.hours || '未知'}</p>
          ${featuresHtml}
        </div>
      `)
    venueMarkers.push(m)
  })

  // 调整视野以包含所有标记
  if (nearbyVenues.length > 0) {
    const allPoints = [centerCoords, ...nearbyVenues.map(v => [v.lat, v.lng])]
    mapInstance.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30], maxZoom: 15 })
  }

  updateVenueTable(nearbyVenues)
}

function getDistance(latlng1, latlng2) {
  const [lat1, lon1] = latlng1
  const [lat2, lon2] = latlng2
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function updateVenueTable(venuesList) {
  const tableBody = document.getElementById('venue-table-body')
  if (!tableBody) return
  tableBody.innerHTML = venuesList.length > 0
    ? venuesList.map(v => `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td><span class="city-tag">${v.city || '-'}</span></td>
        <td>${v.address}</td>
        <td>${v.phone || '暂无'}</td>
        <td>${v.hours || '未知'}</td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;padding:24px;color:#999">附近 ${maxDistance} 公里内暂无收录场馆，欢迎推荐！</td></tr>`
}

// 手动重新定位
function retryLocation() {
  statusText.value = '正在重新定位…'
  statusEmoji.value = '📍'
  geoError.value = ''
  userLocated.value = false
  tryGetLocation()
}

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

# 📍 附近麻将馆

<div style="background: var(--vp-c-bg-soft); border-radius: 8px; padding: 12px 18px; margin: 20px 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
  <span style="font-size:18px">{{ statusEmoji }}</span>
  <span style="flex:1;min-width:180px">{{ statusText }}</span>
  <span v-if="geoError" style="color: var(--vp-c-brand); font-size:13px; max-width:300px">{{ geoError }}</span>
  <button
    @click="retryLocation"
    :disabled="statusEmoji === '📍'"
    style="padding: 6px 18px; border: 1px solid var(--vp-c-brand); border-radius: 6px; background: transparent; color: var(--vp-c-brand); cursor: pointer; font-size: 13px; white-space: nowrap"
    :style="statusEmoji === '📍' ? { opacity: 0.5, cursor: 'not-allowed' } : {}"
  >
    🔄 重新定位
  </button>
</div>

<div id="map" style="height: 500px; width: 100%; margin: 16px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background: #f0f0f0;"></div>

## 场馆列表（{{ maxDistance }}公里内）

<table>
  <thead>
    <tr><th>名称</th><th>城市</th><th>地址</th><th>电话</th><th>营业时间</th></tr>
  </thead>
  <tbody id="venue-table-body">
    <tr><td colspan="5">正在定位并加载数据...</td></tr>
  </tbody>
</table>

---

## 💡 如何添加新场馆

如果你知道更多好场馆，可以提交场馆信息：

- **名称**：棋牌室/麻将馆的名称
- **地址**：详细地理位置
- **电话**：联系电话
- **营业时间**：开门到关门的时间
- **特色**：自动麻将桌、免费茶水、停车等

也欢迎直接在 [GitHub](https://github.com/IPRshang/mahjong) 上提交 PR 添加数据！
