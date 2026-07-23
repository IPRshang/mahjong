---
lastUpdated: true
---

<script setup>
import { onMounted, ref } from 'vue'

const venues = ref([])
const loading = ref(true)
const userLocation = ref(null)
const maxDistance = 10 // 单位：公里，只显示10公里以内的场馆

onMounted(async () => {
  // 动态加载 Leaflet 样式和脚本
  await loadLeaflet()

  // 获取场馆数据
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'venues/data.json')
    venues.value = await res.json()
  } catch (e) {
    console.error('加载场馆数据失败', e)
  } finally {
    loading.value = false
  }

  // 尝试获取用户位置
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLocation.value = [pos.coords.latitude, pos.coords.longitude]
        initMap()
      },
      err => {
        console.warn('无法获取位置，使用默认视角', err)
        // 默认显示珠海（如果用户拒绝定位，则回退到珠海市区）
        userLocation.value = [22.2707, 113.5767]
        initMap()
      }
    )
  } else {
    // 浏览器不支持定位
    userLocation.value = [22.2707, 113.5767] // 珠海
    initMap()
  }
})

function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) {
      resolve()
      return
    }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

function getDistance(latlng1, latlng2) {
  // 球面余弦距离（足够用于几公里内的计算）
  const [lat1, lon1] = latlng1
  const [lat2, lon2] = latlng2
  const R = 6371 // 地球半径(km)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function initMap() {
  if (!userLocation.value) return

  const map = L.map('map').setView(userLocation.value, 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // 添加用户位置标记
  L.marker(userLocation.value, {
    icon: L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    })
  }).addTo(map).bindPopup('<b>你的位置</b>').openPopup()

  // 筛选附近的场馆
  const nearbyVenues = venues.value.filter(v => {
    const distance = getDistance(userLocation.value, [v.lat, v.lng])
    return distance <= maxDistance
  })

  // 在地图上添加附近场馆的标记
  nearbyVenues.forEach(v => {
    const stars = '⭐'.repeat(Math.round(Number(v.rating) || 4))
    const featuresHtml = (v.features || []).length > 0
      ? `<p style="margin:4px 0;color:#666;font-size:12px">${(v.features || []).join(' · ')}</p>`
      : ''
    L.marker([v.lat, v.lng]).addTo(map)
      .bindPopup(`
        <div style="min-width:200px">
          <strong style="font-size:15px">${v.name}</strong>
          <span style="color:#f59e0b;margin-left:6px">${stars}</span>
          <hr style="margin:6px 0">
          <p style="margin:4px 0">📍 ${v.address}</p>
          <p style="margin:4px 0">📞 ${v.phone || '暂无'}</p>
          <p style="margin:4px 0">🕐 ${v.hours || '未知'}</p>
          ${featuresHtml}
        </div>
      `)
  })

  // 更新下方的表格
  updateVenueTable(nearbyVenues)
}

function updateVenueTable(venuesList) {
  const tableBody = document.getElementById('venue-table-body')
  if (!tableBody) return
  tableBody.innerHTML = venuesList.length > 0
    ? venuesList.map(v => `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td>${v.address}</td>
        <td>${v.phone || '暂无'}</td>
        <td>${v.hours || '未知'}</td>
        <td>${v.rating ? '⭐' + v.rating : '-'}</td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;padding:24px;color:#999">附近 ${maxDistance} 公里内暂无收录场馆，欢迎推荐！</td></tr>`
}
</script>

# 📍 附近麻将馆

<div id="map" style="height: 500px; width: 100%; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>

## 场馆列表（{{ maxDistance }}公里内）

<table>
  <thead>
    <tr><th>名称</th><th>地址</th><th>电话</th><th>营业时间</th><th>评分</th></tr>
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
