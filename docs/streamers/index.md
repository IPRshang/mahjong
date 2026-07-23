---
lastUpdated: true
---

<script setup>
import { ref, onMounted } from 'vue'

const streamers = ref([])

onMounted(async () => {
  try {
    const res = await fetch('/streamers/data.json')
    streamers.value = await res.json()
  } catch (e) {
    console.error('加载主播数据失败:', e)
  }
})

const platformColors = {
  'B站': '#fb7299',
  '抖音': '#000000',
  '快手': '#ff4906'
}
</script>

# 🎤 麻将主播推荐

看高手打牌，比看书学得快。这里精选了各大平台的优质麻将主播，学习、娱乐两不误。

---

<div class="streamer-grid">
  <div v-for="s in streamers" :key="s.name" class="streamer-card">
    <div class="card-header">
      <span class="platform-badge" :style="{ background: platformColors[s.platform] || '#666' }">
        {{ s.platform }}
      </span>
      <span class="fans-count">{{ s.fans }}</span>
    </div>
    <div class="card-body">
      <img v-if="s.avatar" :src="s.avatar" :alt="s.name" class="avatar" />
      <div class="card-info">
        <h3>{{ s.name }}</h3>
        <p class="style-tag">🎯 {{ s.style }}</p>
      </div>
    </div>
    <p class="desc">{{ s.description }}</p>
    <div class="card-footer">
      <span class="live-time">🕐 {{ s.liveTime }}</span>
      <a v-if="s.roomUrl" :href="s.roomUrl" target="_blank" class="live-link">进入直播间 →</a>
    </div>
  </div>
</div>

---

## 🎬 精彩视频推荐

<div class="video-grid">
  <div class="video-card">
    <h4>📺 麻将一哥 — 新手必学的5大技巧</h4>
    <iframe
      src="https://player.bilibili.com/player.html?bvid=BV1xx411c7mC&page=1"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
      style="width:100%;height:400px;border-radius:8px">
    </iframe>
  </div>
  <div class="video-card">
    <h4>📺 日麻小课堂 — 从零开始学立直麻将</h4>
    <iframe
      src="https://player.bilibili.com/player.html?bvid=BV1GJ411x7Ea&page=1"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
      style="width:100%;height:400px;border-radius:8px">
    </iframe>
  </div>
</div>

---

## 💡 更多主播？

如果你有喜欢的主播推荐，欢迎补充！直接在 [GitHub](https://github.com) 提交 PR 添加主播信息。

<style scoped>
.streamer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.streamer-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
  transition: box-shadow 0.3s;
}

.streamer-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-body {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.card-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
}

.card-info .style-tag {
  margin: 0;
}

.live-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.live-link:hover {
  text-decoration: underline;
}

.platform-badge {
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.fans-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.streamer-card h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.style-tag {
  color: var(--vp-c-brand);
  font-weight: 600;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.desc {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.live-time {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin: 16px 0;
}

.video-card h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

@media (max-width: 640px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
