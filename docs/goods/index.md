---
lastUpdated: true
---

<script setup>
const goods = [
  {
    name: '全自动麻将桌',
    price: '¥2,599',
    img: 'https://placehold.co/400x300/f5f5f5/999?text=自动麻将桌',
    link: '#',
    desc: '静音洗牌，四口进牌，家用/商用两相宜'
  },
  {
    name: '景德镇陶瓷麻将牌',
    price: '¥498',
    img: 'https://placehold.co/400x300/f5f5f5/999?text=陶瓷麻将牌',
    link: '#',
    desc: '手感温润，字迹清晰，送礼自用佳品'
  },
  {
    name: '麻将专用牌桌垫',
    price: '¥89',
    img: 'https://placehold.co/400x300/f5f5f5/999?text=牌桌垫',
    link: '#',
    desc: '防滑减音，保护桌面，多种颜色可选'
  },
  {
    name: '实木麻将桌边柜',
    price: '¥1,299',
    img: 'https://placehold.co/400x300/f5f5f5/999?text=桌边柜',
    link: '#',
    desc: '可放茶水零食，带抽屉收纳筹码'
  },
  {
    name: '雀友专用茶杯套装',
    price: '¥168',
    img: 'https://placehold.co/400x300/f5f5f5/999?text=茶杯套装',
    link: '#',
    desc: '4只装，麻将主题印花，防烫设计'
  },
  {
    name: '人体工学麻将椅',
    price: '¥799',
    img: 'https://placehold.co/400x300/f5f5f5/999?text=麻将椅',
    link: '#',
    desc: '久坐不累，可升降旋转，匹配麻将桌高度'
  }
]
</script>

# 🛒 周边好物

精选麻将周边装备，从牌桌到茶杯，提升你的麻将体验。

---

<div class="goods-grid">
  <a v-for="item in goods" :key="item.name" :href="item.link" target="_blank" class="goods-card">
    <div class="goods-img">
      <img :src="item.img" :alt="item.name" />
    </div>
    <div class="goods-info">
      <h3>{{ item.name }}</h3>
      <p class="desc">{{ item.desc }}</p>
      <p class="price">{{ item.price }}</p>
    </div>
  </a>
</div>

---

## 🛍️ 购买建议

### 自动麻将桌怎么选？

| 价位 | 适合人群 | 推荐品牌 |
|------|----------|----------|
| ¥1,500-3,000 | 家庭娱乐 | 雀友、大将、松乐 |
| ¥3,000-6,000 | 棋牌室商用 | 雀友高端系列、天禄 |
| ¥6,000+ | 高端会所 | 进口品牌 |

### 麻将牌材质对比

| 材质 | 手感 | 耐用度 | 价格 |
|------|------|--------|------|
| 密胺（塑料） | ★★★ | ★★★★★ | ¥50-200 |
| 竹骨 | ★★★★ | ★★★ | ¥100-300 |
| 陶瓷 | ★★★★★ | ★★★★ | ¥300-800 |
| 象牙色树脂 | ★★★★ | ★★★★★ | ¥200-500 |

---

## 📮 推荐好物

知道什么好用的麻将周边？欢迎推荐！我们会定期更新好物清单。

<style scoped>
.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.goods-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.3s, transform 0.2s;
}

.goods-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.goods-img {
  height: 180px;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.goods-info {
  padding: 16px;
}

.goods-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.desc {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.price {
  color: #ef4444;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}
</style>
