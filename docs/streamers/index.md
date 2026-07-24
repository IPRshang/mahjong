---
lastUpdated: true
---

<script setup>
import { ref, onMounted, computed } from 'vue'

const streamers = ref([])
const activePlatform = ref('全部')
const platforms = ['全部', 'B站', '抖音', '快手', 'YouTube']

onMounted(async () => {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'streamers/data.json')
    streamers.value = await res.json()
  } catch (e) {
    console.error('加载主播数据失败:', e)
  }
})

const filteredStreamers = computed(() => {
  if (activePlatform.value === '全部') return streamers.value
  return streamers.value.filter(s => s.platform === activePlatform.value)
})

const platformColors = {
  'B站': '#fb7299',
  '抖音': '#000000',
  '快手': '#ff4906',
  'YouTube': '#ff0000'
}

const showVideo = ref({})

function toggleVideo(name) {
  showVideo.value[name] = !showVideo.value[name]
}
</script>

# 🎤 麻将主播推荐

看高手打牌，比看书学得快。这里精选了 **B站、抖音、快手、YouTube** 四大平台的 16 位优质麻将主播，涵盖教学、实战、搞笑、日麻等多种风格。

---

## 按平台筛选

<div class="platform-tabs">
  <button
    v-for="p in platforms"
    :key="p"
    class="tab-btn"
    :class="{ active: activePlatform === p }"
    :style="p !== '全部' ? { borderColor: platformColors[p] } : {}"
    @click="activePlatform = p"
  >
    {{ p }}
  </button>
  <span class="result-count">{{ filteredStreamers.length }} 位主播</span>
</div>

---

<div class="streamer-grid">
  <div v-for="s in filteredStreamers" :key="s.name" class="streamer-card">
    <!-- 头部：平台 + 粉丝 -->
    <div class="card-header">
      <span
        class="platform-badge"
        :style="{ background: platformColors[s.platform] || '#666' }"
      >
        {{ s.platform }}
      </span>
      <span class="fans-count">{{ s.fans }}</span>
    </div>

    <!-- 主体：头像 + 信息 -->
    <div class="card-body">
      <div class="avatar-wrapper">
        <img
          v-if="s.avatar"
          :src="s.avatar"
          :alt="s.name"
          class="avatar"
        />
        <div v-else class="avatar-placeholder" :style="{ background: platformColors[s.platform] + '22', color: platformColors[s.platform] }">
          {{ s.name.charAt(0) }}
        </div>
      </div>
      <div class="card-info">
        <h3>{{ s.name }}</h3>
        <p class="style-tag">🎯 {{ s.style }}</p>
      </div>
    </div>

    <!-- 标签 -->
    <div class="tag-row">
      <span v-for="t in s.tags" :key="t" class="tag">{{ t }}</span>
    </div>

    <!-- 推荐语 -->
    <p class="desc">{{ s.description }}</p>

    <!-- 底部：直播时间 + 链接 -->
    <div class="card-footer">
      <span class="live-time">🕐 {{ s.liveTime }}</span>
      <a v-if="s.roomUrl" :href="s.roomUrl" target="_blank" class="live-link">进入主页 →</a>
    </div>

    <!-- 精彩回放折叠区 -->
    <div v-if="s.videoEmbed" class="video-fold">
      <button class="fold-btn" @click="toggleVideo(s.name)">
        {{ showVideo[s.name] ? '收起回放 ▲' : '📺 精彩回放 ▼' }}
      </button>
      <div v-if="showVideo[s.name]" class="fold-content">
        <iframe
          :src="s.videoEmbed"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
          class="embed-video"
        ></iframe>
      </div>
    </div>
  </div>
</div>

---

## 📊 平台分布概览

<div class="stats-row">
  <div class="stat-item" style="border-left: 3px solid #fb7299">
    <strong>B站</strong>
    <span>{{ streamers.filter(s => s.platform === 'B站').length }} 位主播</span>
  </div>
  <div class="stat-item" style="border-left: 3px solid #000">
    <strong>抖音</strong>
    <span>{{ streamers.filter(s => s.platform === '抖音').length }} 位主播</span>
  </div>
  <div class="stat-item" style="border-left: 3px solid #ff4906">
    <strong>快手</strong>
    <span>{{ streamers.filter(s => s.platform === '快手').length }} 位主播</span>
  </div>
  <div class="stat-item" style="border-left: 3px solid #ff0000">
    <strong>YouTube</strong>
    <span>{{ streamers.filter(s => s.platform === 'YouTube').length }} 位主播</span>
  </div>
</div>

---

## 💡 更多主播？

欢迎推荐你喜欢的麻将主播！直接在 [GitHub](https://github.com/IPRshang/mahjong) 提交 PR 或在 Issues 中留言，我们会持续更新这个列表。

*数据整理于 2026 年 7 月，粉丝数可能已有变动。*

<style scoped>
/* 平台筛选标签 */
.platform-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 16px 0 24px;
}
.tab-btn {
  padding: 6px 18px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 20px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}
.tab-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: #fff;
}
.tab-btn:hover:not(.active) {
  border-color: var(--vp-c-brand-light);
}
.result-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* 卡片网格 */
.streamer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 0 0 32px;
}

/* 卡片 */
.streamer-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 20px;
  transition: box-shadow 0.25s, transform 0.25s;
  display: flex;
  flex-direction: column;
}
.streamer-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.platform-badge {
  color: white;
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.fans-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-weight: 600;
}
.card-body {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
.avatar-wrapper {
  flex-shrink: 0;
}
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--vp-c-divider);
}
.avatar-placeholder {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  border: 2px solid var(--vp-c-divider);
}
.card-info {
  min-width: 0;
}
.card-info h3 {
  margin: 0 0 4px 0;
  font-size: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.style-tag {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand);
}

/* 标签行 */
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.tag {
  display: inline-block;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
}

/* 描述 */
.desc {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.65;
  margin: 0 0 14px 0;
  flex: 1;
}

/* 底部 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}
.live-time {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.live-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition: opacity 0.2s;
}
.live-link:hover {
  opacity: 0.7;
  text-decoration: none;
}

/* 视频折叠区 */
.video-fold {
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 10px;
}
.fold-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-brand);
  font-weight: 600;
  padding: 4px 0;
}
.fold-btn:hover {
  opacity: 0.8;
}
.fold-content {
  margin-top: 10px;
}
.embed-video {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

/* 统计条 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 16px 0 32px;
}
.stat-item {
  background: var(--vp-c-bg-soft);
  padding: 14px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-item strong {
  font-size: 15px;
}
.stat-item span {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .streamer-grid {
    grid-template-columns: 1fr;
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
