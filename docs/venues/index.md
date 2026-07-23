---
lastUpdated: true
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 动态加载 Leaflet CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)

  // 动态加载 Leaflet JS
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.onload = () => {
    const map = L.map('venue-map').setView([39.9147, 116.4106], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map)

    // 加载场馆数据
    fetch('/venues/data.json')
      .then(res => res.json())
      .then(venues => {
        venues.forEach(v => {
          const marker = L.marker([v.lat, v.lng])
            .addTo(map)
            .bindPopup(`
              <div style="min-width:200px">
                <strong style="font-size:15px">${v.name}</strong>
                <span style="color:#f59e0b;margin-left:8px">${'⭐'.repeat(Math.round(Number(v.rating) || 4))}</span>
                <hr style="margin:6px 0">
                <p style="margin:4px 0">📍 ${v.address}</p>
                <p style="margin:4px 0">📞 ${v.phone}</p>
                <p style="margin:4px 0">🕐 ${v.hours}</p>
                <p style="margin:4px 0;color:#666">${(v.features || []).join(' · ')}</p>
              </div>
            `)
        })
      })
      .catch(err => {
        console.error('加载场馆数据失败:', err)
      })

    // 定位用户位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const userIcon = L.divIcon({
            className: 'user-location-icon',
            html: '<div style="background:#4f46e5;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(79,70,229,0.6)"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
          L.marker([pos.coords.latitude, pos.coords.longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>📍 你的位置</b>')
            .openPopup()
          map.setView([pos.coords.latitude, pos.coords.longitude], 13)
        },
        err => {
          console.log('定位失败:', err.message)
        }
      )
    }
  }
  document.head.appendChild(script)
})
</script>

# 📍 附近麻将馆

<div id="venue-map" style="height: 500px; width: 100%; border-radius: 12px; margin: 20px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.1);"></div>

---

## 🏠 场馆列表

点击地图上的标记查看详细信息，或浏览下方列表：

| 名称 | 地址 | 电话 | 营业时间 | 评分 |
|------|------|------|----------|------|
| 大众棋牌室（王府井店） | 北京市东城区王府井大街138号 | 010-65251234 | 10:00-02:00 | ⭐4.5 |
| 雀友会所（国贸店） | 北京市朝阳区建国路88号SOHO现代城B1 | 010-85801234 | 24小时营业 | ⭐4.7 |
| 老舍茶馆棋牌室 | 北京市西城区前门西大街3号 | 010-63036830 | 09:00-23:00 | ⭐4.8 |
| 乐在棋中棋牌会所 | 北京市海淀区中关村大街15号 | 010-82561234 | 12:00-06:00 | ⭐4.3 |
| 欢乐麻将馆（望京店） | 北京市朝阳区望京街10号 | 010-64721234 | 11:00-03:00 | ⭐4.4 |
| 三缺一棋牌室 | 北京市西城区什刹海荷花市场 | 010-64011234 | 13:00-01:00 | ⭐4.6 |

---

## 💡 如何添加新场馆

如果你知道更多好场馆，可以提交场馆信息：

- **名称**：棋牌室/麻将馆的名称
- **地址**：详细地理位置
- **电话**：联系电话
- **营业时间**：开门到关门的时间
- **特色**：自动麻将桌、免费茶水、停车等

也欢迎直接在 [GitHub](https://github.com) 上提交 PR 添加数据！
